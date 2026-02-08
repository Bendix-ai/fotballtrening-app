import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as adminService from '../services/adminService';
import { useAuthStore } from '../stores';
import { Gender } from '../types';

export function usePlayers(filters?: { yearGroup?: number | null; gender?: Gender | null }) {
    const { user, getEffectiveTeamIds } = useAuthStore();
    const clubId = user?.club_id ?? '';
    const teamIds = getEffectiveTeamIds();
    return useQuery({
        queryKey: [...queryKeys.admin.players(clubId), filters, teamIds],
        queryFn: () => adminService.getPlayers(clubId, filters, teamIds),
        enabled: !!clubId,
    });
}

export function useDashboardMetrics() {
    const { user, getEffectiveTeamIds } = useAuthStore();
    const clubId = user?.club_id ?? '';
    const teamIds = getEffectiveTeamIds();
    return useQuery({
        queryKey: [...queryKeys.admin.metrics(clubId), teamIds],
        queryFn: () => adminService.getDashboardMetrics(clubId, teamIds),
        enabled: !!clubId,
    });
}

export function useRecentActivity() {
    const { user, getEffectiveTeamIds } = useAuthStore();
    const clubId = user?.club_id ?? '';
    const teamIds = getEffectiveTeamIds();
    return useQuery({
        queryKey: [...queryKeys.admin.activity(clubId), teamIds],
        queryFn: () => adminService.getRecentActivity(clubId, teamIds),
        enabled: !!clubId,
    });
}

export function useDeletePlayer() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: (userId: string) => adminService.deletePlayer(userId),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.admin.players(user.club_id) });
                queryClient.invalidateQueries({ queryKey: queryKeys.admin.metrics(user.club_id) });
            }
        },
    });
}
