import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LeaderboardEntry, LeaderboardScope, LeaderboardPeriod } from '../types';
import { mockLeaderboard } from '../data/mockData';

export async function getLeaderboard(
    clubId: string,
    scope: LeaderboardScope = 'club',
    scopeId: string | null = null,
    period: LeaderboardPeriod = 'all_time',
    currentUserId: string | null = null
): Promise<LeaderboardEntry[]> {
    if (!isSupabaseConfigured()) return mockLeaderboard;

    const { data, error } = await supabase.rpc('get_leaderboard', {
        p_club_id: clubId,
        p_scope: scope,
        p_scope_id: scopeId,
        p_period: period,
        p_current_user_id: currentUserId,
        p_limit: 50,
    });

    if (error) {
        console.error('getLeaderboard error:', error);
        return mockLeaderboard;
    }

    return (data as any[]).map(row => ({
        rank: Number(row.rank),
        user_id: row.user_id,
        display_name: row.display_name,
        avatar_url: row.avatar_url,
        total_points: Number(row.total_points),
        exercises_completed: Number(row.exercises_completed),
        current_streak: row.current_streak,
        is_current_user: row.is_current_user,
    }));
}
