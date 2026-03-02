import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { OnboardingScreen } from '../OnboardingScreen';

// Navigation mocks
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        goBack: mockGoBack,
        navigate: jest.fn(),
        replace: jest.fn(),
        push: jest.fn(),
        dispatch: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
}));

// Store mocks
const mockSetOnboardingComplete = jest.fn();
jest.mock('../../../stores', () => ({
    useAppStore: () => ({
        setOnboardingComplete: mockSetOnboardingComplete,
    }),
}));

// Component mocks
jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text, TouchableOpacity } = require('react-native');
    return {
        Button: ({ title, onPress, testID }: any) =>
            React.createElement(
                TouchableOpacity,
                { onPress, testID },
                React.createElement(Text, null, title),
            ),
        Mascot: ({ state, size }: any) =>
            React.createElement(
                View,
                { testID: 'mascot' },
                React.createElement(Text, null, state),
            ),
    };
});

describe('OnboardingScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render first onboarding page', () => {
        render(<OnboardingScreen />);
        expect(screen.getByText('Velkommen til FotballTrening!')).toBeTruthy();
    });

    it('should show skip button', () => {
        render(<OnboardingScreen />);
        expect(screen.getByTestId('onboarding-skip-button')).toBeTruthy();
        expect(screen.getByText('Hopp over')).toBeTruthy();
    });

    it('should show Mascot component', () => {
        render(<OnboardingScreen />);
        expect(screen.getAllByTestId('mascot').length).toBeGreaterThanOrEqual(1);
    });

    it('should call setOnboardingComplete when skip button pressed', () => {
        render(<OnboardingScreen />);
        fireEvent.press(screen.getByTestId('onboarding-skip-button'));
        expect(mockSetOnboardingComplete).toHaveBeenCalledWith(true);
    });

    it('should render action button with "Neste" text', () => {
        render(<OnboardingScreen />);
        expect(screen.getByTestId('onboarding-action-button')).toBeTruthy();
        expect(screen.getByText('Neste')).toBeTruthy();
    });
});
