import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StoreExercise, StoreReview } from '../types';
import { mockStoreExercises, mockStoreReviews } from '../data/mockData';

export async function getStoreExercises(): Promise<StoreExercise[]> {
    if (!isSupabaseConfigured()) return mockStoreExercises;

    const { data, error } = await supabase
        .from('store_exercises')
        .select('*')
        .order('downloads', { ascending: false });

    if (error) {
        console.error('getStoreExercises error:', error);
        return mockStoreExercises;
    }
    return data as StoreExercise[];
}

export async function getStoreExerciseById(id: string): Promise<StoreExercise | null> {
    if (!isSupabaseConfigured()) {
        return mockStoreExercises.find(e => e.id === id) ?? null;
    }

    const { data, error } = await supabase
        .from('store_exercises')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('getStoreExerciseById error:', error);
        return mockStoreExercises.find(e => e.id === id) ?? null;
    }
    return data as StoreExercise;
}

export async function getStoreReviews(exerciseId: string): Promise<StoreReview[]> {
    if (!isSupabaseConfigured()) {
        return mockStoreReviews.filter(r => r.exercise_id === exerciseId);
    }

    const { data, error } = await supabase
        .from('store_reviews')
        .select('*')
        .eq('exercise_id', exerciseId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('getStoreReviews error:', error);
        return mockStoreReviews.filter(r => r.exercise_id === exerciseId);
    }
    return data as StoreReview[];
}

export async function downloadToClub(storeExerciseId: string, clubId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    // Get the store exercise
    const storeExercise = await getStoreExerciseById(storeExerciseId);
    if (!storeExercise) return false;

    // Copy to club's exercises
    const { error: insertError } = await supabase
        .from('exercises')
        .insert({
            title: storeExercise.title,
            description: storeExercise.description,
            instructions: storeExercise.instructions || '',
            duration_seconds: storeExercise.duration_seconds,
            difficulty: storeExercise.difficulty,
            category: storeExercise.category,
            points: storeExercise.points,
            equipment: storeExercise.equipment || '',
            is_public: false,
            created_by_club_id: clubId,
        });

    if (insertError) {
        console.error('downloadToClub insert error:', insertError);
        return false;
    }

    // Track the download
    await supabase
        .from('store_downloads')
        .insert({ club_id: clubId, store_exercise_id: storeExerciseId });

    // Increment download count (best effort)
    try {
        await supabase.rpc('increment_downloads' as any, { exercise_id: storeExerciseId });
    } catch {
        // Not critical if this fails
    }

    return true;
}

export async function addReview(
    exerciseId: string,
    clubName: string,
    rating: number,
    comment: string
): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { error } = await supabase
        .from('store_reviews')
        .insert({ exercise_id: exerciseId, club_name: clubName, rating, comment });

    if (error) {
        console.error('addReview error:', error);
        return false;
    }
    return true;
}
