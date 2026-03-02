import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {
    requestPermissions,
    registerForPushNotifications,
    scheduleDailyReminder,
    cancelDailyReminder,
    scheduleStreakWarning,
    cancelStreakWarning,
    cancelAllNotifications,
    scheduleStreakReminder,
} from '../notifications';

// Access the mocked functions
const mockGetPermissions = Notifications.getPermissionsAsync as jest.Mock;
const mockRequestPermissions = Notifications.requestPermissionsAsync as jest.Mock;
const mockSchedule = Notifications.scheduleNotificationAsync as jest.Mock;
const mockCancelScheduled = Notifications.cancelScheduledNotificationAsync as jest.Mock;
const mockCancelAll = (Notifications as Record<string, unknown>).cancelAllScheduledNotificationsAsync as jest.Mock;
const mockGetToken = Notifications.getExpoPushTokenAsync as jest.Mock;
describe('notifications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetPermissions.mockResolvedValue({ status: 'granted' });
        mockRequestPermissions.mockResolvedValue({ status: 'granted' });
        mockGetToken.mockResolvedValue({ data: 'mock-push-token' });
        mockSchedule.mockResolvedValue('mock-notification-id');
        mockCancelScheduled.mockResolvedValue(undefined);
        mockCancelAll.mockResolvedValue(undefined);
    });

    describe('requestPermissions', () => {
        it('should return true when permissions are already granted', async () => {
            mockGetPermissions.mockResolvedValue({ status: 'granted' });
            const result = await requestPermissions();
            expect(result).toBe(true);
            expect(mockRequestPermissions).not.toHaveBeenCalled();
        });

        it('should request permissions when not yet granted', async () => {
            mockGetPermissions.mockResolvedValue({ status: 'undetermined' });
            mockRequestPermissions.mockResolvedValue({ status: 'granted' });
            const result = await requestPermissions();
            expect(result).toBe(true);
            expect(mockRequestPermissions).toHaveBeenCalled();
        });

        it('should return false when permissions are denied', async () => {
            mockGetPermissions.mockResolvedValue({ status: 'undetermined' });
            mockRequestPermissions.mockResolvedValue({ status: 'denied' });
            const result = await requestPermissions();
            expect(result).toBe(false);
        });

        it('should return false on non-device (simulator)', async () => {
            // Override the Device mock for this test
            const originalIsDevice = Device.isDevice;
            Object.defineProperty(Device, 'isDevice', { value: false, writable: true });
            const result = await requestPermissions();
            expect(result).toBe(false);
            Object.defineProperty(Device, 'isDevice', { value: originalIsDevice, writable: true });
        });
    });

    describe('registerForPushNotifications', () => {
        it('should return push token when permissions granted', async () => {
            const token = await registerForPushNotifications();
            expect(token).toBe('mock-push-token');
            expect(mockGetToken).toHaveBeenCalled();
        });

        it('should return null when permissions denied', async () => {
            mockGetPermissions.mockResolvedValue({ status: 'undetermined' });
            mockRequestPermissions.mockResolvedValue({ status: 'denied' });
            const token = await registerForPushNotifications();
            expect(token).toBeNull();
            expect(mockGetToken).not.toHaveBeenCalled();
        });
    });

    describe('scheduleDailyReminder', () => {
        it('should schedule daily reminder at 16:00 by default', async () => {
            await scheduleDailyReminder();
            expect(mockSchedule).toHaveBeenCalledWith(
                expect.objectContaining({
                    identifier: 'daily-reminder',
                    trigger: expect.objectContaining({
                        hour: 16,
                        minute: 0,
                    }),
                })
            );
        });

        it('should schedule at custom hour and minute', async () => {
            await scheduleDailyReminder(18, 30);
            expect(mockSchedule).toHaveBeenCalledWith(
                expect.objectContaining({
                    trigger: expect.objectContaining({
                        hour: 18,
                        minute: 30,
                    }),
                })
            );
        });

        it('should cancel existing daily reminder before scheduling', async () => {
            await scheduleDailyReminder();
            expect(mockCancelScheduled).toHaveBeenCalledWith('daily-reminder');
            // cancelScheduled is called before schedule
            const cancelOrder = mockCancelScheduled.mock.invocationCallOrder[0];
            const scheduleOrder = mockSchedule.mock.invocationCallOrder[0];
            expect(cancelOrder).toBeLessThan(scheduleOrder);
        });

        it('should use daily trigger type', async () => {
            await scheduleDailyReminder();
            expect(mockSchedule).toHaveBeenCalledWith(
                expect.objectContaining({
                    trigger: expect.objectContaining({
                        type: Notifications.SchedulableTriggerInputTypes.DAILY,
                    }),
                })
            );
        });
    });

    describe('cancelDailyReminder', () => {
        it('should cancel the daily-reminder notification', async () => {
            await cancelDailyReminder();
            expect(mockCancelScheduled).toHaveBeenCalledWith('daily-reminder');
        });

        it('should not throw if notification does not exist', async () => {
            mockCancelScheduled.mockRejectedValue(new Error('not found'));
            await expect(cancelDailyReminder()).resolves.not.toThrow();
        });
    });

    describe('scheduleStreakWarning', () => {
        it('should schedule streak warning at 20:00', async () => {
            await scheduleStreakWarning();
            expect(mockSchedule).toHaveBeenCalledWith(
                expect.objectContaining({
                    identifier: 'streak-warning',
                    trigger: expect.objectContaining({
                        hour: 20,
                        minute: 0,
                    }),
                })
            );
        });

        it('should cancel existing streak warning before scheduling', async () => {
            await scheduleStreakWarning();
            expect(mockCancelScheduled).toHaveBeenCalledWith('streak-warning');
        });
    });

    describe('cancelStreakWarning', () => {
        it('should cancel the streak-warning notification', async () => {
            await cancelStreakWarning();
            expect(mockCancelScheduled).toHaveBeenCalledWith('streak-warning');
        });

        it('should not throw if notification does not exist', async () => {
            mockCancelScheduled.mockRejectedValue(new Error('not found'));
            await expect(cancelStreakWarning()).resolves.not.toThrow();
        });
    });

    describe('cancelAllNotifications', () => {
        it('should cancel all scheduled notifications', async () => {
            await cancelAllNotifications();
            expect(mockCancelAll).toHaveBeenCalled();
        });
    });

    describe('scheduleStreakReminder (backward compat alias)', () => {
        it('should be the same function as scheduleStreakWarning', () => {
            expect(scheduleStreakReminder).toBe(scheduleStreakWarning);
        });
    });
});
