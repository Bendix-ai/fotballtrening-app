import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as friendService from '../services/friendService';
import { useAuthStore } from '../stores';

const friendKeys = {
    all: (userId: string) => ['friends', userId] as const,
    search: (query: string) => ['friends', 'search', query] as const,
};

export function useFriends() {
    const { user } = useAuthStore();
    const userId = user?.id ?? '';
    return useQuery({
        queryKey: friendKeys.all(userId),
        queryFn: () => friendService.getFriends(userId),
        enabled: !!userId,
    });
}

export function useAddFriend() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: (username: string) => friendService.addFriend(user?.id ?? '', username),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: friendKeys.all(user?.id ?? '') });
        },
    });
}

export function useRemoveFriend() {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    return useMutation({
        mutationFn: (friendshipId: string) => friendService.removeFriend(friendshipId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: friendKeys.all(user?.id ?? '') });
        },
    });
}

export function useSearchUsers(query: string) {
    const { user } = useAuthStore();
    return useQuery({
        queryKey: friendKeys.search(query),
        queryFn: () => friendService.searchUsers(query, user?.club_id ?? '', user?.id ?? ''),
        enabled: query.length >= 2,
    });
}
