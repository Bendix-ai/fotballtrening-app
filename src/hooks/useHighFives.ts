import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as highfiveService from '../services/highfiveService';
import { useAuthStore } from '../stores';

export function useSendHighFive() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    const userId = user?.id ?? '';

    return useMutation({
        mutationFn: ({ toUserId, activityId }: { toUserId: string; activityId: string }) =>
            highfiveService.sendHighFive(userId, toUserId, activityId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.activityFeed.friends(userId),
            });
        },
    });
}
