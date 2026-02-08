import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as achievementService from '../services/achievementService';
import { useAuthStore } from '../stores';

export function useAchievements(userId?: string) {
    const { user } = useAuthStore();
    const id = userId ?? user?.id ?? '';

    return useQuery({
        queryKey: queryKeys.achievements(id),
        queryFn: () => achievementService.getAchievements(id),
        enabled: !!id,
    });
}
