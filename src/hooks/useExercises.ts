import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as exerciseService from '../services/exerciseService';
import { useAuthStore, useAppStore } from '../stores';
import { Exercise } from '../types';
import { logExerciseComplete } from '../lib/analytics';

export function useExercises(clubId?: string) {
    const { user } = useAuthStore();
    const id = clubId ?? user?.club_id ?? '';
    return useQuery({
        queryKey: queryKeys.exercises.all(id),
        queryFn: () => exerciseService.getExercises(id),
        enabled: !!id,
    });
}

export function useExercise(exerciseId: string) {
    return useQuery({
        queryKey: queryKeys.exercises.detail(exerciseId),
        queryFn: () => exerciseService.getExerciseById(exerciseId),
        enabled: !!exerciseId,
    });
}

export function useCompleteExercise() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const { addPendingCompletion, pendingCompletions, removePendingCompletion } = useAppStore();

    // Sync pending completions when online
    const syncPending = async () => {
        if (!user || pendingCompletions.length === 0) return;
        for (const pending of pendingCompletions) {
            try {
                await exerciseService.completeExercise(pending.userId, pending.exerciseId, pending.pointsEarned);
                removePendingCompletion(pending.timestamp);
            } catch {
                // Still offline, stop trying
                break;
            }
        }
    };

    return useMutation({
        mutationFn: ({ exerciseId, pointsEarned }: { exerciseId: string; pointsEarned: number }) =>
            exerciseService.completeExercise(user?.id ?? '', exerciseId, pointsEarned),
        onMutate: async ({ exerciseId, pointsEarned }) => {
            if (!user) return;
            const key = queryKeys.exercises.todayCompletions(user.id);
            await queryClient.cancelQueries({ queryKey: key });
            const previous = queryClient.getQueryData(key);
            queryClient.setQueryData(key, (old: any[] = []) => [
                ...old,
                {
                    id: `optimistic-${Date.now()}`,
                    user_id: user.id,
                    exercise_id: exerciseId,
                    points_earned: pointsEarned,
                    completed_at: new Date().toISOString(),
                },
            ]);
            return { previous };
        },
        onSuccess: (_data, variables) => {
            logExerciseComplete(variables.exerciseId, variables.pointsEarned);
            // Sync any queued completions now that we're online
            syncPending();
        },
        onError: (_err, variables, context) => {
            // Queue for later sync
            if (user) {
                addPendingCompletion({
                    userId: user.id,
                    exerciseId: variables.exerciseId,
                    pointsEarned: variables.pointsEarned,
                    timestamp: new Date().toISOString(),
                });
            }
            // Don't roll back optimistic update — keep it for offline UX
        },
        onSettled: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.exercises.todayCompletions(user.id) });
                queryClient.invalidateQueries({ queryKey: queryKeys.exercises.completions(user.id) });
                queryClient.invalidateQueries({ queryKey: queryKeys.achievements(user.id) });
            }
        },
    });
}

export function useCompletions(userId?: string) {
    const { user } = useAuthStore();
    const id = userId ?? user?.id ?? '';
    return useQuery({
        queryKey: queryKeys.exercises.completions(id),
        queryFn: () => exerciseService.getCompletions(id),
        enabled: !!id,
    });
}

export function useTodayCompletions(userId?: string) {
    const { user } = useAuthStore();
    const id = userId ?? user?.id ?? '';
    return useQuery({
        queryKey: queryKeys.exercises.todayCompletions(id),
        queryFn: () => exerciseService.getTodayCompletions(id),
        enabled: !!id,
    });
}

export function useFavorites(userId?: string) {
    const { user } = useAuthStore();
    const id = userId ?? user?.id ?? '';
    return useQuery({
        queryKey: queryKeys.exercises.favorites(id),
        queryFn: () => exerciseService.getFavorites(id),
        enabled: !!id,
    });
}

export function useToggleFavorite() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: ({ exerciseId, isFavorite }: { exerciseId: string; isFavorite: boolean }) =>
            exerciseService.toggleFavorite(user?.id ?? '', exerciseId, isFavorite),
        onMutate: async ({ exerciseId, isFavorite }) => {
            if (!user) return;
            const key = queryKeys.exercises.favorites(user.id);
            await queryClient.cancelQueries({ queryKey: key });
            const previous = queryClient.getQueryData<string[]>(key);
            queryClient.setQueryData<string[]>(key, (old = []) =>
                isFavorite ? old.filter((id) => id !== exerciseId) : [...old, exerciseId]
            );
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (user && context?.previous) {
                queryClient.setQueryData(queryKeys.exercises.favorites(user.id), context.previous);
            }
        },
        onSettled: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.exercises.favorites(user.id) });
            }
        },
    });
}

export function useCreateExercise() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: (exercise: Omit<Exercise, 'id' | 'created_at'>) =>
            exerciseService.createExercise(exercise),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all(user.club_id) });
            }
        },
    });
}

export function useUpdateExercise() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Exercise> }) =>
            exerciseService.updateExercise(id, updates),
        onSuccess: (_data, variables) => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all(user.club_id) });
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.exercises.detail(variables.id) });
        },
    });
}

export function useDeleteExercise() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: (id: string) => exerciseService.deleteExercise(id),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all(user.club_id) });
            }
        },
    });
}
