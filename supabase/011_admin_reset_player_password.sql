-- Migration: Admin reset player password
-- Allows admins to reset passwords for players in their club

CREATE OR REPLACE FUNCTION reset_player_password(p_player_id uuid, p_new_password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_caller_club_id uuid;
    v_player_club_id uuid;
    v_player_role text;
BEGIN
    -- Verify caller is an admin
    SELECT club_id INTO v_caller_club_id
    FROM profiles
    WHERE id = auth.uid() AND role = 'admin';

    IF v_caller_club_id IS NULL THEN
        RAISE EXCEPTION 'Only admins can reset player passwords';
    END IF;

    -- Verify the target is a player in the same club
    SELECT club_id, role INTO v_player_club_id, v_player_role
    FROM profiles
    WHERE id = p_player_id;

    IF v_player_club_id IS NULL THEN
        RAISE EXCEPTION 'Player not found';
    END IF;

    IF v_player_role != 'player' THEN
        RAISE EXCEPTION 'Can only reset passwords for players';
    END IF;

    IF v_player_club_id != v_caller_club_id THEN
        RAISE EXCEPTION 'Player is not in your club';
    END IF;

    -- Update the password via auth.users
    UPDATE auth.users
    SET encrypted_password = crypt(p_new_password, gen_salt('bf'))
    WHERE id = p_player_id;
END;
$$;
