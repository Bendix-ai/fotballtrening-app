-- Add daily challenge bonus column to exercise_completions
ALTER TABLE exercise_completions ADD COLUMN IF NOT EXISTS is_daily_challenge BOOLEAN DEFAULT FALSE;

-- Update the points calculation trigger to award double points for daily challenges
CREATE OR REPLACE FUNCTION on_exercise_completed()
RETURNS TRIGGER AS $$
DECLARE
    exercise_points INTEGER;
    multiplier INTEGER := 1;
BEGIN
    SELECT points INTO exercise_points FROM exercises WHERE id = NEW.exercise_id;

    IF NEW.is_daily_challenge = TRUE THEN
        multiplier := 2;
    END IF;

    UPDATE profiles
    SET total_points = total_points + (exercise_points * multiplier)
    WHERE id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
