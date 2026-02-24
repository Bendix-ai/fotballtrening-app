import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as announcementService from '../services/announcementService';
import { useAuthStore } from '../stores';

export function useAnnouncements() {
    const { user } = useAuthStore();
    const clubId = user?.club_id ?? '';
    return useQuery({
        queryKey: queryKeys.announcements.all(clubId),
        queryFn: () => announcementService.getAnnouncements(clubId),
        enabled: !!clubId,
    });
}

export function useCreateAnnouncement() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: (data: { title: string; message: string; team_id?: string }) =>
            announcementService.createAnnouncement({
                club_id: user?.club_id ?? '',
                created_by: user?.id ?? '',
                title: data.title,
                message: data.message,
                team_id: data.team_id,
            }),
        onSuccess: () => {
            if (user) {
                queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all(user.club_id) });
            }
        },
    });
}
