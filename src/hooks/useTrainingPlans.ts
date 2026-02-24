import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as trainingPlanService from '../services/trainingPlanService';
import { useAuthStore } from '../stores';
import { TrainingPlanDay } from '../types';

export function useActivePlan() {
    const { user } = useAuthStore();
    const clubId = user?.club_id ?? '';
    const teamId = user?.team_id ?? null;
    return useQuery({
        queryKey: queryKeys.trainingPlans.active(clubId, teamId),
        queryFn: () => trainingPlanService.getActivePlan(clubId, teamId),
        enabled: !!clubId,
    });
}

export function useCreatePlan() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: (days: Omit<TrainingPlanDay, 'id' | 'plan_id'>[]) =>
            trainingPlanService.createPlan(
                user?.club_id ?? '',
                user?.id ?? '',
                days,
                null // club-wide plan
            ),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.trainingPlans.active(user.club_id),
                });
            }
        },
    });
}

export function useUpdatePlan() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: ({ planId, days }: { planId: string; days: Omit<TrainingPlanDay, 'id' | 'plan_id'>[] }) =>
            trainingPlanService.updatePlan(planId, days),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.trainingPlans.active(user.club_id),
                });
            }
        },
    });
}
