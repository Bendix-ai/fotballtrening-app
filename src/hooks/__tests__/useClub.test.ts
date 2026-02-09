import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useClubs, useYearGroups, useTeams, useClubStructure, useAddYearGroup } from '../useClub';
import * as clubService from '../../services/clubService';
import { useAuthStore } from '../../stores';

jest.mock('../../services/clubService');
const mockService = clubService as jest.Mocked<typeof clubService>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useClub hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'u1', club_id: 'c1', role: 'admin' } as any,
      isAuthenticated: true,
    });
  });

  describe('useClubs', () => {
    it('should fetch all clubs', async () => {
      const mockClubs = [{ id: 'c1', name: 'Test FK' }];
      mockService.getClubs.mockResolvedValue(mockClubs as any);

      const { result } = renderHook(() => useClubs(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getClubs).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockClubs);
    });
  });

  describe('useYearGroups', () => {
    it('should fetch year groups for club', async () => {
      const mockGroups = [{ value: 'yg1', label: '2015' }];
      mockService.getYearGroups.mockResolvedValue(mockGroups as any);

      const { result } = renderHook(() => useYearGroups(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getYearGroups).toHaveBeenCalledWith('c1');
    });

    it('should use provided clubId', async () => {
      mockService.getYearGroups.mockResolvedValue([]);

      renderHook(() => useYearGroups('c2'), { wrapper: createWrapper() });

      await waitFor(() => expect(mockService.getYearGroups).toHaveBeenCalledWith('c2'));
    });
  });

  describe('useTeams', () => {
    it('should fetch teams for year group', async () => {
      const mockTeams = [{ value: 'boys', label: 'Gutter', teamId: 't1' }];
      mockService.getTeams.mockResolvedValue(mockTeams as any);

      const { result } = renderHook(() => useTeams('yg1'), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getTeams).toHaveBeenCalledWith('yg1');
    });

    it('should not fetch when yearGroupId is null', async () => {
      const { result } = renderHook(() => useTeams(null), { wrapper: createWrapper() });

      expect(result.current.isFetching).toBe(false);
      expect(mockService.getTeams).not.toHaveBeenCalled();
    });
  });

  describe('useClubStructure', () => {
    it('should fetch club structure', async () => {
      const mockStructure = [{ year: 2015, teams: [] }];
      mockService.getClubStructure.mockResolvedValue(mockStructure as any);

      const { result } = renderHook(() => useClubStructure(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getClubStructure).toHaveBeenCalledWith('c1');
    });
  });

  describe('useAddYearGroup', () => {
    it('should call addYearGroup service', async () => {
      mockService.addYearGroup.mockResolvedValue(true);

      const { result } = renderHook(() => useAddYearGroup(), { wrapper: createWrapper() });

      result.current.mutate({ clubId: 'c1', year: 2016 });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.addYearGroup).toHaveBeenCalledWith('c1', 2016);
    });
  });
});
