import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';

// Navigation mocks
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: jest.fn(),
        replace: jest.fn(),
        push: jest.fn(),
        dispatch: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
}));

const mockExercises = [
    {
        id: 'ex1',
        title: 'Oppvarming med ball',
        description: 'Lett oppvarming med fotball.',
        instructions: 'Start med lett jogging.',
        image_url: null,
        video_url: null,
        duration_seconds: 120,
        difficulty: 'easy' as const,
        category: 'warmup' as const,
        points: 10,
        is_public: true,
        created_by_club_id: null,
        equipment: '',
        assigned_team_ids: null,
        created_at: '2024-01-01',
    },
    {
        id: 'ex2',
        title: 'Styrke: Kneboey',
        description: 'Bygg styrke i beina.',
        instructions: 'Sta med foettene.',
        image_url: null,
        video_url: null,
        duration_seconds: 180,
        difficulty: 'medium' as const,
        category: 'strength' as const,
        points: 15,
        is_public: true,
        created_by_club_id: null,
        equipment: '',
        assigned_team_ids: null,
        created_at: '2024-01-01',
    },
];

const mockTodayCompletions = [
    { id: 'c1', user_id: 'user1', exercise_id: 'ex1', points_earned: 10, completed_at: '2024-01-01' },
];

jest.mock('../../../hooks/useExercises', () => ({
    useExercises: () => ({
        data: mockExercises,
        isLoading: false,
        refetch: jest.fn(),
    }),
    useTodayCompletions: () => ({
        data: mockTodayCompletions,
        refetch: jest.fn(),
    }),
}));

jest.mock('../../../hooks/useLeaderboard', () => ({
    useLeaderboard: () => ({
        data: [
            {
                rank: 3,
                user_id: 'user1',
                display_name: 'Test Player',
                avatar_url: null,
                total_points: 100,
                exercises_completed: 10,
                current_streak: 3,
                is_current_user: true,
            },
        ],
    }),
}));

jest.mock('../../../hooks/useAnnouncements', () => ({
    useAnnouncements: () => ({
        data: [],
    }),
}));

jest.mock('../../../hooks/useTrainingPlans', () => ({
    useActivePlan: () => ({
        data: null,
        refetch: jest.fn(),
    }),
}));

jest.mock('../../../hooks/useActivityFeed', () => ({
    useActivityFeed: () => ({
        data: [],
        refetch: jest.fn(),
    }),
}));

jest.mock('../../../stores', () => ({
    useAuthStore: () => ({
        user: {
            id: 'user1',
            username: 'testplayer',
            role: 'player',
            admin_type: null,
            club_id: 'club1',
            team_id: 'team1',
            display_name: 'Ola Nordmann',
            avatar_url: null,
            total_points: 100,
            current_streak: 3,
            longest_streak: 7,
            created_at: '2024-01-01',
            last_login: null,
        },
    }),
    useAppStore: () => ({
        dailyGoal: 5,
    }),
}));

jest.mock('../../../lib/exerciseUtils', () => ({
    getCategoryIcon: jest.fn().mockReturnValue('sports-soccer'),
    getCategoryColor: jest.fn().mockReturnValue('#4CAF50'),
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
    getPointsToNextLevel: jest.fn().mockReturnValue(50),
}));

jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        Card: ({ children, style }: any) => React.createElement(View, { style }, children),
        Button: ({ title, onPress, testID }: any) =>
            React.createElement(
                TouchableOpacity,
                { onPress, testID },
                React.createElement(Text, null, title)
            ),
        StreakCard: ({ currentStreak, longestStreak }: any) =>
            React.createElement(View, { testID: 'streak-card' },
                React.createElement(Text, null, `Streak: ${currentStreak}`),
                React.createElement(Text, null, `Longest: ${longestStreak}`),
            ),
        ProgressBar: ({ progress }: any) =>
            React.createElement(View, { testID: 'progress-bar' }),
    };
});

describe('HomeScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the greeting', () => {
        render(<HomeScreen />);
        expect(screen.getByText(/Hei/)).toBeTruthy();
    });

    it('should display the user name', () => {
        render(<HomeScreen />);
        expect(screen.getByText(/Ola Nordmann/)).toBeTruthy();
    });

    it('should render today progress section', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Dagens fremgang')).toBeTruthy();
    });

    it('should display today exercise count', () => {
        render(<HomeScreen />);
        // 1 completion today
        expect(screen.getByText('1')).toBeTruthy();
    });

    it('should display today points', () => {
        render(<HomeScreen />);
        expect(screen.getByText('10')).toBeTruthy();
    });

    it('should render the daily goal section', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Dagens mål')).toBeTruthy();
        expect(screen.getByText('1/5')).toBeTruthy();
    });

    it('should render streak card', () => {
        render(<HomeScreen />);
        expect(screen.getByTestId('streak-card')).toBeTruthy();
        expect(screen.getByText('Streak: 3')).toBeTruthy();
        expect(screen.getByText('Longest: 7')).toBeTruthy();
    });

    it('should render the current streak section title', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Nåværende streak')).toBeTruthy();
    });

    it('should render quick start button', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Start trening')).toBeTruthy();
    });

    it('should render recent exercises section', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Nylige øvelser')).toBeTruthy();
    });

    it('should render view all link', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Se alle')).toBeTruthy();
    });

    it('should display exercise titles in recent exercises', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Oppvarming med ball')).toBeTruthy();
        // Styrke: Kneboey appears in both recent exercises and daily challenge
        expect(screen.getAllByText('Styrke: Kneboey').length).toBeGreaterThanOrEqual(1);
    });

    it('should render the daily challenge section', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Dagens utfordring')).toBeTruthy();
    });

    it('should render the level card', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Nivå 2')).toBeTruthy();
    });

    it('should render points to next level text', () => {
        render(<HomeScreen />);
        expect(screen.getByText('50 poeng til neste nivå')).toBeTruthy();
    });

    it('should render leaderboard rank when available', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Du er #3 i klubben')).toBeTruthy();
    });

    it('should render quick start section title', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Hurtigstart')).toBeTruthy();
    });
});

describe('HomeScreen - loading state', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        const exerciseHooks = require('../../../hooks/useExercises');
        exerciseHooks.useExercises = () => ({
            data: [],
            isLoading: true,
            refetch: jest.fn(),
        });
    });

    afterEach(() => {
        // Restore
        const exerciseHooks = require('../../../hooks/useExercises');
        exerciseHooks.useExercises = () => ({
            data: mockExercises,
            isLoading: false,
            refetch: jest.fn(),
        });
    });

    it('should show loading state when exercises are loading', () => {
        const { UNSAFE_getByType } = render(<HomeScreen />);
        const { ActivityIndicator } = require('react-native');
        expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });
});
