import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ExerciseDetailScreen } from '../ExerciseDetailScreen';

// Navigation mocks
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockPush = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
        replace: jest.fn(),
        push: mockPush,
        dispatch: jest.fn(),
    }),
    useRoute: () => ({
        params: { exerciseId: 'ex1' },
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
}));

const mockExercise = {
    id: 'ex1',
    title: 'Oppvarming med ball',
    description: 'Lett oppvarming med fotball for a fa kroppen i gang.',
    instructions: 'Start med lett jogging mens du dribler ballen. Varier mellom hoyrefot og venstrefot. Hold overkroppen rett.',
    image_url: null,
    video_url: null,
    duration_seconds: 120,
    difficulty: 'easy' as const,
    category: 'warmup' as const,
    points: 10,
    is_public: true,
    created_by_club_id: null,
    equipment: 'Fotball',
    assigned_team_ids: null,
    created_at: '2024-01-01',
};

const mockRelatedExercise = {
    id: 'ex2',
    title: 'Oppvarming uten ball',
    description: 'Jogging uten ball.',
    instructions: 'Jog rundt banen.',
    image_url: null,
    video_url: null,
    duration_seconds: 90,
    difficulty: 'easy' as const,
    category: 'warmup' as const,
    points: 8,
    is_public: true,
    created_by_club_id: null,
    equipment: '',
    assigned_team_ids: null,
    created_at: '2024-01-01',
};

const mockToggleMutate = jest.fn();

jest.mock('../../../hooks/useExercises', () => ({
    useExercise: (id: string) => ({
        data: id === 'ex1' ? mockExercise : null,
    }),
    useExercises: () => ({
        data: [mockExercise, mockRelatedExercise],
    }),
    useFavorites: () => ({
        data: [],
    }),
    useToggleFavorite: () => ({
        mutate: mockToggleMutate,
    }),
}));

jest.mock('../../../lib/exerciseUtils', () => ({
    getCategoryIcon: jest.fn().mockReturnValue('directions-run'),
    getCategoryColor: jest.fn().mockReturnValue('#FF9800'),
}));

jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        Card: ({ children, style }: any) => React.createElement(View, { style }, children),
        Badge: ({ label }: any) => React.createElement(Text, null, label),
        Button: ({ title, onPress, testID }: any) =>
            React.createElement(
                TouchableOpacity,
                { onPress, testID },
                React.createElement(Text, null, title)
            ),
    };
});

describe('ExerciseDetailScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the exercise title', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByText('Oppvarming med ball')).toBeTruthy();
    });

    it('should render the exercise description', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByText('Lett oppvarming med fotball for a fa kroppen i gang.')).toBeTruthy();
    });

    it('should render exercise duration', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByText('2 minutter')).toBeTruthy();
    });

    it('should render exercise points', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByText('+10 poeng')).toBeTruthy();
    });

    it('should render difficulty badge', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByText('Lett')).toBeTruthy();
    });

    it('should render equipment info', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByText(/Fotball/)).toBeTruthy();
    });

    it('should render instructions section', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByText('Instruksjoner')).toBeTruthy();
    });

    it('should render start button', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByTestId('exercise-start-button')).toBeTruthy();
        expect(screen.getByText('Start øvelse')).toBeTruthy();
    });

    it('should navigate to ExerciseExecution when start button pressed', () => {
        render(<ExerciseDetailScreen />);
        fireEvent.press(screen.getByTestId('exercise-start-button'));
        expect(mockNavigate).toHaveBeenCalledWith('ExerciseExecution', { exerciseId: 'ex1' });
    });

    it('should render favorite button', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByTestId('exercise-favorite-button')).toBeTruthy();
    });

    it('should call toggleFavorite when favorite button pressed', () => {
        render(<ExerciseDetailScreen />);
        fireEvent.press(screen.getByTestId('exercise-favorite-button'));
        expect(mockToggleMutate).toHaveBeenCalledWith({
            exerciseId: 'ex1',
            isFavorite: false,
        });
    });

    it('should render challenge friend button', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByTestId('challenge-friend-button')).toBeTruthy();
    });

    it('should navigate to CreateChallenge when challenge button pressed', () => {
        render(<ExerciseDetailScreen />);
        fireEvent.press(screen.getByTestId('challenge-friend-button'));
        expect(mockNavigate).toHaveBeenCalledWith('CreateChallenge', { exerciseId: 'ex1' });
    });

    it('should render related exercises section', () => {
        render(<ExerciseDetailScreen />);
        expect(screen.getByText('Lignende øvelser')).toBeTruthy();
        expect(screen.getByText('Oppvarming uten ball')).toBeTruthy();
    });

    it('should go back when back button pressed', () => {
        render(<ExerciseDetailScreen />);
        const backButton = screen.getByLabelText('Tilbake');
        fireEvent.press(backButton);
        expect(mockGoBack).toHaveBeenCalled();
    });
});

describe('ExerciseDetailScreen - exercise not found', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render error text when exercise is not found', () => {
        // Override the mock for this specific test
        const useExerciseModule = require('../../../hooks/useExercises');
        const original = useExerciseModule.useExercise;
        useExerciseModule.useExercise = () => ({ data: null });

        render(<ExerciseDetailScreen />);
        expect(screen.getByText('Øvelse ikke funnet')).toBeTruthy();

        useExerciseModule.useExercise = original;
    });
});
