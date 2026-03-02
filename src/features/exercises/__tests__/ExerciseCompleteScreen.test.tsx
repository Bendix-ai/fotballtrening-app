import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react-native';
import { Animated } from 'react-native';

// Disable native driver for all Animated operations in tests
const originalTiming = Animated.timing;
const originalSpring = Animated.spring;
const originalStagger = Animated.stagger;

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

import { ExerciseCompleteScreen } from '../ExerciseCompleteScreen';

// Navigation mocks
const mockPopToTop = jest.fn();
const mockParentNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        replace: jest.fn(),
        push: jest.fn(),
        dispatch: jest.fn(),
        popToTop: mockPopToTop,
        getParent: () => ({
            navigate: mockParentNavigate,
        }),
    }),
    useRoute: () => ({
        params: { exerciseId: 'ex1', pointsEarned: 15 },
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
}));

const mockExercise = {
    id: 'ex1',
    title: 'Oppvarming med ball',
    description: 'Lett oppvarming.',
    instructions: 'Start med lett jogging.',
    image_url: null,
    video_url: null,
    duration_seconds: 120,
    difficulty: 'easy' as const,
    category: 'warmup' as const,
    points: 15,
    is_public: true,
    created_by_club_id: null,
    equipment: '',
    assigned_team_ids: null,
    created_at: '2024-01-01',
};

const mockMutate = jest.fn();
const mockRefetchAchievements = jest.fn().mockResolvedValue({ data: [] });

jest.mock('../../../hooks/useExercises', () => ({
    useExercise: () => ({
        data: mockExercise,
    }),
    useCompleteExercise: () => ({
        mutate: mockMutate,
    }),
    useTodayCompletions: () => ({
        data: [
            { exercise_id: 'ex0', points_earned: 10 },
        ],
    }),
}));

jest.mock('../../../hooks/useAchievements', () => ({
    useAchievements: () => ({
        data: [],
        refetch: mockRefetchAchievements,
    }),
}));

jest.mock('../../../stores', () => ({
    useAppStore: () => ({
        dailyGoal: 5,
    }),
    useAuthStore: () => ({
        user: { id: 'u1', total_points: 120, club_id: 'c1' },
    }),
}));

jest.mock('../../../data/mockData', () => ({
    achievementDefinitions: {},
}));

jest.mock('../../../hooks/useLeaderboard', () => ({
    useLeaderboard: () => ({
        data: [
            { rank: 1, user_id: 'other', display_name: 'Other', is_current_user: false, total_points: 500, exercises_completed: 20, current_streak: 5, avatar_url: null },
            { rank: 2, user_id: 'u1', display_name: 'Me', is_current_user: true, total_points: 120, exercises_completed: 8, current_streak: 3, avatar_url: null },
        ],
    }),
}));

jest.mock('../../../lib/sounds', () => ({
    playSound: jest.fn(),
}));

jest.mock('../../../lib/levelUtils', () => ({
    getLevelInfo: () => ({
        level: 3,
        tier: 'bronze',
        currentPoints: 120,
        pointsForCurrentLevel: 100,
        pointsForNextLevel: 300,
        progressToNext: 0.1,
        tierIcon: 'shield',
        tierColor: '#CD7F32',
    }),
    getPointsToNextLevel: () => 180,
}));

jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        Card: ({ children, style, testID }: any) => React.createElement(View, { style, testID }, children),
        Button: ({ title, onPress, testID }: any) =>
            React.createElement(
                TouchableOpacity,
                { onPress, testID },
                React.createElement(Text, null, title)
            ),
        ProgressBar: ({ progress, color }: any) =>
            React.createElement(View, { testID: 'progress-bar' }),
        LevelUpModal: ({ visible, level, _tierName, _tierColor, _onDismiss }: any) =>
            visible ? React.createElement(View, { testID: 'level-up-modal' }, React.createElement(Text, null, `Level ${level}`)) : null,
        Mascot: ({ state, size }: any) =>
            React.createElement(View, { testID: 'mascot' }, React.createElement(Text, null, state)),
    };
});

