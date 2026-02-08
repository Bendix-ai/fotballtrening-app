-- ============================================================
-- FotballTrening App - Fix exercises RLS + ensure points trigger
--
-- 1. Replace exercises RLS policies to use SECURITY DEFINER
--    helpers (get_my_club_id / get_my_role) instead of
--    sub-querying profiles directly (which hits profiles RLS).
--
-- 2. Ensure the update_user_points trigger exists and works.
--    Recalculate total_points for all users from actual completions.
-- ============================================================

-- ============================================================
-- 1. Fix exercises RLS policies
-- ============================================================

-- SELECT: club exercises
DROP POLICY IF EXISTS "exercises_select_club" ON public.exercises;
CREATE POLICY "exercises_select_club" ON public.exercises
    FOR SELECT USING (
        created_by_club_id = public.get_my_club_id()
    );

-- INSERT: admins only
DROP POLICY IF EXISTS "exercises_insert_admin" ON public.exercises;
CREATE POLICY "exercises_insert_admin" ON public.exercises
    FOR INSERT WITH CHECK (
        created_by_club_id = public.get_my_club_id()
        AND public.get_my_role() = 'admin'
    );

-- UPDATE: admins only
DROP POLICY IF EXISTS "exercises_update_admin" ON public.exercises;
CREATE POLICY "exercises_update_admin" ON public.exercises
    FOR UPDATE USING (
        created_by_club_id = public.get_my_club_id()
        AND public.get_my_role() = 'admin'
    );

-- DELETE: admins only
DROP POLICY IF EXISTS "exercises_delete_admin" ON public.exercises;
CREATE POLICY "exercises_delete_admin" ON public.exercises
    FOR DELETE USING (
        created_by_club_id = public.get_my_club_id()
        AND public.get_my_role() = 'admin'
    );

-- Also fix store_downloads INSERT policy
DROP POLICY IF EXISTS "store_downloads_insert_admin" ON public.store_downloads;
CREATE POLICY "store_downloads_insert_admin" ON public.store_downloads
    FOR INSERT WITH CHECK (
        club_id = public.get_my_club_id()
        AND public.get_my_role() = 'admin'
    );

-- Also fix store_downloads SELECT policy
DROP POLICY IF EXISTS "store_downloads_select_club" ON public.store_downloads;
CREATE POLICY "store_downloads_select_club" ON public.store_downloads
    FOR SELECT USING (
        club_id = public.get_my_club_id()
    );

-- Fix exercise_completions admin SELECT policy
DROP POLICY IF EXISTS "completions_select_admin" ON public.exercise_completions;
CREATE POLICY "completions_select_admin" ON public.exercise_completions
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.profiles
            WHERE club_id = public.get_my_club_id()
              AND public.get_my_role() = 'admin'
        )
    );

-- ============================================================
-- 2. Ensure update_user_points trigger exists
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.profiles
    SET total_points = total_points + NEW.points_earned
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$;

-- Recreate trigger (drop first to be safe)
DROP TRIGGER IF EXISTS on_exercise_completed ON public.exercise_completions;
CREATE TRIGGER on_exercise_completed
    AFTER INSERT ON public.exercise_completions
    FOR EACH ROW EXECUTE FUNCTION public.update_user_points();

-- ============================================================
-- 3. One-time fix: recalculate total_points from actual completions
-- ============================================================

UPDATE public.profiles p
SET total_points = COALESCE(sub.actual_points, 0)
FROM (
    SELECT user_id, SUM(points_earned) AS actual_points
    FROM public.exercise_completions
    GROUP BY user_id
) sub
WHERE p.id = sub.user_id;
