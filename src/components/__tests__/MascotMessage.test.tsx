import React from 'react';
import { Animated } from 'react-native';

// Disable native driver for all Animated operations in tests
const originalTiming = Animated.timing;

beforeAll(() => {
    (Animated as any).timing = (value: any, config: any) =>
        originalTiming(value, { ...config, useNativeDriver: false });
});

afterAll(() => {
    (Animated as any).timing = originalTiming;
});

import { render, fireEvent, screen } from '@testing-library/react-native';
import { MascotMessage } from '../MascotMessage';

describe('MascotMessage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render message text', () => {
        render(<MascotMessage message="Bra jobbet!" state="cheering" />);
        expect(screen.getByText('Bra jobbet!')).toBeTruthy();
    });

    it('should render with default testID', () => {
        render(<MascotMessage message="Hei" state="happy" />);
        expect(screen.getByTestId('mascot-message')).toBeTruthy();
    });

    it('should render with custom testID', () => {
        render(<MascotMessage message="Hei" state="happy" testID="custom-mascot" />);
        expect(screen.getByTestId('custom-mascot')).toBeTruthy();
    });

    it('should render Mascot with correct state', () => {
        render(<MascotMessage message="Test" state="impressed" />);
        expect(screen.getByTestId('mascot')).toBeTruthy();
    });

    it('should show dismiss button when onDismiss provided', () => {
        const onDismiss = jest.fn();
        render(
            <MascotMessage message="Test" state="happy" onDismiss={onDismiss} />
        );
        expect(screen.getByTestId('mascot-message-dismiss')).toBeTruthy();
    });

    it('should not show dismiss button when onDismiss not provided', () => {
        render(<MascotMessage message="Test" state="happy" />);
        expect(screen.queryByTestId('mascot-message-dismiss')).toBeNull();
    });

    it('should call onDismiss when dismiss button pressed', () => {
        const onDismiss = jest.fn();
        render(
            <MascotMessage message="Test" state="happy" onDismiss={onDismiss} />
        );
        fireEvent.press(screen.getByTestId('mascot-message-dismiss'));
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should have slide-in animation with correct config', () => {
        const timingSpy = jest.spyOn(Animated, 'timing');
        render(<MascotMessage message="Test" state="happy" />);

        // Animated.timing is called with (animatedValue, config)
        // The wrapper overrides useNativeDriver, but the spy captures original args
        expect(timingSpy).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            })
        );
        timingSpy.mockRestore();
    });

    it('should render message text in the speech bubble', () => {
        render(<MascotMessage message="God morgen!" state="happy" />);
        expect(screen.getByTestId('mascot-message-text')).toBeTruthy();
        expect(screen.getByText('God morgen!')).toBeTruthy();
    });
});
