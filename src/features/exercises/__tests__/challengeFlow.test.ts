/**
 * Integration tests for the challenge flow:
 * Select exercise → Create challenge → Select friend → Send → Verify
 */
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import * as challengeService from '../../../services/challengeService';
import { useCreateChallenge, useChallenges, useAcceptChallenge, useDeclineChallenge } from '../../../hooks/useChallenges';

jest.mock('../../../services/challengeService');
const mockService = challengeService as jest.Mocked<typeof challengeService>;

jest.mock('../../../stores', () => ({
    useAuthStore: () => ({
        user: { id: 'u1', display_name: 'Bjarne', club_id: 'c1', role: 'player' },
        isAuthenticated: true,
    }),
}));

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('Challenge Flow - Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a challenge with friend and exercise', async () => {
        mockService.createChallenge.mockResolvedValue({
            id: 'ch1',
            challenger_id: 'u1',
            challenger_name: 'Bjarne',
            opponent_id: 'f1',
            opponent_name: 'Ola',
            exercise_id: 'ex1',
            exercise_title: 'Sprint',
            status: 'pending',
            bonus_points: 10,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 48 * 3600000).toISOString(),
            challenger_completed: false,
            opponent_completed: false,
        });

        const { result } = renderHook(() => useCreateChallenge(), { wrapper: createWrapper() });

        result.current.mutate({
            opponentId: 'f1',
            opponentName: 'Ola',
            exerciseId: 'ex1',
            exerciseTitle: 'Sprint',
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(mockService.createChallenge).toHaveBeenCalledWith(
            'u1', 'Bjarne', 'f1', 'Ola', 'ex1', 'Sprint'
        );
    });

    it('should handle error when creating challenge fails', async () => {
        mockService.createChallenge.mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useCreateChallenge(), { wrapper: createWrapper() });

        result.current.mutate({
            opponentId: 'f1',
            opponentName: 'Ola',
            exerciseId: 'ex1',
            exerciseTitle: 'Sprint',
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it('should fetch challenges list', async () => {
        const mockChallenges = [
            {
                id: 'ch1',
                challenger_id: 'u1',
                challenger_name: 'Bjarne',
                opponent_id: 'f1',
                opponent_name: 'Ola',
                exercise_id: 'ex1',
                exercise_title: 'Sprint',
                status: 'pending' as const,
                bonus_points: 10,
                created_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 48 * 3600000).toISOString(),
                challenger_completed: false,
                opponent_completed: false,
            },
        ];
        mockService.getChallenges.mockResolvedValue(mockChallenges);

        const { result } = renderHook(() => useChallenges(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toHaveLength(1);
        expect(result.current.data![0].opponent_name).toBe('Ola');
    });

    it('should accept a challenge', async () => {
        mockService.updateChallengeStatus.mockResolvedValue(undefined);

        const { result } = renderHook(() => useAcceptChallenge(), { wrapper: createWrapper() });

        result.current.mutate('ch1');

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockService.updateChallengeStatus).toHaveBeenCalledWith('ch1', 'accepted');
    });

    it('should decline a challenge', async () => {
        mockService.updateChallengeStatus.mockResolvedValue(undefined);

        const { result } = renderHook(() => useDeclineChallenge(), { wrapper: createWrapper() });

        result.current.mutate('ch1');

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockService.updateChallengeStatus).toHaveBeenCalledWith('ch1', 'expired');
    });
});
