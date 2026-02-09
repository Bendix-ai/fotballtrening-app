import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useStoreExercises, useStoreExercise, useStoreReviews, useDownloadExercise } from '../useStore';
import * as storeService from '../../services/storeService';
import { useAuthStore } from '../../stores';

jest.mock('../../services/storeService');
const mockService = storeService as jest.Mocked<typeof storeService>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useStore hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'u1', club_id: 'c1', role: 'admin' } as any,
      isAuthenticated: true,
    });
  });

  describe('useStoreExercises', () => {
    it('should fetch store exercises', async () => {
      const mockData = [{ id: 's1', title: 'Store Ex' }];
      mockService.getStoreExercises.mockResolvedValue(mockData as any);

      const { result } = renderHook(() => useStoreExercises(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getStoreExercises).toHaveBeenCalled();
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('useStoreExercise', () => {
    it('should fetch single store exercise', async () => {
      const mockEx = { id: 's1', title: 'Store Ex' };
      mockService.getStoreExerciseById.mockResolvedValue(mockEx as any);

      const { result } = renderHook(() => useStoreExercise('s1'), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getStoreExerciseById).toHaveBeenCalledWith('s1');
    });

    it('should not fetch with empty id', async () => {
      const { result } = renderHook(() => useStoreExercise(''), { wrapper: createWrapper() });

      expect(result.current.isFetching).toBe(false);
      expect(mockService.getStoreExerciseById).not.toHaveBeenCalled();
    });
  });

  describe('useStoreReviews', () => {
    it('should fetch reviews for exercise', async () => {
      const mockReviews = [{ id: 'r1', rating: 5 }];
      mockService.getStoreReviews.mockResolvedValue(mockReviews as any);

      const { result } = renderHook(() => useStoreReviews('s1'), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getStoreReviews).toHaveBeenCalledWith('s1');
    });
  });

  describe('useDownloadExercise', () => {
    it('should call downloadToClub service', async () => {
      mockService.downloadToClub.mockResolvedValue(true);

      const { result } = renderHook(() => useDownloadExercise(), { wrapper: createWrapper() });

      result.current.mutate('s1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.downloadToClub).toHaveBeenCalledWith('s1', 'c1');
    });
  });
});
