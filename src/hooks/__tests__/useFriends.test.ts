import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useFriends, useAddFriend, useRemoveFriend, useSearchUsers } from '../useFriends';
import * as friendService from '../../services/friendService';
import { useAuthStore } from '../../stores';

jest.mock('../../services/friendService');
const mockService = friendService as jest.Mocked<typeof friendService>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useFriends hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'u1', club_id: 'c1', role: 'player' } as any,
      isAuthenticated: true,
    });
  });

  describe('useFriends', () => {
    it('should fetch friends for user', async () => {
      const mockData = [
        {
          id: 'f1',
          friend_id: 'u2',
          display_name: 'Player Two',
          avatar_url: null,
          total_points: 100,
          current_streak: 3,
          created_at: '2024-01-01',
        },
      ];
      mockService.getFriends.mockResolvedValue(mockData);

      const { result } = renderHook(() => useFriends(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getFriends).toHaveBeenCalledWith('u1');
      expect(result.current.data).toEqual(mockData);
    });

    it('should not fetch when no user', async () => {
      useAuthStore.setState({ user: null });

      const { result } = renderHook(() => useFriends(), { wrapper: createWrapper() });

      expect(result.current.isFetching).toBe(false);
      expect(mockService.getFriends).not.toHaveBeenCalled();
    });
  });

  describe('useAddFriend', () => {
    it('should call addFriend service', async () => {
      mockService.addFriend.mockResolvedValue({ success: true });

      const { result } = renderHook(() => useAddFriend(), { wrapper: createWrapper() });

      result.current.mutate('testuser');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.addFriend).toHaveBeenCalledWith('u1', 'testuser');
    });

    it('should handle add friend error', async () => {
      mockService.addFriend.mockResolvedValue({ success: false, error: 'Already friends' });

      const { result } = renderHook(() => useAddFriend(), { wrapper: createWrapper() });

      result.current.mutate('testuser');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual({ success: false, error: 'Already friends' });
    });
  });

  describe('useRemoveFriend', () => {
    it('should call removeFriend service', async () => {
      mockService.removeFriend.mockResolvedValue(true);

      const { result } = renderHook(() => useRemoveFriend(), { wrapper: createWrapper() });

      result.current.mutate('f1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.removeFriend).toHaveBeenCalledWith('f1');
    });
  });

  describe('useSearchUsers', () => {
    it('should search when query is >= 2 chars', async () => {
      const mockResults = [
        { id: 'u2', username: 'testuser', display_name: 'Test', avatar_url: null },
      ];
      mockService.searchUsers.mockResolvedValue(mockResults);

      const { result } = renderHook(() => useSearchUsers('te'), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.searchUsers).toHaveBeenCalledWith('te', 'c1', 'u1');
      expect(result.current.data).toEqual(mockResults);
    });

    it('should not search when query is < 2 chars', async () => {
      const { result } = renderHook(() => useSearchUsers('t'), { wrapper: createWrapper() });

      expect(result.current.isFetching).toBe(false);
      expect(mockService.searchUsers).not.toHaveBeenCalled();
    });
  });
});
