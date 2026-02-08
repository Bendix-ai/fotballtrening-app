-- ============================================================
-- FotballTrening App - Row Level Security Policies
-- Run AFTER 001_schema.sql and 002_functions.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.year_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_downloads ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CLUBS: Readable by everyone (needed for login flow)
-- ============================================================

CREATE POLICY "clubs_select_all" ON public.clubs
    FOR SELECT USING (true);

CREATE POLICY "clubs_update_admin" ON public.clubs
    FOR UPDATE USING (
        id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================
-- YEAR GROUPS: Readable by everyone (login flow), managed by admins
-- ============================================================

CREATE POLICY "year_groups_select_all" ON public.year_groups
    FOR SELECT USING (true);

CREATE POLICY "year_groups_insert_admin" ON public.year_groups
    FOR INSERT WITH CHECK (
        club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "year_groups_delete_admin" ON public.year_groups
    FOR DELETE USING (
        club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================
-- TEAMS: Readable by everyone (login flow), managed by admins
-- ============================================================

CREATE POLICY "teams_select_all" ON public.teams
    FOR SELECT USING (true);

CREATE POLICY "teams_insert_admin" ON public.teams
    FOR INSERT WITH CHECK (
        year_group_id IN (
            SELECT yg.id FROM public.year_groups yg
            JOIN public.profiles p ON p.club_id = yg.club_id
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

CREATE POLICY "teams_delete_admin" ON public.teams
    FOR DELETE USING (
        year_group_id IN (
            SELECT yg.id FROM public.year_groups yg
            JOIN public.profiles p ON p.club_id = yg.club_id
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- ============================================================
-- PROFILES: Club members see each other, admins manage
-- ============================================================

CREATE POLICY "profiles_select_club" ON public.profiles
    FOR SELECT USING (
        club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "profiles_update_admin" ON public.profiles
    FOR UPDATE USING (
        club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================
-- EXERCISES: Public visible to all, club exercises to members
-- ============================================================

CREATE POLICY "exercises_select_public" ON public.exercises
    FOR SELECT USING (is_public = TRUE);

CREATE POLICY "exercises_select_club" ON public.exercises
    FOR SELECT USING (
        created_by_club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "exercises_insert_admin" ON public.exercises
    FOR INSERT WITH CHECK (
        created_by_club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "exercises_update_admin" ON public.exercises
    FOR UPDATE USING (
        created_by_club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "exercises_delete_admin" ON public.exercises
    FOR DELETE USING (
        created_by_club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ============================================================
-- EXERCISE COMPLETIONS: Users own, admins read club
-- ============================================================

CREATE POLICY "completions_select_own" ON public.exercise_completions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "completions_select_admin" ON public.exercise_completions
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.profiles
            WHERE club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        )
    );

CREATE POLICY "completions_insert_own" ON public.exercise_completions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================
-- FAVORITES: Users manage own
-- ============================================================

CREATE POLICY "favorites_select_own" ON public.favorites
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "favorites_insert_own" ON public.favorites
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "favorites_delete_own" ON public.favorites
    FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- ACHIEVEMENTS: Users see own
-- ============================================================

CREATE POLICY "achievements_select_own" ON public.achievements
    FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- STORE: Public read, authenticated write for reviews
-- ============================================================

CREATE POLICY "store_exercises_select_all" ON public.store_exercises
    FOR SELECT USING (true);

CREATE POLICY "store_reviews_select_all" ON public.store_reviews
    FOR SELECT USING (true);

CREATE POLICY "store_reviews_insert_auth" ON public.store_reviews
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "store_downloads_select_club" ON public.store_downloads
    FOR SELECT USING (
        club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "store_downloads_insert_admin" ON public.store_downloads
    FOR INSERT WITH CHECK (
        club_id IN (SELECT club_id FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
