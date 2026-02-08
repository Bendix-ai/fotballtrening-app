import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Achievement, AchievementType } from '../types';
import { mockAchievements } from '../data/mockData';

export async function getAchievements(userId: string): Promise<{ type: AchievementType; unlocked: boolean }[]> {
    const allTypes: AchievementType[] = [
        'first_exercise', 'streak_7', 'streak_30',
        'points_100', 'points_500', 'points_1000',
        'exercises_10', 'exercises_50', 'all_categories',
    ];

    if (!isSupabaseConfigured()) return mockAchievements;

    const { data, error } = await supabase
        .from('achievements')
        .select('type')
        .eq('user_id', userId);

    if (error) {
        console.error('getAchievements error:', error);
        return mockAchievements;
    }

    const earnedTypes = new Set(data.map(a => a.type));
    return allTypes.map(type => ({
        type,
        unlocked: earnedTypes.has(type),
    }));
}
