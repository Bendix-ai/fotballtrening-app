-- ============================================================
-- FotballTrening App - Fix infinite recursion in profiles RLS
--
-- The profiles_select_club and profiles_update_admin policies
-- reference public.profiles in their own check, causing
-- "infinite recursion detected in policy for relation profiles".
--
-- Fix: Use SECURITY DEFINER helper functions that bypass RLS
-- to look up the current user's club_id and role.
-- ============================================================

-- ============================================================
-- 1. Helper functions (bypass RLS for the inner lookup)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_club_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT club_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- ============================================================
-- 2. Fix profiles SELECT policy (was self-referential)
-- ============================================================

DROP POLICY IF EXISTS "profiles_select_club" ON public.profiles;

CREATE POLICY "profiles_select_club" ON public.profiles
    FOR SELECT USING (
        club_id = public.get_my_club_id()
    );

-- ============================================================
-- 3. Fix profiles UPDATE admin policy (was self-referential)
-- ============================================================

DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

CREATE POLICY "profiles_update_admin" ON public.profiles
    FOR UPDATE USING (
        club_id = public.get_my_club_id()
        AND public.get_my_role() = 'admin'
    );
