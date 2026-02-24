import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as exerciseService from '../services/exerciseService';
import { useAuthStore } from '../stores';
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
    return useMutation({
        mutationFn: ({ exerciseId, pointsEarned }: { exerciseId: string; pointsEarned: number }) =>
            exerciseService.completeExercise(user?.id ?? '', exerciseId, pointsEarned),
        onSuccess: (_data, variables) => {
            logExerciseComplete(variables.exerciseId, variables.pointsEarned);
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
        onSuccess: () => {
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
