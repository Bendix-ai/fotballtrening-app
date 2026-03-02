import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { NotificationsScreen } from '../NotificationsScreen';

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

// Notification mocks
const mockRequestPermissions = jest.fn().mockResolvedValue(true);
const mockScheduleDailyReminder = jest.fn().mockResolvedValue(undefined);
const mockCancelDailyReminder = jest.fn().mockResolvedValue(undefined);
const mockScheduleStreakWarning = jest.fn().mockResolvedValue(undefined);
const mockCancelStreakWarning = jest.fn().mockResolvedValue(undefined);

jest.mock('../../../lib/notifications', () => ({
    requestPermissions: (...args: any[]) => mockRequestPermissions(...args),
    scheduleDailyReminder: (...args: any[]) => mockScheduleDailyReminder(...args),
    cancelDailyReminder: (...args: any[]) => mockCancelDailyReminder(...args),
    scheduleStreakWarning: (...args: any[]) => mockScheduleStreakWarning(...args),
    cancelStreakWarning: (...args: any[]) => mockCancelStreakWarning(...args),
}));

// Store mocks
let mockNotificationPrefs = {
    dailyReminder: true,
    newExercises: true,
    leaderboardUpdates: false,
    streakReminder: true,
    emailNotifications: true,
    pushNotifications: true,
};
const mockSetNotificationPref = jest.fn();

jest.mock('../../../stores', () => ({
    useAppStore: () => ({
        notificationPrefs: mockNotificationPrefs,
        setNotificationPref: mockSetNotificationPref,
    }),
}));

// Component mocks
const mockShowToast = jest.fn();
jest.mock('../../../components', () => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return {
        Card: ({ children, style, testID }: any) =>
            React.createElement(View, { style, testID }, children),
        useToast: () => ({ showToast: mockShowToast }),
    };
});

describe('NotificationsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockNotificationPrefs = {
            dailyReminder: true,
            newExercises: true,
            leaderboardUpdates: false,
            streakReminder: true,
            emailNotifications: true,
            pushNotifications: true,
        };
    });

    it('should render notification settings title', () => {
        render(<NotificationsScreen />);
        expect(screen.getByText('Varsler')).toBeTruthy();
    });

    it('should render all toggle options', () => {
        render(<NotificationsScreen />);
        expect(screen.getByText('Daglig påminnelse')).toBeTruthy();
        expect(screen.getByText('Nye øvelser')).toBeTruthy();
        expect(screen.getByText('Toppliste-oppdateringer')).toBeTruthy();
        expect(screen.getByText('Streak-påminnelse')).toBeTruthy();
    });

    it('should call scheduleDailyReminder when toggling daily reminder ON', async () => {
        mockNotificationPrefs = {
            ...mockNotificationPrefs,
            dailyReminder: false,
        };
        render(<NotificationsScreen />);

        const switches = screen.getAllByRole('switch');
        // First switch is daily reminder
        fireEvent(switches[0], 'valueChange', true);

        await waitFor(() => {
            expect(mockRequestPermissions).toHaveBeenCalled();
            expect(mockScheduleDailyReminder).toHaveBeenCalled();
            expect(mockSetNotificationPref).toHaveBeenCalledWith('dailyReminder', true);
        });
    });

    it('should call cancelDailyReminder when toggling daily reminder OFF', async () => {
        render(<NotificationsScreen />);

        const switches = screen.getAllByRole('switch');
        // First switch is daily reminder (currently ON)
        fireEvent(switches[0], 'valueChange', false);

        await waitFor(() => {
            expect(mockCancelDailyReminder).toHaveBeenCalled();
            expect(mockSetNotificationPref).toHaveBeenCalledWith('dailyReminder', false);
        });
    });

    it('should call scheduleStreakWarning when toggling streak reminder ON', async () => {
        mockNotificationPrefs = {
            ...mockNotificationPrefs,
            streakReminder: false,
        };
        render(<NotificationsScreen />);

        const switches = screen.getAllByRole('switch');
        // Fourth switch is streak reminder
        fireEvent(switches[3], 'valueChange', true);

        await waitFor(() => {
            expect(mockRequestPermissions).toHaveBeenCalled();
            expect(mockScheduleStreakWarning).toHaveBeenCalled();
            expect(mockSetNotificationPref).toHaveBeenCalledWith('streakReminder', true);
        });
    });

    it('should request permissions on mount when notifications enabled', async () => {
        render(<NotificationsScreen />);

        await waitFor(() => {
            expect(mockRequestPermissions).toHaveBeenCalled();
        });
    });
});
