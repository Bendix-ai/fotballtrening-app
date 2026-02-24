import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Announcement } from '../types';

export async function getAnnouncements(clubId: string): Promise<Announcement[]> {
    if (!isSupabaseConfigured()) {
        return [];
    }

    const { data, error } = await supabase
        .from('announcements')
        .select('id, club_id, team_id, created_by, title, message, created_at, profiles:created_by (display_name)')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('getAnnouncements error:', error);
        return [];
    }

    return (data as any[]).map((row) => ({
        id: row.id,
        club_id: row.club_id,
        team_id: row.team_id ?? null,
        created_by: row.created_by,
        title: row.title,
        message: row.message,
        created_at: row.created_at,
        author_name: row.profiles?.display_name ?? undefined,
    }));
}

export async function createAnnouncement(data: {
    club_id: string;
    team_id?: string;
    title: string;
    message: string;
    created_by: string;
}): Promise<Announcement> {
    if (!isSupabaseConfigured()) {
        return {
            id: String(Date.now()),
            club_id: data.club_id,
            team_id: data.team_id ?? null,
            created_by: data.created_by,
            title: data.title,
            message: data.message,
            created_at: new Date().toISOString(),
        };
    }

    const { data: row, error } = await supabase
        .from('announcements')
        .insert({
            club_id: data.club_id,
            team_id: data.team_id ?? null,
            title: data.title,
            message: data.message,
            created_by: data.created_by,
        })
        .select()
        .single();

    if (error || !row) {
        console.error('createAnnouncement error:', error);
        // Fallback to mock
        return {
            id: String(Date.now()),
            club_id: data.club_id,
            team_id: data.team_id ?? null,
            created_by: data.created_by,
            title: data.title,
            message: data.message,
            created_at: new Date().toISOString(),
        };
    }

    return {
        id: row.id,
        club_id: row.club_id,
        team_id: row.team_id ?? null,
        created_by: row.created_by,
        title: row.title,
        message: row.message,
        created_at: row.created_at,
    };
}
