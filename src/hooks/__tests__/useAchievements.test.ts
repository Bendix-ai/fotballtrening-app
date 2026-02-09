import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAchievements } from '../useAchievements';
import * as achievementService from '../../services/achievementService';
import { useAuthStore } from '../../stores';

jest.mock('../../services/achievementService');
const mockService = achievementService as jest.Mocked<typeof achievementService>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useAchievements', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'u1', club_id: 'c1', role: 'player' } as any,
      isAuthenticated: true,
    });
  });

  it('should fetch achievements for current user', async () => {
    const mockData = [{ type: 'first_exercise', unlocked: true }];
    mockService.getAchievements.mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useAchievements(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockService.getAchievements).toHaveBeenCalledWith('u1');
    expect(result.current.data).toEqual(mockData);
  });

  it('should use provided userId', async () => {
    mockService.getAchievements.mockResolvedValue([]);

    renderHook(() => useAchievements('u2'), { wrapper: createWrapper() });

    await waitFor(() => expect(mockService.getAchievements).toHaveBeenCalledWith('u2'));
  });

  it('should not fetch when no userId', async () => {
    useAuthStore.setState({ user: null });

    const { result } = renderHook(() => useAchievements(), { wrapper: createWrapper() });

    expect(result.current.isFetching).toBe(false);
    expect(mockService.getAchievements).not.toHaveBeenCalled();
  });
});
