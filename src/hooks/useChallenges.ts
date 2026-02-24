import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { useAuthStore } from '../stores';
import * as challengeService from '../services/challengeService';

export function useChallenges() {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: queryKeys.challenges.all(user?.id ?? ''),
        queryFn: () => challengeService.getChallenges(user!.id),
        enabled: !!user,
    });
}

export function useActiveChallenges() {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: queryKeys.challenges.active(user?.id ?? ''),
        queryFn: () => challengeService.getActiveChallenges(user!.id),
        enabled: !!user,
    });
}

export function useTeammates() {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: ['teammates', user?.club_id ?? ''],
        queryFn: () => challengeService.getTeammates(user!.club_id, user!.id),
        enabled: !!user,
    });
}

export function useCreateChallenge() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: (params: { opponentId: string; opponentName: string; exerciseId: string; exerciseTitle: string }) =>
            challengeService.createChallenge(
                user!.id,
                user!.display_name,
                params.opponentId,
                params.opponentName,
                params.exerciseId,
                params.exerciseTitle,
            ),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all(user.id) });
                queryClient.invalidateQueries({ queryKey: queryKeys.challenges.active(user.id) });
            }
        },
    });
}

export function useAcceptChallenge() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: (challengeId: string) =>
            challengeService.updateChallengeStatus(challengeId, 'accepted'),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all(user.id) });
                queryClient.invalidateQueries({ queryKey: queryKeys.challenges.active(user.id) });
            }
        },
    });
}

export function useDeclineChallenge() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    return useMutation({
        mutationFn: (challengeId: string) =>
            challengeService.updateChallengeStatus(challengeId, 'expired'),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all(user.id) });
                queryClient.invalidateQueries({ queryKey: queryKeys.challenges.active(user.id) });
            }
        },
    });
}
