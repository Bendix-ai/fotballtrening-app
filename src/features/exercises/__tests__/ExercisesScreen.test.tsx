import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
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

import { ExercisesScreen } from '../ExercisesScreen';

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

// Mock exercises data
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
        instructions: 'Sta med foettene i skulderbreddes avstand.',
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
    {
        id: 'ex3',
        title: 'Spenst: Hekkehopp',
        description: 'Agility trening.',
        instructions: 'Hopp over hekker.',
        image_url: null,
        video_url: null,
        duration_seconds: 150,
        difficulty: 'hard' as const,
        category: 'agility' as const,
        points: 20,
        is_public: true,
        created_by_club_id: null,
        equipment: 'Hekker',
        assigned_team_ids: null,
        created_at: '2024-01-01',
    },
];

const mockRefetch = jest.fn().mockResolvedValue({ data: mockExercises });

jest.mock('../../../hooks/useExercises', () => ({
    useExercises: () => ({
        data: mockExercises,
        refetch: mockRefetch,
        isLoading: false,
    }),
    useFavorites: () => ({
        data: ['ex1'],
    }),
    useToggleFavorite: () => ({
        mutate: jest.fn(),
    }),
    useTodayCompletions: () => ({
        data: [{ exercise_id: 'ex1', points_earned: 10 }],
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
            display_name: 'Test Player',
            avatar_url: null,
            total_points: 100,
            current_streak: 3,
            longest_streak: 7,
            created_at: '2024-01-01',
            last_login: null,
        },
    }),
}));

jest.mock('../../../lib/exerciseUtils', () => ({
    getCategoryIcon: jest.fn().mockReturnValue('sports-soccer'),
    getCategoryColor: jest.fn().mockReturnValue('#4CAF50'),
}));

jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return {
        Card: ({ children, style }: any) => React.createElement(View, { style }, children),
        SkeletonCard: () => React.createElement(View, { testID: 'skeleton-card' }),
    };
});

describe('ExercisesScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the screen title', () => {
        render(<ExercisesScreen />);
        expect(screen.getByText('Øvelser')).toBeTruthy();
    });

    it('should render the search bar', () => {
        render(<ExercisesScreen />);
        expect(screen.getByPlaceholderText('Søk etter øvelser...')).toBeTruthy();
    });

    it('should render category filter chips', () => {
        render(<ExercisesScreen />);
        expect(screen.getByText('Alle')).toBeTruthy();
        expect(screen.getByText('Oppvarming')).toBeTruthy();
        expect(screen.getByText('Styrke')).toBeTruthy();
    });

    it('should render exercise cards with titles', () => {
        render(<ExercisesScreen />);
        expect(screen.getByText('Oppvarming med ball')).toBeTruthy();
        expect(screen.getByText('Styrke: Kneboey')).toBeTruthy();
        expect(screen.getByText('Spenst: Hekkehopp')).toBeTruthy();
    });

    it('should display exercise points', () => {
        render(<ExercisesScreen />);
        expect(screen.getByText('+10')).toBeTruthy();
        expect(screen.getByText('+15')).toBeTruthy();
        expect(screen.getByText('+20')).toBeTruthy();
    });

    it('should render the challenges button', () => {
        render(<ExercisesScreen />);
        expect(screen.getByTestId('challenges-button')).toBeTruthy();
    });

    it('should navigate to Challenges when challenges button pressed', () => {
        render(<ExercisesScreen />);
        fireEvent.press(screen.getByTestId('challenges-button'));
        expect(mockNavigate).toHaveBeenCalledWith('Challenges');
    });

    it('should navigate to ExerciseDetail when exercise card pressed', () => {
        render(<ExercisesScreen />);
        const exerciseCards = screen.getAllByTestId('exercise-card');
        fireEvent.press(exerciseCards[0]);
        expect(mockNavigate).toHaveBeenCalledWith('ExerciseDetail', { exerciseId: 'ex1' });
    });

    it('should display exercise descriptions', () => {
        render(<ExercisesScreen />);
        expect(screen.getByText('Lett oppvarming med fotball.')).toBeTruthy();
        expect(screen.getByText('Bygg styrke i beina.')).toBeTruthy();
    });

    it('should display duration for exercises', () => {
        render(<ExercisesScreen />);
        // Multiple exercises may show "2 minutter" (ex1: 120s, ex3: 150s rounds to 2m)
        expect(screen.getAllByText('2 minutter').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText('3 minutter')).toBeTruthy();
    });
});