describe('ExerciseCompleteScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        // Unmount component first to trigger useEffect cleanup before clearing timers
        cleanup();
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should render the congratulations heading', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText('Bra jobbet!')).toBeTruthy();
    });

    it('should display the exercise name in subheading', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText(/Oppvarming med ball/)).toBeTruthy();
    });

    it('should display the points earned', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText('+15')).toBeTruthy();
    });

    it('should display the points label', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText('poeng')).toBeTruthy();
    });

    it('should render the three CTA buttons', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByTestId('complete-do-another-button')).toBeTruthy();
        expect(screen.getByText('Gjør en øvelse til')).toBeTruthy();
        expect(screen.getByTestId('complete-see-progress-button')).toBeTruthy();
        expect(screen.getByText('Se fremgang')).toBeTruthy();
        expect(screen.getByTestId('complete-back-home-button')).toBeTruthy();
        expect(screen.getByText('Tilbake til hjem')).toBeTruthy();
    });

    it('should navigate back to exercises list when "do another" pressed', () => {
        render(<ExerciseCompleteScreen />);
        fireEvent.press(screen.getByTestId('complete-do-another-button'));
        expect(mockPopToTop).toHaveBeenCalled();
    });

    it('should navigate to profile when "see progress" pressed', () => {
        render(<ExerciseCompleteScreen />);
        fireEvent.press(screen.getByTestId('complete-see-progress-button'));
        expect(mockParentNavigate).toHaveBeenCalledWith('ProfileTab');
    });

    it('should navigate to home when "back to home" pressed', () => {
        render(<ExerciseCompleteScreen />);
        fireEvent.press(screen.getByTestId('complete-back-home-button'));
        expect(mockParentNavigate).toHaveBeenCalledWith('Home');
    });

    it('should call completeExercise mutation on mount', () => {
        render(<ExerciseCompleteScreen />);
        expect(mockMutate).toHaveBeenCalledWith({
            exerciseId: 'ex1',
            pointsEarned: 15,
            isDailyChallenge: false,
        });
    });

    it('should render the checkmark icon', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText('check')).toBeTruthy(); // MockIcon renders name as text
    });

    it('should render the star icon for points', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText('star')).toBeTruthy(); // MockIcon renders name as text
    });

    it('should render the level progress card', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByTestId('complete-level-progress')).toBeTruthy();
    });

    it('should display the level text', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText(/Nivå 3/)).toBeTruthy();
    });

    it('should display points to next level', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText(/180 poeng til neste nivå/)).toBeTruthy();
    });

    it('should display the user rank', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText(/Du er #2 i klubben/)).toBeTruthy();
    });

    it('should call playSound with complete on mount', () => {
        const { playSound: mockPlaySound } = require('../../../lib/sounds');
        render(<ExerciseCompleteScreen />);
        expect(mockPlaySound).toHaveBeenCalledWith('complete');
    });
});

describe('ExerciseCompleteScreen - daily challenge 2x', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        // Override route to include isDailyChallenge
        const navMock = require('@react-navigation/native');
        navMock.useRoute = () => ({
            params: { exerciseId: 'ex1', pointsEarned: 15, isDailyChallenge: true },
        });
    });

    afterEach(() => {
        cleanup();
        jest.clearAllTimers();
        jest.useRealTimers();
        // Restore original route
        const navMock = require('@react-navigation/native');
        navMock.useRoute = () => ({
            params: { exerciseId: 'ex1', pointsEarned: 15 },
        });
    });

    it('should show daily challenge banner when isDailyChallenge is true', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByTestId('complete-daily-challenge-banner')).toBeTruthy();
    });

    it('should show 2x multiplier badge', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByTestId('complete-multiplier-badge')).toBeTruthy();
        expect(screen.getByText('2x')).toBeTruthy();
    });

    it('should display doubled points value in UI', () => {
        render(<ExerciseCompleteScreen />);
        // pointsEarned=15, doubled = 30
        expect(screen.getByText('+30')).toBeTruthy();
    });

    it('should send original (non-doubled) points to backend', () => {
        render(<ExerciseCompleteScreen />);
        expect(mockMutate).toHaveBeenCalledWith({
            exerciseId: 'ex1',
            pointsEarned: 15, // Original, not doubled — trigger handles doubling
            isDailyChallenge: true,
        });
    });
});

describe('ExerciseCompleteScreen - daily goal reached', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        // Override stores to simulate daily goal being reached
        const storesMock = require('../../../stores');
        storesMock.useAppStore = () => ({
            dailyGoal: 2,
        });
        storesMock.useAuthStore = () => ({
            user: { id: 'u1', total_points: 120, club_id: 'c1' },
        });
        // Override hooks to simulate 1 completion + this one = 2 = goal
        const exerciseHooks = require('../../../hooks/useExercises');
        exerciseHooks.useTodayCompletions = () => ({
            data: [{ exercise_id: 'ex0', points_earned: 10 }],
        });
    });

    afterEach(() => {
        cleanup();
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should show daily goal reached banner when goal is met', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText('Dagens mål nådd!')).toBeTruthy();
    });
});
