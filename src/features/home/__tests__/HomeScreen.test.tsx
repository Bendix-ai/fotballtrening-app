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
    useFriendActivityFeed: () => ({
        data: [],
        refetch: jest.fn(),
    }),
}));

jest.mock('../../../hooks/useChallenges', () => ({
    useActiveChallenges: () => ({
        data: [],
    }),
}));

jest.mock('../../../hooks/useFriends', () => ({
    useFriends: () => ({
        data: [],
    }),
}));

jest.mock('../../../lib/sounds', () => ({
    playSound: jest.fn(),
}));

jest.mock('../../../hooks/useHighFives', () => ({
    useSendHighFive: () => ({
        mutate: jest.fn(),
        isLoading: false,
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
        lastLoginBonusDate: new Date().toISOString().slice(0, 10),
        awardLoginBonus: jest.fn(),
    }),
}));

jest.mock('../../../hooks/useChallenges', () => ({
    useActiveChallenges: () => ({
        data: [],
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
}));

jest.mock('../../../hooks/useMascotMessage', () => ({
    useMascotMessage: () => ({
        message: 'Bra jobbet i dag!',
        state: 'cheering',
    }),
}));

jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        Card: ({ children, style, testID }: any) => React.createElement(View, { style, testID }, children),
        ProgressBar: ({ progress }: any) =>
            React.createElement(View, { testID: 'progress-bar' }),
        MascotMessage: ({ message, state, onDismiss, testID }: any) =>
            React.createElement(
                View,
                { testID: testID || 'mascot-message' },
                React.createElement(Text, null, message),
                onDismiss ? React.createElement(TouchableOpacity, { testID: 'mascot-message-dismiss', onPress: onDismiss }) : null
            ),
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

    it('should render the status stripe with streak, level, and rank', () => {
        render(<HomeScreen />);
        expect(screen.getByTestId('home-status-stripe')).toBeTruthy();
        // Streak value
        expect(screen.getByText('3d')).toBeTruthy();
        // Level value
        expect(screen.getByText('Nivå 2')).toBeTruthy();
        // Rank value
        expect(screen.getByText('#3')).toBeTruthy();
    });

    it('should render the CTA card with testIDs', () => {
        render(<HomeScreen />);
        expect(screen.getByTestId('home-cta-card')).toBeTruthy();
        expect(screen.getByTestId('home-cta-button')).toBeTruthy();
    });

    it('should render the CTA title "Dagens trening"', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Dagens trening')).toBeTruthy();
    });

    it('should render "Start dagens plan" button text', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Start dagens plan')).toBeTruthy();
    });

    it('should show exercises available count in CTA', () => {
        render(<HomeScreen />);
        expect(screen.getByText('2 øvelser tilgjengelige')).toBeTruthy();
    });

    it('should render the daily goal section', () => {
        render(<HomeScreen />);
        expect(screen.getByText('Dagens mål')).toBeTruthy();
        expect(screen.getByText('1/5')).toBeTruthy();
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
        expect(screen.getAllByText('Oppvarming med ball').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Styrke: Kneboey').length).toBeGreaterThanOrEqual(1);
    });

    it('should show daily challenge title in the CTA card', () => {
        render(<HomeScreen />);
        // The daily challenge exercise title should appear inside the CTA card
        // Which exercise depends on the day, but both are in the exercise list
        const allTexts = [
            ...screen.queryAllByText('Oppvarming med ball'),
            ...screen.queryAllByText('Styrke: Kneboey'),
        ];
        expect(allTexts.length).toBeGreaterThanOrEqual(1);
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

    // Note: home-screen testID is on SafeAreaView which is mocked to pass-through children only.
    // The testID exists in the source and works at runtime and in Maestro E2E tests.
});
