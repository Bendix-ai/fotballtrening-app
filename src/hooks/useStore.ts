import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as storeService from '../services/storeService';
import { useAuthStore } from '../stores';
import { logStoreDownload } from '../lib/analytics';

export function useStoreExercises() {
    return useQuery({
        queryKey: queryKeys.store.exercises(),
        queryFn: () => storeService.getStoreExercises(),
    });
}

export function useStoreExercise(id: string) {
    return useQuery({
        queryKey: queryKeys.store.detail(id),
        queryFn: () => storeService.getStoreExerciseById(id),
        enabled: !!id,
    });
}

export function useStoreReviews(exerciseId: string) {
    return useQuery({
        queryKey: queryKeys.store.reviews(exerciseId),
        queryFn: () => storeService.getStoreReviews(exerciseId),
        enabled: !!exerciseId,
    });
}

export function useDownloadExercise() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: (storeExerciseId: string) =>
            storeService.downloadToClub(storeExerciseId, user?.club_id ?? ''),
        onSuccess: (_data, storeExerciseId) => {
            logStoreDownload(storeExerciseId);
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.exercises.all(user.club_id) });
            }
        },
    });
}
