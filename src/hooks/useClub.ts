import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as clubService from '../services/clubService';
import { useAuthStore } from '../stores';

export function useClubs() {
    return useQuery({
        queryKey: queryKeys.clubs.all(),
        queryFn: () => clubService.getClubs(),
    });
}

export function useYearGroups(clubId?: string) {
    const { user } = useAuthStore();
    const id = clubId ?? user?.club_id ?? '';
    return useQuery({
        queryKey: queryKeys.clubs.yearGroups(id),
        queryFn: () => clubService.getYearGroups(id),
        enabled: !!id,
    });
}

export function useTeams(yearGroupId: string | null) {
    return useQuery({
        queryKey: queryKeys.clubs.teams(yearGroupId ?? ''),
        queryFn: () => clubService.getTeams(yearGroupId!),
        enabled: !!yearGroupId,
    });
}

export function useClubStructure(clubId?: string) {
    const { user } = useAuthStore();
    const id = clubId ?? user?.club_id ?? '';
    return useQuery({
        queryKey: queryKeys.clubs.structure(id),
        queryFn: () => clubService.getClubStructure(id),
        enabled: !!id,
    });
}

export function useAddYearGroup() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: ({ clubId, year }: { clubId: string; year: number }) =>
            clubService.addYearGroup(clubId, year),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.clubs.yearGroups(user.club_id) });
                queryClient.invalidateQueries({ queryKey: queryKeys.clubs.structure(user.club_id) });
            }
        },
    });
}
