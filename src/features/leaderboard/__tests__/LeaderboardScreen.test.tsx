import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Animated } from 'react-native';

// Disable native driver for all Animated operations in tests
const originalTiming = Animated.timing;
const originalSpring = Animated.spring;

beforeAll(() => {
    (Animated as any).timing = (value: any, config: any) =>
        originalTiming(value, { ...config, useNativeDriver: false });
    (Animated as any).spring = (value: any, config: any) =>
        originalSpring(value, { ...config, useNativeDriver: false });
});

afterAll(() => {
    (Animated as any).timing = originalTiming;
    (Animated as any).spring = originalSpring;
});

import { LeaderboardScreen } from '../LeaderboardScreen';

// Navigation mocks
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        replace: jest.fn(),
        push: jest.fn(),
        dispatch: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
}));

const mockLeaderboardData = [
    {
        rank: 1,
        user_id: 'u1',
        display_name: 'Lansen',
        avatar_url: null,
        total_points: 500,
        exercises_completed: 50,
        current_streak: 10,
        is_current_user: false,
    },
    {
        rank: 2,
        user_id: 'u2',
        display_name: 'Magnus',
        avatar_url: null,
        total_points: 400,
        exercises_completed: 40,
        current_streak: 7,
        is_current_user: false,
    },
    {
        rank: 3,
        user_id: 'u3',
        display_name: 'Sofie',
        avatar_url: null,
        total_points: 350,
        exercises_completed: 35,
        current_streak: 5,
        is_current_user: false,
    },
    {
        rank: 4,
        user_id: 'u4',
        display_name: 'Erik',
        avatar_url: null,
        total_points: 300,
        exercises_completed: 30,
        current_streak: 3,
        is_current_user: false,
    },
    {
        rank: 5,
        user_id: 'u5',
        display_name: 'Test Player',
        avatar_url: null,
        total_points: 100,
        exercises_completed: 10,
        current_streak: 2,
        is_current_user: true,
    },
];

const mockRefetch = jest.fn().mockResolvedValue({ data: mockLeaderboardData });

jest.mock('../../../hooks/useLeaderboard', () => ({
    useLeaderboard: () => ({
        data: mockLeaderboardData,
        refetch: mockRefetch,
        isLoading: false,
    }),
}));

jest.mock('../../../lib/levelUtils', () => ({
    getLevelInfo: jest.fn().mockReturnValue({
        level: 2,
        tier: 'bronze',
        currentPoints: 100,
        pointsForCurrentLevel: 50,
        pointsForNextLevel: 150,
        progressToNext: 0.67,
        tierIcon: 'shield',
        tierColor: '#CD7F32',
    }),
}));

jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return {
        LoadingSkeleton: ({ width, height }: any) =>
            React.createElement(View, { testID: 'loading-skeleton', style: { width, height } }),
    };
});

describe('LeaderboardScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the screen title', () => {
        render(<LeaderboardScreen />);
        expect(screen.getByText('Toppliste')).toBeTruthy();
    });

    it('should render scope filter chips', () => {
        render(<LeaderboardScreen />);
        expect(screen.getByText('Klubb')).toBeTruthy();
        expect(screen.getByText('Årgang')).toBeTruthy();
        expect(screen.getByText('Lag')).toBeTruthy();
    });

    it('should render period filter buttons', () => {
        render(<LeaderboardScreen />);
        expect(screen.getByText('Denne uken')).toBeTruthy();
        expect(screen.getByText('Denne måneden')).toBeTruthy();
        expect(screen.getByText('Totalt')).toBeTruthy();
    });

    it('should render top 3 player names in podium', () => {
        render(<LeaderboardScreen />);
        expect(screen.getByText('Lansen')).toBeTruthy();
        expect(screen.getByText('Magnus')).toBeTruthy();
        expect(screen.getByText('Sofie')).toBeTruthy();
    });

    it('should render top 3 player points in podium', () => {
        render(<LeaderboardScreen />);
        expect(screen.getByText('500')).toBeTruthy();
        expect(screen.getByText('400')).toBeTruthy();
        expect(screen.getByText('350')).toBeTruthy();
    });

    it('should render remaining players in the list', () => {
        render(<LeaderboardScreen />);
        expect(screen.getByText('Erik')).toBeTruthy();
    });

    it('should mark current user entry', () => {
        render(<LeaderboardScreen />);
        // Current user should show "(Deg)" after name, may appear multiple times (list + sticky)
        const entries = screen.getAllByText(/Test Player.*\(Deg\)/);
        expect(entries.length).toBeGreaterThanOrEqual(1);
    });

    it('should render player points in list', () => {
        render(<LeaderboardScreen />);
        // Erik has 300 points, Test Player has 100 points (100 may appear multiple times)
        expect(screen.getByText('300')).toBeTruthy();
        expect(screen.getAllByText('100').length).toBeGreaterThanOrEqual(1);
    });

    it('should render exercise count stats', () => {
        render(<LeaderboardScreen />);
        // Exercise counts are rendered in stat text
        expect(screen.getAllByText(/øvelser/).length).toBeGreaterThanOrEqual(1);
    });

    it('should render streak for players with active streaks', () => {
        render(<LeaderboardScreen />);
        // Streaks are rendered as numbers next to fire icons (may appear multiple times)
        expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
    });

    it('should render current user as sticky card at bottom when rank > 3', () => {
        render(<LeaderboardScreen />);
        // The current user (rank 5) should also appear in a sticky section
        const currentUserEntries = screen.getAllByText(/Test Player/);
        // Should appear at least twice: once in list, once in sticky
        expect(currentUserEntries.length).toBeGreaterThanOrEqual(2);
    });

    it('should render podium ranks', () => {
        render(<LeaderboardScreen />);
        // Rank numbers appear in both podium and list entries, so use getAllByText
        expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
    });

    it('should render points label', () => {
        render(<LeaderboardScreen />);
        const pointsLabels = screen.getAllByText('Poeng');
        expect(pointsLabels.length).toBeGreaterThan(0);
    });
});

describe('LeaderboardScreen - loading state', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const leaderboardHook = require('../../../hooks/useLeaderboard');
        leaderboardHook.useLeaderboard = () => ({
            data: [],
            refetch: jest.fn(),
            isLoading: true,
        });
    });

    afterEach(() => {
        const leaderboardHook = require('../../../hooks/useLeaderboard');
        leaderboardHook.useLeaderboard = () => ({
            data: mockLeaderboardData,
            refetch: mockRefetch,
            isLoading: false,
        });
    });

    it('should show loading skeletons when data is loading', () => {
        render(<LeaderboardScreen />);
        const skeletons = screen.getAllByTestId('loading-skeleton');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});
