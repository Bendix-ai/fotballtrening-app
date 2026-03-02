import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Exercise, ExerciseCompletion } from '../types';
import { mockExercises } from '../data/mockData';

export async function getExercises(clubId: string): Promise<Exercise[]> {
    if (!isSupabaseConfigured()) return mockExercises;

    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .or(`is_public.eq.true,created_by_club_id.eq.${clubId}`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('getExercises error:', error);
        return mockExercises;
    }
    return data as Exercise[];
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
    if (!isSupabaseConfigured()) {
        return mockExercises.find(e => e.id === id) ?? null;
    }

    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('getExerciseById error:', error);
        return mockExercises.find(e => e.id === id) ?? null;
    }
    return data as Exercise;
}

export async function completeExercise(
    userId: string,
    exerciseId: string,
    pointsEarned: number,
    isDailyChallenge: boolean = false
): Promise<ExerciseCompletion | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
        .from('exercise_completions')
        .insert({
            user_id: userId,
            exercise_id: exerciseId,
            points_earned: pointsEarned,
            is_daily_challenge: isDailyChallenge,
        })
        .select()
        .single();

    if (error) {
        console.error('completeExercise error:', error);
        return null;
    }
    return data as ExerciseCompletion;
}

export async function getCompletions(userId: string): Promise<ExerciseCompletion[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
        .from('exercise_completions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

    if (error) {
        console.error('getCompletions error:', error);
        return [];
    }
    return data as ExerciseCompletion[];
}

export async function getTodayCompletions(userId: string): Promise<ExerciseCompletion[]> {
    if (!isSupabaseConfigured()) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from('exercise_completions')
        .select('*')
        .eq('user_id', userId)
        .gte('completed_at', today.toISOString())
        .order('completed_at', { ascending: false });

    if (error) {
        console.error('getTodayCompletions error:', error);
        return [];
    }
    return data as ExerciseCompletion[];
}

export async function getFavorites(userId: string): Promise<string[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
        .from('favorites')
        .select('exercise_id')
        .eq('user_id', userId);

    if (error) {
        console.error('getFavorites error:', error);
        return [];
    }
    return data.map(f => f.exercise_id);
}

export async function toggleFavorite(userId: string, exerciseId: string, isFavorite: boolean): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    if (isFavorite) {
        const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('exercise_id', exerciseId);
        if (error) {
            console.error('toggleFavorite remove error:', error);
            return false;
        }
    } else {
        const { error } = await supabase
            .from('favorites')
            .insert({ user_id: userId, exercise_id: exerciseId });
        if (error) {
            console.error('toggleFavorite add error:', error);
            return false;
        }
    }
    return true;
}

export async function createExercise(exercise: Omit<Exercise, 'id' | 'created_at'>): Promise<Exercise> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('exercises')
        .insert(exercise)
        .select()
        .single();

    if (error) {
        console.error('createExercise error:', error);
        throw new Error(error.message);
    }
    return data as Exercise;
}

export async function updateExercise(id: string, updates: Partial<Exercise>): Promise<Exercise> {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('updateExercise error:', error);
        throw new Error(error.message);
    }
    return data as Exercise;
}

export async function deleteExercise(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('deleteExercise error:', error);
        return false;
    }
    return true;
}
