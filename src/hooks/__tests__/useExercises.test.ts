import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useExercises, useExercise, useCompleteExercise, useCompletions, useFavorites, useToggleFavorite, useCreateExercise, useDeleteExercise } from '../useExercises';
import * as exerciseService from '../../services/exerciseService';
import { useAuthStore } from '../../stores';

jest.mock('../../services/exerciseService');
const mockService = exerciseService as jest.Mocked<typeof exerciseService>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useExercises hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'u1', club_id: 'c1', role: 'player' } as any,
      isAuthenticated: true,
    });
  });

  describe('useExercises', () => {
    it('should fetch exercises for club', async () => {
      const mockData = [{ id: 'e1', title: 'Passing drill' }];
      mockService.getExercises.mockResolvedValue(mockData as any);

      const { result } = renderHook(() => useExercises(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getExercises).toHaveBeenCalledWith('c1');
      expect(result.current.data).toEqual(mockData);
    });

    it('should use provided clubId over store', async () => {
      mockService.getExercises.mockResolvedValue([]);

      renderHook(() => useExercises('c2'), { wrapper: createWrapper() });

      await waitFor(() => expect(mockService.getExercises).toHaveBeenCalledWith('c2'));
    });

    it('should not fetch when no clubId', async () => {
      useAuthStore.setState({ user: null });

      const { result } = renderHook(() => useExercises(), { wrapper: createWrapper() });

      expect(result.current.isFetching).toBe(false);
      expect(mockService.getExercises).not.toHaveBeenCalled();
    });
  });

  describe('useExercise', () => {
    it('should fetch a single exercise', async () => {
      const mockEx = { id: 'e1', title: 'Test' };
      mockService.getExerciseById.mockResolvedValue(mockEx as any);

      const { result } = renderHook(() => useExercise('e1'), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockEx);
    });
  });

  describe('useCompleteExercise', () => {
    it('should call completeExercise service', async () => {
      const mockCompletion = { id: 'comp1' };
      mockService.completeExercise.mockResolvedValue(mockCompletion as any);

      const { result } = renderHook(() => useCompleteExercise(), { wrapper: createWrapper() });

      result.current.mutate({ exerciseId: 'e1', pointsEarned: 10 });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.completeExercise).toHaveBeenCalledWith('u1', 'e1', 10);
    });
  });

  describe('useCompletions', () => {
    it('should fetch completions for user', async () => {
      mockService.getCompletions.mockResolvedValue([]);

      const { result } = renderHook(() => useCompletions(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getCompletions).toHaveBeenCalledWith('u1');
    });
  });

  describe('useFavorites', () => {
    it('should fetch favorites', async () => {
      mockService.getFavorites.mockResolvedValue(['e1']);

      const { result } = renderHook(() => useFavorites(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.getFavorites).toHaveBeenCalledWith('u1');
    });
  });

  describe('useToggleFavorite', () => {
    it('should call toggleFavorite service', async () => {
      mockService.toggleFavorite.mockResolvedValue(undefined);

      const { result } = renderHook(() => useToggleFavorite(), { wrapper: createWrapper() });

      result.current.mutate({ exerciseId: 'e1', isFavorite: true });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.toggleFavorite).toHaveBeenCalledWith('u1', 'e1', true);
    });
  });

  describe('useCreateExercise', () => {
    it('should call createExercise service', async () => {
      const newExercise = { title: 'New', category: 'passing' } as any;
      mockService.createExercise.mockResolvedValue({ id: 'e-new', ...newExercise });

      const { result } = renderHook(() => useCreateExercise(), { wrapper: createWrapper() });

      result.current.mutate(newExercise);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.createExercise).toHaveBeenCalledWith(newExercise);
    });
  });

  describe('useDeleteExercise', () => {
    it('should call deleteExercise service', async () => {
      mockService.deleteExercise.mockResolvedValue(true);

      const { result } = renderHook(() => useDeleteExercise(), { wrapper: createWrapper() });

      result.current.mutate('e1');

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mockService.deleteExercise).toHaveBeenCalledWith('e1');
    });
  });
});
