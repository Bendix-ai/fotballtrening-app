import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExerciseCompletion } from '../types';

interface ExerciseState {
    completions: ExerciseCompletion[];
    totalPoints: number;
    favorites: string[];

    addCompletion: (completion: ExerciseCompletion) => void;
    toggleFavorite: (exerciseId: string) => void;
    isFavorite: (exerciseId: string) => boolean;

    getTodayCompletions: () => ExerciseCompletion[];
    getTodayPoints: () => number;
    getTodayExerciseCount: () => number;
}

const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};

export const useExerciseStore = create<ExerciseState>()(
    persist(
        (set, get) => ({
            completions: [],
            totalPoints: 0,
            favorites: [],

            addCompletion: (completion) =>
                set((state) => ({
                    completions: [...state.completions, completion],
                    totalPoints: state.totalPoints + completion.points_earned,
                })),

            toggleFavorite: (exerciseId) =>
                set((state) => ({
                    favorites: state.favorites.includes(exerciseId)
                        ? state.favorites.filter((id) => id !== exerciseId)
                        : [...state.favorites, exerciseId],
                })),

            isFavorite: (exerciseId) =>
                get().favorites.includes(exerciseId),

            getTodayCompletions: () =>
                get().completions.filter((c) => isToday(c.completed_at)),

            getTodayPoints: () =>
                get()
                    .completions.filter((c) => isToday(c.completed_at))
                    .reduce((sum, c) => sum + c.points_earned, 0),

            getTodayExerciseCount: () =>
                get().completions.filter((c) => isToday(c.completed_at)).length,
        }),
        {
            name: 'fotballtrening-exercise-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
