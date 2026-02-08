-- ============================================================
-- FotballTrening App - Database Functions, Triggers & Views
-- Run AFTER 001_schema.sql
-- ============================================================

-- ============================================================
-- TRIGGER: Auto-create profile after auth.users signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, username, role, club_id, team_id, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'player'),
        (NEW.raw_user_meta_data->>'club_id')::UUID,
        (NEW.raw_user_meta_data->>'team_id')::UUID,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: Update total_points when completion is added
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET total_points = total_points + NEW.points_earned
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_exercise_completed
    AFTER INSERT ON public.exercise_completions
    FOR EACH ROW EXECUTE FUNCTION public.update_user_points();

-- ============================================================
-- TRIGGER: Update streak when completion is added
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_last_completion DATE;
    v_today DATE := CURRENT_DATE;
    v_current_streak INTEGER;
    v_longest_streak INTEGER;
BEGIN
    SELECT DATE(completed_at) INTO v_last_completion
    FROM public.exercise_completions
    WHERE user_id = NEW.user_id
      AND DATE(completed_at) < v_today
    ORDER BY completed_at DESC
    LIMIT 1;

    SELECT current_streak, longest_streak
    INTO v_current_streak, v_longest_streak
    FROM public.profiles WHERE id = NEW.user_id;

    IF v_last_completion = v_today - INTERVAL '1 day' THEN
        v_current_streak := v_current_streak + 1;
    ELSIF v_last_completion = v_today THEN
        NULL; -- same day, no change
    ELSE
        v_current_streak := 1;
    END IF;

    IF v_current_streak > v_longest_streak THEN
        v_longest_streak := v_current_streak;
    END IF;

    UPDATE public.profiles
    SET current_streak = v_current_streak,
        longest_streak = v_longest_streak,
        last_login = NOW()
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_completion_update_streak
    AFTER INSERT ON public.exercise_completions
    FOR EACH ROW EXECUTE FUNCTION public.update_streak();

-- ============================================================
-- TRIGGER: Check and award achievements
-- ============================================================

CREATE OR REPLACE FUNCTION public.check_achievements()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_completions BIGINT;
    v_total_points INTEGER;
    v_current_streak INTEGER;
    v_distinct_categories BIGINT;
BEGIN
    SELECT COUNT(*) INTO v_total_completions
    FROM public.exercise_completions WHERE user_id = NEW.user_id;

    SELECT total_points, current_streak INTO v_total_points, v_current_streak
    FROM public.profiles WHERE id = NEW.user_id;

    SELECT COUNT(DISTINCT e.category) INTO v_distinct_categories
    FROM public.exercise_completions ec
    JOIN public.exercises e ON e.id = ec.exercise_id
    WHERE ec.user_id = NEW.user_id;

    IF v_total_completions = 1 THEN
        INSERT INTO public.achievements (user_id, type) VALUES (NEW.user_id, 'first_exercise')
        ON CONFLICT (user_id, type) DO NOTHING;
    END IF;

    IF v_total_completions >= 10 THEN
        INSERT INTO public.achievements (user_id, type) VALUES (NEW.user_id, 'exercises_10')
        ON CONFLICT (user_id, type) DO NOTHING;
    END IF;
    IF v_total_completions >= 50 THEN
        INSERT INTO public.achievements (user_id, type) VALUES (NEW.user_id, 'exercises_50')
        ON CONFLICT (user_id, type) DO NOTHING;
    END IF;

    IF v_total_points >= 100 THEN
        INSERT INTO public.achievements (user_id, type) VALUES (NEW.user_id, 'points_100')
        ON CONFLICT (user_id, type) DO NOTHING;
    END IF;
    IF v_total_points >= 500 THEN
        INSERT INTO public.achievements (user_id, type) VALUES (NEW.user_id, 'points_500')
        ON CONFLICT (user_id, type) DO NOTHING;
    END IF;
    IF v_total_points >= 1000 THEN
        INSERT INTO public.achievements (user_id, type) VALUES (NEW.user_id, 'points_1000')
        ON CONFLICT (user_id, type) DO NOTHING;
    END IF;

    IF v_current_streak >= 7 THEN
        INSERT INTO public.achievements (user_id, type) VALUES (NEW.user_id, 'streak_7')
        ON CONFLICT (user_id, type) DO NOTHING;
    END IF;
    IF v_current_streak >= 30 THEN
        INSERT INTO public.achievements (user_id, type) VALUES (NEW.user_id, 'streak_30')
        ON CONFLICT (user_id, type) DO NOTHING;
    END IF;

    IF v_distinct_categories >= 5 THEN
        INSERT INTO public.achievements (user_id, type) VALUES (NEW.user_id, 'all_categories')
        ON CONFLICT (user_id, type) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER on_completion_check_achievements
    AFTER INSERT ON public.exercise_completions
    FOR EACH ROW EXECUTE FUNCTION public.check_achievements();

