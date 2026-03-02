import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function sendHighFive(
    fromUserId: string,
    toUserId: string,
    activityId: string
): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
        .from('highfives')
        .insert({ from_user_id: fromUserId, to_user_id: toUserId, activity_id: activityId });

    if (error) {
        console.error('sendHighFive error:', error);
        return false;
    }

    return true;
}

export async function getHighFiveCount(activityId: string): Promise<number> {
    if (!isSupabaseConfigured()) return 0;

    const { data, error } = await supabase
        .from('highfives')
        .select('id')
        .eq('activity_id', activityId);

    if (error) {
        console.error('getHighFiveCount error:', error);
        return 0;
    }

    return data?.length ?? 0;
}
