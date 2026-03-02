import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react-native';
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

import { LevelUpModal } from '../LevelUpModal';

// Mock the sounds module
jest.mock('../../lib/sounds', () => ({
    playSound: jest.fn(),
}));

// Mock the i18n module
jest.mock('../../lib/i18n', () => ({
    t: jest.fn((key: string, params?: Record<string, string>) => {
        const translations: Record<string, string> = {
            'home.levelUp': 'Nivå opp!',
            'home.nowLevel': `Du er nå nivå ${params?.level ?? ''}!`,
        };
        return translations[key] ?? key;
    }),
}));

describe('LevelUpModal', () => {
    const defaultProps = {
        visible: true,
        level: 4,
        tierName: 'silver',
        tierColor: '#C0C0C0',
        onDismiss: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        cleanup();
        jest.clearAllTimers();
        jest.useRealTimers();
    });

    it('should render when visible=true', () => {
        render(<LevelUpModal {...defaultProps} />);
        expect(screen.getByText('Nivå opp!')).toBeTruthy();
        expect(screen.getByText('Du er nå nivå 4!')).toBeTruthy();
        expect(screen.getByText('SILVER')).toBeTruthy();
    });

    it('should not render when visible=false', () => {
        render(<LevelUpModal {...defaultProps} visible={false} />);
        expect(screen.queryByText('Nivå opp!')).toBeNull();
    });

    it('should call onDismiss after timeout', () => {
        render(<LevelUpModal {...defaultProps} />);
        expect(defaultProps.onDismiss).not.toHaveBeenCalled();

        act(() => {
            jest.advanceTimersByTime(4000);
        });

        expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
    });

    it('should display level and tier information', () => {
        render(
            <LevelUpModal
                {...defaultProps}
                level={7}
                tierName="gold"
                tierColor="#FFD700"
            />
        );
        expect(screen.getByText('Du er nå nivå 7!')).toBeTruthy();
        expect(screen.getByText('GOLD')).toBeTruthy();
    });

    it('should call playSound with levelup when visible', () => {
        const { playSound } = require('../../lib/sounds');
        render(<LevelUpModal {...defaultProps} />);
        expect(playSound).toHaveBeenCalledWith('levelup');
    });

    it('should call Haptics.notificationAsync when visible', () => {
        const Haptics = require('expo-haptics');
        render(<LevelUpModal {...defaultProps} />);
        expect(Haptics.notificationAsync).toHaveBeenCalledWith(
            Haptics.NotificationFeedbackType.Success
        );
    });

    it('should call onDismiss when tapping overlay', () => {
        render(<LevelUpModal {...defaultProps} />);
        fireEvent.press(screen.getByTestId('level-up-dismiss'));
        expect(defaultProps.onDismiss).toHaveBeenCalledTimes(1);
    });
});
