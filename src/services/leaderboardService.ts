import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LeaderboardEntry, LeaderboardScope, LeaderboardPeriod } from '../types';
import { mockLeaderboard } from '../data/mockData';

export async function getLeaderboard(
    clubId: string,
    scope: LeaderboardScope = 'club',
    scopeId: string | null = null,
    period: LeaderboardPeriod = 'all_time',
    currentUserId: string | null = null,
    friendIds?: string[]
): Promise<LeaderboardEntry[]> {
    if (!isSupabaseConfigured()) return mockLeaderboard;

    // For friends scope, use club scope RPC and filter to friend IDs client-side
    const rpcScope = scope === 'friends' ? 'club' : scope;

    const { data, error } = await supabase.rpc('get_leaderboard', {
        p_club_id: clubId,
        p_scope: rpcScope,
        p_scope_id: scopeId,
        p_period: period,
        p_current_user_id: currentUserId,
        p_limit: 50,
    });

    if (error) {
        console.error('getLeaderboard error:', error);
        return mockLeaderboard;
    }

    let entries = (data as Record<string, unknown>[]).map(row => ({
        rank: Number(row.rank),
        user_id: String(row.user_id),
        display_name: String(row.display_name),
        avatar_url: row.avatar_url as string | null,
        total_points: Number(row.total_points),
        exercises_completed: Number(row.exercises_completed),
        current_streak: Number(row.current_streak),
        is_current_user: Boolean(row.is_current_user),
        rank_change: row.rank_change != null ? Number(row.rank_change) : undefined,
    }));

    // Filter to friends + current user when scope is 'friends'
    if (scope === 'friends' && friendIds && friendIds.length > 0) {
        const allowedIds = new Set([...friendIds, ...(currentUserId ? [currentUserId] : [])]);
        entries = entries.filter(e => allowedIds.has(e.user_id));
        // Re-rank after filtering
        entries.forEach((e, i) => { e.rank = i + 1; });
    }

    return entries;
}
