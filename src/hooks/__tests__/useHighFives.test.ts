import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useSendHighFive } from '../useHighFives';
import * as highfiveService from '../../services/highfiveService';
import { useAuthStore } from '../../stores';

jest.mock('../../services/highfiveService');
const mockService = highfiveService as jest.Mocked<typeof highfiveService>;

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useHighFives hooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAuthStore.setState({
            user: { id: 'u1', club_id: 'c1', role: 'player' } as any,
            isAuthenticated: true,
        });
    });

    describe('useSendHighFive', () => {
        it('should call sendHighFive service with current user id', async () => {
            mockService.sendHighFive.mockResolvedValue(true);

            const { result } = renderHook(() => useSendHighFive(), { wrapper: createWrapper() });

            result.current.mutate({ toUserId: 'u2', activityId: 'act1' });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(mockService.sendHighFive).toHaveBeenCalledWith('u1', 'u2', 'act1');
        });

        it('should handle failure gracefully', async () => {
            mockService.sendHighFive.mockResolvedValue(false);

            const { result } = renderHook(() => useSendHighFive(), { wrapper: createWrapper() });

            result.current.mutate({ toUserId: 'u2', activityId: 'act1' });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));
            expect(result.current.data).toBe(false);
        });
    });
});
