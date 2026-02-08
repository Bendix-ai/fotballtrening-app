-- ============================================================
-- FotballTrening App - Multi-Level Admin Migration
-- Run AFTER 001-004. Adds club_admin / team_admin distinction,
-- admin_team_assignments junction table, create_club RPC,
-- and scoped dashboard metrics.
-- ============================================================

-- ============================================================
-- 1. Add admin_type column to profiles
-- ============================================================

ALTER TABLE public.profiles
ADD COLUMN admin_type TEXT CHECK (admin_type IN ('club_admin', 'team_admin'));

-- Backfill existing admins as club_admin
UPDATE public.profiles SET admin_type = 'club_admin' WHERE role = 'admin';

-- ============================================================
-- 2. Admin team assignments junction table
-- ============================================================

CREATE TABLE public.admin_team_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(admin_id, team_id)
);

CREATE INDEX idx_admin_team_assignments_admin_id ON public.admin_team_assignments(admin_id);
CREATE INDEX idx_admin_team_assignments_team_id ON public.admin_team_assignments(team_id);

-- ============================================================
-- 3. RLS for admin_team_assignments
-- ============================================================

ALTER TABLE public.admin_team_assignments ENABLE ROW LEVEL SECURITY;

-- Admins can read their own assignments
CREATE POLICY "ata_select_own" ON public.admin_team_assignments
    FOR SELECT USING (admin_id = auth.uid());

-- Club admins can read all assignments in their club
CREATE POLICY "ata_select_club_admin" ON public.admin_team_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND role = 'admin'
              AND admin_type = 'club_admin'
              AND club_id = (SELECT club_id FROM public.profiles WHERE id = admin_team_assignments.admin_id)
        )
    );

-- Club admins can insert assignments within their club
CREATE POLICY "ata_insert_club_admin" ON public.admin_team_assignments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND role = 'admin'
              AND admin_type = 'club_admin'
        )
    );

-- Club admins can delete assignments within their club
CREATE POLICY "ata_delete_club_admin" ON public.admin_team_assignments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
              AND role = 'admin'
              AND admin_type = 'club_admin'
        )
    );

-- ============================================================
-- 4. create_club RPC (SECURITY DEFINER — callable before auth)
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_club(p_club_name TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_club_id UUID;
BEGIN
    IF p_club_name IS NULL OR LENGTH(TRIM(p_club_name)) < 2 THEN
        RAISE EXCEPTION 'Klubbnavn må være minst 2 tegn';
    END IF;

    IF EXISTS (SELECT 1 FROM public.clubs WHERE LOWER(name) = LOWER(TRIM(p_club_name))) THEN
        RAISE EXCEPTION 'En klubb med dette navnet finnes allerede';
    END IF;

    INSERT INTO public.clubs (name)
    VALUES (TRIM(p_club_name))
    RETURNING id INTO v_club_id;

    RETURN v_club_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_club(TEXT) TO anon, authenticated;

-- ============================================================
-- 5. Updated handle_new_user() trigger
--    Now handles admin_type and managed_team_ids
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_admin_type TEXT;
    v_team_id UUID;
BEGIN
    -- Determine admin_type (null for players)
    v_admin_type := NULL;
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'player') = 'admin' THEN
        v_admin_type := COALESCE(NEW.raw_user_meta_data->>'admin_type', 'club_admin');
    END IF;

    -- Insert profile
    INSERT INTO public.profiles (id, username, role, admin_type, club_id, team_id, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'player'),
        v_admin_type,
        (NEW.raw_user_meta_data->>'club_id')::UUID,
        (NEW.raw_user_meta_data->>'team_id')::UUID,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            NEW.raw_user_meta_data->>'username',
            split_part(NEW.email, '@', 1)
        )
    );

    -- If team_admin, insert team assignments from managed_team_ids array
    IF v_admin_type = 'team_admin' AND NEW.raw_user_meta_data->'managed_team_ids' IS NOT NULL THEN
        FOR v_team_id IN
            SELECT (jsonb_array_elements_text(NEW.raw_user_meta_data->'managed_team_ids'))::UUID
        LOOP
            INSERT INTO public.admin_team_assignments (admin_id, team_id)
            VALUES (NEW.id, v_team_id)
            ON CONFLICT (admin_id, team_id) DO NOTHING;
        END LOOP;
    END IF;

    -- Set clubs.created_by if this is the first admin of a new club
    UPDATE public.clubs
    SET created_by = NEW.id
    WHERE id = (NEW.raw_user_meta_data->>'club_id')::UUID
      AND created_by IS NULL;

    RETURN NEW;
END;
$$;

-- ============================================================
-- 6. Scoped dashboard metrics RPC
--    Accepts optional team_ids for team admin filtering
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_dashboard_metrics_scoped(
    p_club_id UUID,
    p_team_ids UUID[] DEFAULT NULL
)
RETURNS TABLE (
    total_players BIGINT,
    active_last_7_days BIGINT,
    total_completions BIGINT,
    engagement_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM public.profiles
         WHERE club_id = p_club_id AND role = 'player'
         AND (p_team_ids IS NULL OR team_id = ANY(p_team_ids)))::BIGINT,

        (SELECT COUNT(*) FROM public.profiles
         WHERE club_id = p_club_id AND role = 'player'
         AND last_login >= NOW() - INTERVAL '7 days'
         AND (p_team_ids IS NULL OR team_id = ANY(p_team_ids)))::BIGINT,

        (SELECT COUNT(*) FROM public.exercise_completions ec
         JOIN public.profiles p ON p.id = ec.user_id
         WHERE p.club_id = p_club_id
         AND (p_team_ids IS NULL OR p.team_id = ANY(p_team_ids)))::BIGINT,

        (SELECT CASE
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND(
                COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '7 days') * 100.0 / COUNT(*), 0
            )
         END
         FROM public.profiles
         WHERE club_id = p_club_id AND role = 'player'
         AND (p_team_ids IS NULL OR team_id = ANY(p_team_ids)))::NUMERIC;
END;
$$;
