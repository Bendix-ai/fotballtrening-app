import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminPlayer, DashboardMetrics, AdminActivity, Gender, ReportData, ChartDataPoint, PlayerCompletion } from '../types';
import { mockAdminPlayers, mockDashboardMetrics, mockAdminActivity, mockReportData, mockPlayerCompletions } from '../data/mockData';

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
            total_points, current_streak, longest_streak, is_active, last_login, created_at,
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
        longest_streak: p.longest_streak ?? 0,
        last_active: p.last_login || p.created_at || '',
        is_active: p.is_active,
        created_at: p.created_at,
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
        console.error('getDashboardMetrics RPC error, falling back to direct count:', error);
        // Fallback: direct count from profiles table instead of mock data
        try {
            let countQuery = supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('club_id', clubId)
                .eq('role', 'player');
            if (teamIds && teamIds.length > 0) {
                countQuery = countQuery.in('team_id', teamIds);
            }
            const { count } = await countQuery;
            return {
                totalPlayers: count ?? 0,
                activeLast7Days: 0,
                totalCompletions: 0,
                engagementRate: 0,
            };
        } catch {
            return mockDashboardMetrics;
        }
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

export async function getPlayerById(playerId: string): Promise<AdminPlayer | null> {
    if (!isSupabaseConfigured()) {
        return mockAdminPlayers.find((p) => p.id === playerId) ?? null;
    }

    const { data, error } = await supabase
        .from('profiles')
        .select(`
            id, username, display_name, avatar_url,
            total_points, current_streak, longest_streak, is_active, last_login, created_at,
            teams:team_id (gender, year_group_id, year_groups:year_group_id (year))
        `)
        .eq('id', playerId)
        .single();

    if (error || !data) {
        console.error('getPlayerById error:', error);
        return null;
    }

    const p = data as any;
    return {
        id: p.id,
        display_name: p.display_name,
        username: p.username,
        year_group: p.teams?.year_groups?.year ?? 0,
        year_group_id: p.teams?.year_group_id ?? undefined,
        gender: (p.teams?.gender as Gender) ?? 'boys',
        total_points: p.total_points,
        exercises_completed: 0,
        current_streak: p.current_streak,
        longest_streak: p.longest_streak ?? 0,
        last_active: p.last_login || '',
        is_active: p.is_active,
        created_at: p.created_at,
    };
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

export async function getReportData(
    clubId: string,
    dateRange: '7d' | '30d' | '90d',
    teamIds?: string[] | null
): Promise<ReportData> {
    if (!isSupabaseConfigured()) return mockReportData;

    const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
    const days = daysMap[dateRange];
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString();

    // Fetch completions with exercise info
    const query = supabase
        .from('exercise_completions')
        .select(`
            completed_at,
            points_earned,
            exercises:exercise_id (category, difficulty),
            profiles:user_id (club_id, team_id)
        `)
        .gte('completed_at', sinceStr);

    const { data, error } = await query;

    if (error || !data) {
        console.error('getReportData error:', error);
        return mockReportData;
    }

    // Filter to club/team scope
    const filtered = (data as any[]).filter((d) => {
        if (d.profiles?.club_id !== clubId) return false;
        if (teamIds && teamIds.length > 0 && !teamIds.includes(d.profiles?.team_id)) return false;
        return true;
    });

    // Weekly activity (day of week)
    const dayLabels = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
    const dayCountsArr = [0, 0, 0, 0, 0, 0, 0];
    filtered.forEach((d) => {
        const dow = new Date(d.completed_at).getDay();
        dayCountsArr[dow]++;
    });
    // Reorder Mon-Sun
    const weeklyActivity: ChartDataPoint[] = [1, 2, 3, 4, 5, 6, 0].map((i) => ({
        label: dayLabels[i],
        value: dayCountsArr[i],
    }));

    // Monthly points
    const monthMap: Record<string, number> = {};
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
    filtered.forEach((d) => {
        const m = new Date(d.completed_at).getMonth();
        const key = monthLabels[m];
        monthMap[key] = (monthMap[key] ?? 0) + (d.points_earned ?? 0);
    });
    // Get unique months in order
    const seenMonths = new Set<string>();
    filtered.forEach((d) => {
        seenMonths.add(monthLabels[new Date(d.completed_at).getMonth()]);
    });
    const monthlyPoints: ChartDataPoint[] = monthLabels
        .filter((m) => seenMonths.has(m))
        .map((m) => ({ label: m, value: monthMap[m] ?? 0 }));

    // Category distribution
    const catMap: Record<string, number> = {};
    filtered.forEach((d) => {
        const cat = d.exercises?.category ?? 'other';
        catMap[cat] = (catMap[cat] ?? 0) + 1;
    });
    const catLabels: Record<string, string> = {
        warmup: 'Oppvarming', strength: 'Styrke', agility: 'Hurtighet',
        skill: 'Teknikk', cooldown: 'Nedtrapping', other: 'Annet',
    };
    const categoryDistribution: ChartDataPoint[] = Object.entries(catMap).map(([k, v]) => ({
        label: catLabels[k] ?? k,
        value: v,
    }));

    // Difficulty distribution
    const diffMap: Record<string, number> = {};
    filtered.forEach((d) => {
        const diff = d.exercises?.difficulty ?? 'unknown';
        diffMap[diff] = (diffMap[diff] ?? 0) + 1;
    });
    const diffLabels: Record<string, string> = {
        easy: 'Lett', medium: 'Middels', hard: 'Vanskelig',
    };
    const total = filtered.length || 1;
    const difficultyDistribution: ChartDataPoint[] = Object.entries(diffMap).map(([k, v]) => ({
        label: diffLabels[k] ?? k,
        value: Math.round((v / total) * 100),
    }));

    // Return empty data if no completions found (honest empty state, not mock)
    if (filtered.length === 0) {
        return {
            weeklyActivity: [],
            monthlyPoints: [],
            categoryDistribution: [],
            difficultyDistribution: [],
        };
    }

    return { weeklyActivity, monthlyPoints, categoryDistribution, difficultyDistribution };
}

export async function getPlayerCompletions(playerId: string): Promise<PlayerCompletion[]> {
    if (!isSupabaseConfigured()) {
        return mockPlayerCompletions;
    }

    const { data, error } = await supabase
        .from('exercise_completions')
        .select(`
            points_earned,
            completed_at,
            exercises:exercise_id (title)
        `)
        .eq('user_id', playerId)
        .order('completed_at', { ascending: false })
        .limit(10);

    if (error || !data) {
        console.error('getPlayerCompletions error:', error);
        return mockPlayerCompletions;
    }

    return (data as any[]).map((d) => ({
        exercise_title: d.exercises?.title ?? 'Ukjent øvelse',
        points_earned: d.points_earned ?? 0,
        completed_at: d.completed_at,
    }));
}
