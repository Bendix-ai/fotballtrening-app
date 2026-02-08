-- ============================================================
-- FotballTrening App - Auto-confirm email on signup
-- Run AFTER 005. Fixes "Email not confirmed" error.
--
-- This app does not use email verification:
--   - Players use synthetic emails (username-teamid@fotballtrening.app)
--   - Coaches manage player access, not email confirmation
--   - The registration flow expects auto-login after signup
-- ============================================================

-- ============================================================
-- 1. Update handle_new_user() to auto-confirm email
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

    -- Auto-confirm email (this app does not use email verification)
    UPDATE auth.users
    SET email_confirmed_at = NOW()
    WHERE id = NEW.id AND email_confirmed_at IS NULL;

    RETURN NEW;
END;
$$;

-- ============================================================
-- 2. Fix existing unconfirmed users
-- ============================================================

UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
