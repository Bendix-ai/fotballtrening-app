import { renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useMascotMessage } from '../useMascotMessage';
import { useAuthStore } from '../../stores';
import * as exerciseService from '../../services/exerciseService';

jest.mock('../../services/exerciseService');
const mockService = exerciseService as jest.Mocked<typeof exerciseService>;

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useMascotMessage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockService.getTodayCompletions.mockResolvedValue([]);
    });

    it('should return happy state for new user (total_points === 0)', () => {
        useAuthStore.setState({
            user: {
                id: 'u1',
                club_id: 'c1',
                role: 'player',
                total_points: 0,
                current_streak: 0,
                longest_streak: 0,
            } as any,
            isAuthenticated: true,
        });

        const { result } = renderHook(() => useMascotMessage(), {
            wrapper: createWrapper(),
        });

        expect(result.current.state).toBe('happy');
        expect(result.current.message).toContain('første øvelse');
    });

    it('should return impressed state for streak > 7', () => {
        useAuthStore.setState({
            user: {
                id: 'u1',
                club_id: 'c1',
                role: 'player',
                total_points: 500,
                current_streak: 10,
                longest_streak: 10,
            } as any,
            isAuthenticated: true,
        });

        const { result } = renderHook(() => useMascotMessage(), {
            wrapper: createWrapper(),
        });

        expect(result.current.state).toBe('impressed');
    });

    it('should return cheering state when exercise completed today', () => {
        useAuthStore.setState({
            user: {
                id: 'u1',
                club_id: 'c1',
                role: 'player',
                total_points: 100,
                current_streak: 3,
                longest_streak: 5,
            } as any,
            isAuthenticated: true,
        });

        // Pre-populate cache with the correct query key: ['exercises', 'today', 'u1']
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false, gcTime: 0 } },
        });
        queryClient.setQueryData(['exercises', 'today', 'u1'], [
            { id: 'c1', exercise_id: 'e1', points_earned: 10 },
        ]);

        const wrapper = ({ children }: { children: React.ReactNode }) =>
            React.createElement(QueryClientProvider, { client: queryClient }, children);

        const { result } = renderHook(() => useMascotMessage(), { wrapper });

        expect(result.current.state).toBe('cheering');
    });

    it('should return time-appropriate message for user with no exercise today', () => {
        useAuthStore.setState({
            user: {
                id: 'u1',
                club_id: 'c1',
                role: 'player',
                total_points: 100,
                current_streak: 0,
                longest_streak: 5,
            } as any,
            isAuthenticated: true,
        });

        const { result } = renderHook(() => useMascotMessage(), {
            wrapper: createWrapper(),
        });

        // Should be one of the 'no exercise today' or time-of-day variants
        expect(result.current.message).toBeTruthy();
        expect(['thinking', 'happy', 'training']).toContain(result.current.state);
    });

    it('should return worried state when streak at risk in evening', () => {
        // Mock evening time (20:00)
        const dateSpy = jest.spyOn(Date.prototype, 'getHours').mockReturnValue(20);

        useAuthStore.setState({
            user: {
                id: 'u1',
                club_id: 'c1',
                role: 'player',
                total_points: 100,
                current_streak: 5,
                longest_streak: 10,
            } as any,
            isAuthenticated: true,
        });

        const { result } = renderHook(() => useMascotMessage(), {
            wrapper: createWrapper(),
        });

        expect(result.current.state).toBe('worried');
        expect(result.current.message).toContain('fare');

        dateSpy.mockRestore();
    });

    it('should return a valid message when user is null', () => {
        useAuthStore.setState({
            user: null,
            isAuthenticated: false,
        });

        const { result } = renderHook(() => useMascotMessage(), {
            wrapper: createWrapper(),
        });

        // total_points defaults to 0 when user is null, so should get new user message
        expect(result.current.state).toBe('happy');
        expect(result.current.message).toBeTruthy();
    });
});
