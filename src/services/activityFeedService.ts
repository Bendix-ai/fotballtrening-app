import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ActivityFeedItem } from '../types';

const mockActivityFeed: ActivityFeedItem[] = [
    {
        id: 'af1',
        user_id: 'u1',
        display_name: 'Ola Nordmann',
        avatar_url: null,
        type: 'exercise_completed',
        title: 'Sprint 50m',
        points: 15,
        created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
        id: 'af2',
        user_id: 'u2',
        display_name: 'Kari Hansen',
        avatar_url: null,
        type: 'achievement_unlocked',
        title: 'Uke-streak',
        created_at: new Date(Date.now() - 20 * 60000).toISOString(),
    },
    {
        id: 'af3',
        user_id: 'u3',
        display_name: 'Per Olsen',
        avatar_url: null,
        type: 'streak_milestone',
        title: '7',
        created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
        id: 'af4',
        user_id: 'u4',
        display_name: 'Emma Johansen',
        avatar_url: null,
        type: 'exercise_completed',
        title: 'Oppvarming med ball',
        points: 10,
        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
        id: 'af5',
        user_id: 'u5',
        display_name: 'Lars Berg',
        avatar_url: null,
        type: 'exercise_completed',
        title: 'Styrketrening',
        points: 20,
        created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
    {
        id: 'af6',
        user_id: 'u1',
        display_name: 'Ola Nordmann',
        avatar_url: null,
        type: 'achievement_unlocked',
        title: 'Ti øvelser',
        created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
    {
        id: 'af7',
        user_id: 'u6',
        display_name: 'Sofie Dahl',
        avatar_url: null,
        type: 'exercise_completed',
        title: 'Hurtighet',
        points: 15,
        created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
        id: 'af8',
        user_id: 'u2',
        display_name: 'Kari Hansen',
        avatar_url: null,
        type: 'streak_milestone',
        title: '30',
        created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    },
    {
        id: 'af9',
        user_id: 'u7',
        display_name: 'Magnus Lie',
        avatar_url: null,
        type: 'exercise_completed',
        title: 'Nedtrapping',
        points: 10,
        created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    },
    {
        id: 'af10',
        user_id: 'u8',
        display_name: 'Ingrid Vik',
        avatar_url: null,
        type: 'exercise_completed',
        title: 'Teknikk',
        points: 15,
        created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
];

export async function getActivityFeed(clubId: string, teamId?: string): Promise<ActivityFeedItem[]> {
    if (!isSupabaseConfigured()) {
        return mockActivityFeed;
    }

    try {
        // Fetch recent exercise completions with profile info
        const query = supabase
            .from('exercise_completions')
            .select('id, user_id, points_earned, completed_at, exercises:exercise_id (title), profiles:user_id (display_name, avatar_url, club_id, team_id)')
            .order('completed_at', { ascending: false })
            .limit(20);

        const { data, error } = await query;

        if (error || !data) {
            console.error('getActivityFeed error:', error);
            return mockActivityFeed;
        }

        // Filter by club (and optionally team) since we join through profiles
        const items: ActivityFeedItem[] = (data as any[])
            .filter((row) => {
                const profile = row.profiles;
                if (!profile || profile.club_id !== clubId) return false;
                if (teamId && profile.team_id !== teamId) return false;
                return true;
            })
            .map((row) => ({
                id: row.id,
                user_id: row.user_id,
                display_name: row.profiles?.display_name ?? 'Spiller',
                avatar_url: row.profiles?.avatar_url ?? null,
                type: 'exercise_completed' as const,
                title: row.exercises?.title ?? '',
                points: row.points_earned,
                created_at: row.completed_at,
            }));

        return items.length > 0 ? items : mockActivityFeed;
    } catch {
        return mockActivityFeed;
    }
}
