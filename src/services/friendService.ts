import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Friend {
    id: string;
    friend_id: string;
    display_name: string;
    avatar_url: string | null;
    total_points: number;
    current_streak: number;
    created_at: string;
}

export async function getFriends(userId: string): Promise<Friend[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
        .from('friendships')
        .select('id, friend_id, created_at, friend:profiles!friend_id(display_name, avatar_url, total_points, current_streak)')
        .eq('user_id', userId);

    if (error) {
        console.error('getFriends error:', error);
        return [];
    }

    return (data ?? []).map((row: any) => ({
        id: row.id,
        friend_id: row.friend_id,
        display_name: row.friend?.display_name ?? '',
        avatar_url: row.friend?.avatar_url ?? null,
        total_points: row.friend?.total_points ?? 0,
        current_streak: row.friend?.current_streak ?? 0,
        created_at: row.created_at,
    }));
}

export async function addFriend(userId: string, friendUsername: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) return { success: false, error: 'Not configured' };

    // Look up friend by username in same club
    const { data: profile, error: lookupError } = await supabase
        .from('profiles')
        .select('id, club_id')
        .eq('username', friendUsername)
        .single();

    if (lookupError || !profile) {
        return { success: false, error: 'User not found' };
    }

    const { error } = await supabase
        .from('friendships')
        .insert({ user_id: userId, friend_id: profile.id });

    if (error) {
        if (error.code === '23505') return { success: false, error: 'Already friends' };
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function removeFriend(friendshipId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

    return !error;
}

export async function searchUsers(query: string, clubId: string, currentUserId: string): Promise<Array<{ id: string; username: string; display_name: string; avatar_url: string | null }>> {
    if (!isSupabaseConfigured() || query.length < 2) return [];

    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .eq('club_id', clubId)
        .neq('id', currentUserId)
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(10);

    if (error) return [];
    return data ?? [];
}
