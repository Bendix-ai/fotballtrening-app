import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminPlayer, DashboardMetrics, AdminActivity, Gender } from '../types';
import { mockAdminPlayers, mockDashboardMetrics, mockAdminActivity } from '../data/mockData';

export async function getPlayers(
    clubId: string,
    filters?: { yearGroup?: number | null; gender?: Gender | null },
    teamIds?: string[] | null
): Promise<AdminPlayer[]> {
    if (!isSupabaseConfigured()) {
        let players = mockAdminPlayers;
        if (filters?.yearGroup) players = players.filter(p => p.year_group === filters.yearGroup);
        if (filters?.gender) players = players.filter(p => p.gender === filters.gender);
        return players;
    }

    let query = supabase
        .from('profiles')
        .select(`
            id, username, display_name, avatar_url,
            total_points, current_streak, is_active, last_login,
            teams:team_id (gender, year_group_id, year_groups:year_group_id (year))
        `)
        .eq('club_id', clubId)
        .eq('role', 'player')
        .order('total_points', { ascending: false });

    // Team scoping for team admins
    if (teamIds && teamIds.length > 0) {
        query = query.in('team_id', teamIds);
    }

    const { data, error } = await query;

    if (error) {
        console.error('getPlayers error:', error);
        return mockAdminPlayers;
    }

    let players: AdminPlayer[] = (data as any[]).map(p => ({
        id: p.id,
        display_name: p.display_name,
        username: p.username,
        year_group: p.teams?.year_groups?.year ?? 0,
        gender: (p.teams?.gender as Gender) ?? 'boys',
        total_points: p.total_points,
        exercises_completed: 0, // will be enriched later if needed
        current_streak: p.current_streak,
        last_active: p.last_login || p.created_at || '',
        is_active: p.is_active,
    }));

    if (filters?.yearGroup) {
        players = players.filter(p => p.year_group === filters.yearGroup);
    }
    if (filters?.gender) {
        players = players.filter(p => p.gender === filters.gender);
    }

    return players;
}

export async function getDashboardMetrics(
    clubId: string,
    teamIds?: string[] | null
): Promise<DashboardMetrics> {
    if (!isSupabaseConfigured()) return mockDashboardMetrics;

    // Try scoped version first, fall back to original if not yet migrated
    let { data, error } = await supabase.rpc('get_dashboard_metrics_scoped', {
        p_club_id: clubId,
        p_team_ids: teamIds ?? null,
    });

    if (error?.code === 'PGRST202') {
        // Function doesn't exist yet — fall back to original
        const fallback = await supabase.rpc('get_dashboard_metrics', {
            p_club_id: clubId,
        });
        data = fallback.data;
        error = fallback.error;
    }

    if (error || !data || data.length === 0) {
        console.error('getDashboardMetrics error:', error);
        return mockDashboardMetrics;
    }

    const row = data[0];
    return {
        totalPlayers: Number(row.total_players),
        activeLast7Days: Number(row.active_last_7_days),
        totalCompletions: Number(row.total_completions),
        engagementRate: Number(row.engagement_rate),
    };
}

export async function getRecentActivity(
    clubId: string,
    teamIds?: string[] | null
): Promise<AdminActivity[]> {
    if (!isSupabaseConfigured()) return mockAdminActivity;

    const { data, error } = await supabase
        .from('exercise_completions')
        .select(`
            id,
            points_earned,
            completed_at,
            profiles:user_id (display_name, club_id, team_id),
            exercises:exercise_id (title)
        `)
        .order('completed_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error('getRecentActivity error:', error);
        return mockAdminActivity;
    }

    return (data as any[])
        .filter(d => {
            if (d.profiles?.club_id !== clubId) return false;
            if (teamIds && teamIds.length > 0 && !teamIds.includes(d.profiles?.team_id)) return false;
            return true;
        })
        .slice(0, 15)
        .map((d) => ({
            id: d.id,
            player_name: d.profiles?.display_name ?? 'Ukjent',
            action: `Fullførte ${d.exercises?.title ?? 'øvelse'}`,
            timestamp: d.completed_at,
            points: d.points_earned || undefined,
        }));
}

export async function deletePlayer(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);

    if (error) {
        console.error('deletePlayer error:', error);
        return false;
    }
    return true;
}
