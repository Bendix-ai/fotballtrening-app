import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
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
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
        replace: jest.fn(),
        push: jest.fn(),
        dispatch: jest.fn(),
        popToTop: mockPopToTop,
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
}));

jest.mock('../../../data/mockData', () => ({
    achievementDefinitions: {},
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
    };
});

describe('ExerciseCompleteScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
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

    it('should render the continue button', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByTestId('exercise-back-button')).toBeTruthy();
        expect(screen.getByText('Fortsett trening')).toBeTruthy();
    });

    it('should navigate back to exercises list when continue pressed', () => {
        render(<ExerciseCompleteScreen />);
        fireEvent.press(screen.getByTestId('exercise-back-button'));
        expect(mockPopToTop).toHaveBeenCalled();
    });

    it('should call completeExercise mutation on mount', () => {
        render(<ExerciseCompleteScreen />);
        expect(mockMutate).toHaveBeenCalledWith({
            exerciseId: 'ex1',
            pointsEarned: 15,
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
});

describe('ExerciseCompleteScreen - daily goal reached', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Override stores to simulate daily goal being reached
        const storesMock = require('../../../stores');
        storesMock.useAppStore = () => ({
            dailyGoal: 2,
        });
        // Override hooks to simulate 1 completion + this one = 2 = goal
        const exerciseHooks = require('../../../hooks/useExercises');
        exerciseHooks.useTodayCompletions = () => ({
            data: [{ exercise_id: 'ex0', points_earned: 10 }],
        });
    });

    it('should show daily goal reached banner when goal is met', () => {
        render(<ExerciseCompleteScreen />);
        expect(screen.getByText('Dagens mål nådd!')).toBeTruthy();
    });
});
