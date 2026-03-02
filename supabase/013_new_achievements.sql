-- 013: Add new easy achievement types to the achievement trigger
-- These achievements are designed for early engagement (ages 8-13)

-- Update the on_completion_check_achievements trigger function
-- to include new lower-threshold achievements
CREATE OR REPLACE FUNCTION on_completion_check_achievements()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_total_points INT;
    v_current_streak INT;
    v_total_completions INT;
    v_category_count INT;
BEGIN
    v_user_id := NEW.user_id;

    SELECT total_points, current_streak INTO v_total_points, v_current_streak
    FROM profiles WHERE id = v_user_id;

    SELECT COUNT(*) INTO v_total_completions
    FROM exercise_completions WHERE user_id = v_user_id;

    SELECT COUNT(DISTINCT e.category) INTO v_category_count
    FROM exercise_completions ec
    JOIN exercises e ON e.id = ec.exercise_id
    WHERE ec.user_id = v_user_id;

    -- First exercise
    IF v_total_completions >= 1 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'first_exercise') ON CONFLICT DO NOTHING;
    END IF;

    -- Streak achievements
    IF v_current_streak >= 3 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'streak_3') ON CONFLICT DO NOTHING;
    END IF;
    IF v_current_streak >= 7 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'streak_7') ON CONFLICT DO NOTHING;
    END IF;
    IF v_current_streak >= 30 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'streak_30') ON CONFLICT DO NOTHING;
    END IF;

    -- Points achievements
    IF v_total_points >= 10 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'points_10') ON CONFLICT DO NOTHING;
    END IF;
    IF v_total_points >= 100 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'points_100') ON CONFLICT DO NOTHING;
    END IF;
    IF v_total_points >= 500 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'points_500') ON CONFLICT DO NOTHING;
    END IF;
    IF v_total_points >= 1000 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'points_1000') ON CONFLICT DO NOTHING;
    END IF;

    -- Exercise count achievements
    IF v_total_completions >= 5 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'exercises_5') ON CONFLICT DO NOTHING;
    END IF;
    IF v_total_completions >= 10 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'exercises_10') ON CONFLICT DO NOTHING;
    END IF;
    IF v_total_completions >= 50 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'exercises_50') ON CONFLICT DO NOTHING;
    END IF;

    -- Category achievements
    IF v_category_count >= 2 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'tried_2_categories') ON CONFLICT DO NOTHING;
    END IF;
    IF v_category_count >= 5 THEN
        INSERT INTO achievements (user_id, type) VALUES (v_user_id, 'all_categories') ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
