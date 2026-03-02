import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useLeaderboard } from '../useLeaderboard';
import * as leaderboardService from '../../services/leaderboardService';
import { useAuthStore } from '../../stores';

jest.mock('../../services/leaderboardService');
jest.mock('../useFriends', () => ({
  useFriends: () => ({ data: [{ friend_id: 'f1' }, { friend_id: 'f2' }] }),
}));
const mockService = leaderboardService as jest.Mocked<typeof leaderboardService>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useLeaderboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'u1', club_id: 'c1', role: 'player' } as any,
      isAuthenticated: true,
    });
  });

  it('should fetch leaderboard with defaults', async () => {
    const mockData = [{ rank: 1, display_name: 'Emma', total_points: 100 }];
    mockService.getLeaderboard.mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useLeaderboard(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockService.getLeaderboard).toHaveBeenCalledWith('c1', 'club', null, 'all_time', 'u1', undefined);
    expect(result.current.data).toEqual(mockData);
  });

  it('should pass custom scope and period', async () => {
    mockService.getLeaderboard.mockResolvedValue([]);

    renderHook(() => useLeaderboard('team', 't1', 'week'), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(mockService.getLeaderboard).toHaveBeenCalledWith('c1', 'team', 't1', 'week', 'u1', undefined)
    );
  });

  it('should not fetch when no clubId', async () => {
    useAuthStore.setState({ user: null });

    const { result } = renderHook(() => useLeaderboard(), { wrapper: createWrapper() });

    expect(result.current.isFetching).toBe(false);
    expect(mockService.getLeaderboard).not.toHaveBeenCalled();
  });

  it('should pass friendIds when scope is friends', async () => {
    mockService.getLeaderboard.mockResolvedValue([]);

    renderHook(() => useLeaderboard('friends', null, 'week'), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(mockService.getLeaderboard).toHaveBeenCalledWith('c1', 'friends', null, 'week', 'u1', ['f1', 'f2'])
    );
  });
});
