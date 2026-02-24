import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Challenge, ChallengeStatus } from '../types';

const CHALLENGE_BONUS_POINTS = 10;
const CHALLENGE_EXPIRY_HOURS = 48;

// Mock challenges for development
function getMockChallenges(userId: string): Challenge[] {
    const now = new Date();
    const expires = new Date(now.getTime() + CHALLENGE_EXPIRY_HOURS * 60 * 60 * 1000);
    return [
        {
            id: 'c1',
            exercise_id: '1',
            exercise_title: 'Oppvarming med ball',
            challenger_id: userId,
            challenger_name: 'Deg',
            opponent_id: 'p2',
            opponent_name: 'Ola Nordmann',
            status: 'accepted',
            challenger_completed: true,
            opponent_completed: false,
            bonus_points: CHALLENGE_BONUS_POINTS,
            created_at: now.toISOString(),
            expires_at: expires.toISOString(),
        },
        {
            id: 'c2',
            exercise_id: '3',
            exercise_title: 'Hurtighetstrening',
            challenger_id: 'p3',
            challenger_name: 'Kari Hansen',
            opponent_id: userId,
            opponent_name: 'Deg',
            status: 'pending',
            challenger_completed: false,
            opponent_completed: false,
            bonus_points: CHALLENGE_BONUS_POINTS,
            created_at: now.toISOString(),
            expires_at: expires.toISOString(),
        },
    ];
}

export async function getChallenges(userId: string): Promise<Challenge[]> {
    if (!isSupabaseConfigured()) {
        return getMockChallenges(userId);
    }

    const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .or(`challenger_id.eq.${userId},opponent_id.eq.${userId}`)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Challenge[]) ?? [];
}

export async function getActiveChallenges(userId: string): Promise<Challenge[]> {
    const all = await getChallenges(userId);
    return all.filter((c) => c.status === 'pending' || c.status === 'accepted');
}

export async function createChallenge(
    challengerId: string,
    challengerName: string,
    opponentId: string,
    opponentName: string,
    exerciseId: string,
    exerciseTitle: string,
): Promise<Challenge> {
    const now = new Date();
    const expires = new Date(now.getTime() + CHALLENGE_EXPIRY_HOURS * 60 * 60 * 1000);

    const challenge: Omit<Challenge, 'id'> = {
        exercise_id: exerciseId,
        exercise_title: exerciseTitle,
        challenger_id: challengerId,
        challenger_name: challengerName,
        opponent_id: opponentId,
        opponent_name: opponentName,
        status: 'pending',
        challenger_completed: false,
        opponent_completed: false,
        bonus_points: CHALLENGE_BONUS_POINTS,
        created_at: now.toISOString(),
        expires_at: expires.toISOString(),
    };

    if (!isSupabaseConfigured()) {
        return { ...challenge, id: `c-${Date.now()}` };
    }

    const { data, error } = await supabase
        .from('challenges')
        .insert(challenge)
        .select()
        .single();

    if (error) throw error;
    return data as Challenge;
}

export async function updateChallengeStatus(
    challengeId: string,
    status: ChallengeStatus,
): Promise<void> {
    if (!isSupabaseConfigured()) return;

    const { error } = await supabase
        .from('challenges')
        .update({ status })
        .eq('id', challengeId);

    if (error) throw error;
}

export async function markChallengeCompleted(
    challengeId: string,
    userId: string,
): Promise<void> {
    if (!isSupabaseConfigured()) return;

    // Get challenge to determine which field to update
    const { data: challenge, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

    if (fetchError) throw fetchError;

    const isChallenger = challenge.challenger_id === userId;
    const updateField = isChallenger ? 'challenger_completed' : 'opponent_completed';
    const otherCompleted = isChallenger ? challenge.opponent_completed : challenge.challenger_completed;

    const updates: Record<string, unknown> = { [updateField]: true };
    if (otherCompleted) {
        updates.status = 'completed';
    }

    const { error } = await supabase
        .from('challenges')
        .update(updates)
        .eq('id', challengeId);

    if (error) throw error;
}

export async function getTeammates(clubId: string, userId: string): Promise<{ id: string; display_name: string }[]> {
    if (!isSupabaseConfigured()) {
        return [
            { id: 'p2', display_name: 'Ola Nordmann' },
            { id: 'p3', display_name: 'Kari Hansen' },
            { id: 'p4', display_name: 'Per Olsen' },
            { id: 'p5', display_name: 'Nora Berg' },
            { id: 'p6', display_name: 'Erik Dahl' },
        ];
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name')
        .eq('club_id', clubId)
        .neq('id', userId)
        .order('display_name');

    if (error) throw error;
    return data ?? [];
}