-- ============================================================
-- RPC: Leaderboard with scope/period filtering
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_leaderboard(
    p_club_id UUID,
    p_scope TEXT DEFAULT 'club',
    p_scope_id UUID DEFAULT NULL,
    p_period TEXT DEFAULT 'all_time',
    p_current_user_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    rank BIGINT,
    user_id UUID,
    display_name TEXT,
    avatar_url TEXT,
    total_points BIGINT,
    exercises_completed BIGINT,
    current_streak INTEGER,
    is_current_user BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_start_date TIMESTAMPTZ;
BEGIN
    CASE p_period
        WHEN 'week' THEN v_start_date := DATE_TRUNC('week', NOW());
        WHEN 'month' THEN v_start_date := DATE_TRUNC('month', NOW());
        ELSE v_start_date := NULL;
    END CASE;

    RETURN QUERY
    WITH filtered_completions AS (
        SELECT
            ec.user_id AS f_user_id,
            SUM(ec.points_earned) AS period_points,
            COUNT(ec.id) AS period_exercises
        FROM public.exercise_completions ec
        WHERE (v_start_date IS NULL OR ec.completed_at >= v_start_date)
        GROUP BY ec.user_id
    ),
    filtered_profiles AS (
        SELECT p.*
        FROM public.profiles p
        LEFT JOIN public.teams t ON t.id = p.team_id
        WHERE p.club_id = p_club_id
          AND p.role = 'player'
          AND p.is_active = TRUE
          AND (
              p_scope = 'club'
              OR (p_scope = 'year_group' AND t.year_group_id = p_scope_id)
              OR (p_scope = 'team' AND p.team_id = p_scope_id)
          )
    )
    SELECT
        RANK() OVER (ORDER BY COALESCE(fc.period_points, 0) DESC)::BIGINT,
        fp.id,
        fp.display_name,
        fp.avatar_url,
        COALESCE(fc.period_points, 0)::BIGINT,
        COALESCE(fc.period_exercises, 0)::BIGINT,
        fp.current_streak,
        (fp.id = p_current_user_id)
    FROM filtered_profiles fp
    LEFT JOIN filtered_completions fc ON fc.f_user_id = fp.id
    ORDER BY COALESCE(fc.period_points, 0) DESC
    LIMIT p_limit;
END;
$$;

-- ============================================================
-- RPC: Dashboard metrics for admin
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_dashboard_metrics(p_club_id UUID)
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
        (SELECT COUNT(*) FROM public.profiles WHERE club_id = p_club_id AND role = 'player')::BIGINT,
        (SELECT COUNT(*) FROM public.profiles
         WHERE club_id = p_club_id AND role = 'player'
         AND last_login >= NOW() - INTERVAL '7 days')::BIGINT,
        (SELECT COUNT(*) FROM public.exercise_completions ec
         JOIN public.profiles p ON p.id = ec.user_id
         WHERE p.club_id = p_club_id)::BIGINT,
        (SELECT CASE
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND(
                COUNT(*) FILTER (WHERE last_login >= NOW() - INTERVAL '7 days') * 100.0 / COUNT(*), 0
            )
         END
         FROM public.profiles WHERE club_id = p_club_id AND role = 'player')::NUMERIC;
END;
$$;

-- ============================================================
-- RPC: Club structure (year groups with player counts)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_club_structure(p_club_id UUID)
RETURNS TABLE (
    year INTEGER,
    boys_count BIGINT,
    girls_count BIGINT,
    total_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        yg.year,
        COUNT(p.id) FILTER (WHERE t.gender = 'boys')::BIGINT,
        COUNT(p.id) FILTER (WHERE t.gender = 'girls')::BIGINT,
        COUNT(p.id)::BIGINT
    FROM public.year_groups yg
    LEFT JOIN public.teams t ON t.year_group_id = yg.id
    LEFT JOIN public.profiles p ON p.team_id = t.id AND p.role = 'player'
    WHERE yg.club_id = p_club_id
    GROUP BY yg.year
    ORDER BY yg.year DESC;
END;
$$;
