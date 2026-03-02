import { renderHook } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useDailyChallenge, getDayOfYear } from '../useDailyChallenge';

const mockExercises = [
    { id: 'ex1', title: 'Sprint', points: 10, duration_seconds: 60, difficulty: 'easy', category: 'speed', instructions: '', description: '', image_url: null, video_url: null, is_public: true, created_by_club_id: null, equipment: '', assigned_team_ids: null, created_at: '2024-01-01' },
    { id: 'ex2', title: 'Passing', points: 15, duration_seconds: 90, difficulty: 'medium', category: 'technique', instructions: '', description: '', image_url: null, video_url: null, is_public: true, created_by_club_id: null, equipment: '', assigned_team_ids: null, created_at: '2024-01-01' },
    { id: 'ex3', title: 'Shooting', points: 20, duration_seconds: 120, difficulty: 'hard', category: 'shooting', instructions: '', description: '', image_url: null, video_url: null, is_public: true, created_by_club_id: null, equipment: '', assigned_team_ids: null, created_at: '2024-01-01' },
];

let mockExercisesData: any[] = mockExercises;
let mockIsLoading = false;

jest.mock('../useExercises', () => ({
    useExercises: () => ({
        data: mockExercisesData,
        isLoading: mockIsLoading,
    }),
}));

jest.mock('../../stores', () => ({
    useAuthStore: () => ({
        user: { id: 'u1', club_id: 'c1', role: 'player' },
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

describe('useDailyChallenge', () => {
    beforeEach(() => {
        mockExercisesData = mockExercises;
        mockIsLoading = false;
    });

    it('should return a daily challenge exercise based on day of year', () => {
        const { result } = renderHook(() => useDailyChallenge(), { wrapper: createWrapper() });
        expect(result.current.dailyChallenge).not.toBeNull();
        expect(result.current.dailyChallenge?.id).toBeTruthy();
    });

    it('should return null when exercises is empty', () => {
        mockExercisesData = [];
        const { result } = renderHook(() => useDailyChallenge(), { wrapper: createWrapper() });
        expect(result.current.dailyChallenge).toBeNull();
    });

    it('should return isLoading true when exercises are loading', () => {
        mockIsLoading = true;
        mockExercisesData = [];
        const { result } = renderHook(() => useDailyChallenge(), { wrapper: createWrapper() });
        expect(result.current.isLoading).toBe(true);
        expect(result.current.dailyChallenge).toBeNull();
    });

    it('isDailyChallenge should return true for the daily challenge exercise', () => {
        const { result } = renderHook(() => useDailyChallenge(), { wrapper: createWrapper() });
        const challengeId = result.current.dailyChallenge!.id;
        expect(result.current.isDailyChallenge(challengeId)).toBe(true);
    });

    it('isDailyChallenge should return false for a non-challenge exercise', () => {
        const { result } = renderHook(() => useDailyChallenge(), { wrapper: createWrapper() });
        const challengeId = result.current.dailyChallenge!.id;
        const otherId = mockExercises.find((e) => e.id !== challengeId)!.id;
        expect(result.current.isDailyChallenge(otherId)).toBe(false);
    });

    it('isDailyChallenge should return false when exercises are empty', () => {
        mockExercisesData = [];
        const { result } = renderHook(() => useDailyChallenge(), { wrapper: createWrapper() });
        expect(result.current.isDailyChallenge('ex1')).toBe(false);
    });

    it('different days should potentially give different challenges', () => {
        // With 3 exercises, dayOfYear % 3 should cycle through them
        const dayOfYear = getDayOfYear();
        const expectedIndex = dayOfYear % mockExercises.length;
        const { result } = renderHook(() => useDailyChallenge(), { wrapper: createWrapper() });
        expect(result.current.dailyChallenge?.id).toBe(mockExercises[expectedIndex].id);
    });
});

describe('getDayOfYear', () => {
    it('should return a number between 1 and 366', () => {
        const day = getDayOfYear();
        expect(day).toBeGreaterThanOrEqual(1);
        expect(day).toBeLessThanOrEqual(366);
    });

    it('should return the same value when called multiple times on the same day', () => {
        const day1 = getDayOfYear();
        const day2 = getDayOfYear();
        expect(day1).toBe(day2);
    });
});
