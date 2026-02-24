import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import * as activityFeedService from '../services/activityFeedService';
import { useAuthStore } from '../stores';

export function useActivityFeed() {
    const { user } = useAuthStore();
    const clubId = user?.club_id ?? '';
    const teamId = user?.team_id ?? undefined;

    return useQuery({
        queryKey: teamId
            ? queryKeys.activityFeed.team(clubId, teamId)
            : queryKeys.activityFeed.all(clubId),
        queryFn: () => activityFeedService.getActivityFeed(clubId, teamId ?? undefined),
        enabled: !!clubId,
    });
}
