import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePlayers, useDashboardMetrics, useRecentActivity, useDeletePlayer } from '../useAdmin';
import * as adminService from '../../services/adminService';
import { useAuthStore } from '../../stores';

jest.mock('../../services/adminService');
const mockService = adminService as jest.Mocked<typeof adminService>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useAdmin hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'u1', club_id: 'c1', role: 'admin', admin_type: 'club_admin' } as any,
      managedTeamIds: [],
      isAuthenticated: true,
    });
  });

  describe('usePlayers', () => {
    it('should fetch players for club', async () => {
      const mockPlayers = [{ id: 'p1', display_name: 'Test' }];
      mockService.getPlayers.mockResolvedValue(mockPlayers as any);

      const { result } = renderHook(() => usePlayers(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getPlayers).toHaveBeenCalledWith('c1', undefined, null);
      expect(result.current.data).toEqual(mockPlayers);
    });

    it('should pass filters to service', async () => {
      mockService.getPlayers.mockResolvedValue([]);
      const filters = { yearGroup: 2015, gender: 'boys' as const };

      renderHook(() => usePlayers(filters), { wrapper: createWrapper() });

      await waitFor(() => expect(mockService.getPlayers).toHaveBeenCalledWith('c1', filters, null));
    });

    it('should pass team IDs for team admins', async () => {
      useAuthStore.setState({
        user: { id: 'u1', club_id: 'c1', role: 'admin', admin_type: 'team_admin' } as any,
        managedTeamIds: ['t1', 't2'],
      });
      mockService.getPlayers.mockResolvedValue([]);

      renderHook(() => usePlayers(), { wrapper: createWrapper() });

      await waitFor(() =>
        expect(mockService.getPlayers).toHaveBeenCalledWith('c1', undefined, ['t1', 't2'])
      );
    });
  });

  describe('useDashboardMetrics', () => {
    it('should fetch metrics', async () => {
      const mockMetrics = { totalPlayers: 10 };
      mockService.getDashboardMetrics.mockResolvedValue(mockMetrics as any);

      const { result } = renderHook(() => useDashboardMetrics(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getDashboardMetrics).toHaveBeenCalledWith('c1', null);
    });
  });

  describe('useRecentActivity', () => {
    it('should fetch activity', async () => {
      mockService.getRecentActivity.mockResolvedValue([]);

      const { result } = renderHook(() => useRecentActivity(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getRecentActivity).toHaveBeenCalledWith('c1', null);
    });
  });

  describe('useDeletePlayer', () => {
    it('should call deletePlayer service', async () => {
      mockService.deletePlayer.mockResolvedValue(true);

      const { result } = renderHook(() => useDeletePlayer(), { wrapper: createWrapper() });

      result.current.mutate('p1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.deletePlayer).toHaveBeenCalledWith('p1');
    });
  });
});
