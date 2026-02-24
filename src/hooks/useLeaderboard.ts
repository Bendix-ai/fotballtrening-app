import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as leaderboardService from '../services/leaderboardService';
import { useAuthStore } from '../stores';
import { LeaderboardScope, LeaderboardPeriod } from '../types';

export function useLeaderboard(
    scope: LeaderboardScope = 'club',
    scopeId: string | null = null,
    period: LeaderboardPeriod = 'all_time'
) {
    const { user } = useAuthStore();
    const clubId = user?.club_id ?? '';

    return useQuery({
        queryKey: queryKeys.leaderboard(clubId, scope, scopeId, period),
        queryFn: () => leaderboardService.getLeaderboard(clubId, scope, scopeId, period, user?.id ?? null),
        enabled: !!clubId,
    });
}
