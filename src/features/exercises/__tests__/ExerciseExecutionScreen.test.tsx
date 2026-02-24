import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { ExerciseExecutionScreen } from '../ExerciseExecutionScreen';

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

// Navigation mocks
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
        replace: mockReplace,
        push: jest.fn(),
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
    description: 'Lett oppvarming.',
    instructions: 'Start med lett jogging. Varier mellom hoyrefot og venstrefot.',
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
};

jest.mock('../../../hooks/useExercises', () => ({
    useExercise: () => ({
        data: mockExercise,
    }),
}));

jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        ProgressBar: ({ progress }: any) =>
            React.createElement(View, { testID: 'progress-bar' },
                React.createElement(Text, null, `${Math.round(progress * 100)}%`)
            ),
        Button: ({ title, onPress, testID, variant }: any) =>
            React.createElement(
                TouchableOpacity,
                { onPress, testID },
                React.createElement(Text, null, title)
            ),
        ConfirmationDialog: ({ visible, title, message, onConfirm, onCancel }: any) =>
            visible
                ? React.createElement(View, { testID: 'exit-dialog' },
                    React.createElement(Text, null, title),
                    React.createElement(Text, null, message),
                    React.createElement(TouchableOpacity, { onPress: onConfirm, testID: 'confirm-exit' },
                        React.createElement(Text, null, 'Avslutt')
                    ),
                    React.createElement(TouchableOpacity, { onPress: onCancel, testID: 'cancel-exit' },
                        React.createElement(Text, null, 'Avbryt')
                    ),
                )
                : null,
    };
});

describe('ExerciseExecutionScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        // Clear all pending timers and intervals before restoring real timers
        act(() => {
            jest.runOnlyPendingTimers();
        });
        jest.useRealTimers();
    });

    it('should render the exercise title', () => {
        render(<ExerciseExecutionScreen />);
        expect(screen.getByText('Oppvarming med ball')).toBeTruthy();
    });

    it('should render the timer', () => {
        render(<ExerciseExecutionScreen />);
        expect(screen.getByTestId('exercise-timer')).toBeTruthy();
    });

    it('should render the progress bar', () => {
        render(<ExerciseExecutionScreen />);
        expect(screen.getByTestId('progress-bar')).toBeTruthy();
    });

    it('should display remaining time initially', () => {
        render(<ExerciseExecutionScreen />);
        expect(screen.getByText('02:00')).toBeTruthy();
    });

    it('should render pause button initially', () => {
        render(<ExerciseExecutionScreen />);
        expect(screen.getByText('Pause')).toBeTruthy();
    });

    it('should switch to resume when paused', () => {
        render(<ExerciseExecutionScreen />);
        fireEvent.press(screen.getByText('Pause'));
        expect(screen.getByText('Fortsett')).toBeTruthy();
    });

    it('should show paused label when paused', () => {
        render(<ExerciseExecutionScreen />);
        fireEvent.press(screen.getByText('Pause'));
        expect(screen.getByText('Pauset')).toBeTruthy();
    });

    it('should switch back to pause when resumed', () => {
        render(<ExerciseExecutionScreen />);
        fireEvent.press(screen.getByText('Pause'));
        expect(screen.getByText('Fortsett')).toBeTruthy();
        fireEvent.press(screen.getByText('Fortsett'));
        expect(screen.getByText('Pause')).toBeTruthy();
    });

    it('should show exit dialog when close button pressed', () => {
        render(<ExerciseExecutionScreen />);
        const closeIcon = screen.getByText('close');
        fireEvent.press(closeIcon);
        expect(screen.getByTestId('exit-dialog')).toBeTruthy();
    });

    it('should go back when exit is confirmed', () => {
        render(<ExerciseExecutionScreen />);
        const closeIcon = screen.getByText('close');
        fireEvent.press(closeIcon);
        fireEvent.press(screen.getByTestId('confirm-exit'));
        expect(mockGoBack).toHaveBeenCalled();
    });

    it('should dismiss exit dialog when cancel is pressed', () => {
        render(<ExerciseExecutionScreen />);
        const closeIcon = screen.getByText('close');
        fireEvent.press(closeIcon);
        expect(screen.getByTestId('exit-dialog')).toBeTruthy();
        fireEvent.press(screen.getByTestId('cancel-exit'));
        expect(screen.queryByTestId('exit-dialog')).toBeNull();
    });

    it('should display elapsed and remaining time', () => {
        render(<ExerciseExecutionScreen />);
        expect(screen.getByText('00:00')).toBeTruthy();
        expect(screen.getByText('-02:00')).toBeTruthy();
    });

    it('should update timer as time passes', () => {
        render(<ExerciseExecutionScreen />);
        act(() => {
            jest.advanceTimersByTime(5000);
        });
        expect(screen.getByText('00:05')).toBeTruthy();
    });

    it('should show complete button when timer finishes', () => {
        render(<ExerciseExecutionScreen />);
        act(() => {
            jest.advanceTimersByTime(121000);
        });
        expect(screen.getByTestId('exercise-complete-button')).toBeTruthy();
        expect(screen.getByText('Fullfør')).toBeTruthy();
    });

    it('should navigate to ExerciseComplete when complete button pressed', () => {
        render(<ExerciseExecutionScreen />);
        act(() => {
            jest.advanceTimersByTime(121000);
        });
        fireEvent.press(screen.getByTestId('exercise-complete-button'));
        expect(mockReplace).toHaveBeenCalledWith('ExerciseComplete', {
            exerciseId: 'ex1',
            pointsEarned: 10,
        });
    });

    it('should render current instruction step', () => {
        render(<ExerciseExecutionScreen />);
        expect(screen.getByText(/Start med lett jogging/)).toBeTruthy();
    });
});
