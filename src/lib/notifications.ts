import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { t } from './i18n';

// Notification identifiers for cancellation
const DAILY_REMINDER_ID = 'daily-reminder';
const STREAK_WARNING_ID = 'streak-warning';

/**
 * Request notification permissions from the user.
 * Returns true if granted, false otherwise.
 */
export async function requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
        console.warn('Push notifications require a physical device');
        return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
        return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

/**
 * Register for push notifications and get the Expo push token.
 * Sets up Android notification channel if needed.
 */
export async function registerForPushNotifications(): Promise<string | null> {
    const granted = await requestPermissions();

    if (!granted) {
        return null;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
        });
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
}

/**
 * Schedule a daily training reminder at 16:00.
 * "Tid for trening! Apne appen og tren i dag"
 */
export async function scheduleDailyReminder(hour: number = 16, minute: number = 0) {
    // Cancel existing daily reminder first
    await cancelDailyReminder();

    await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_ID,
        content: {
            title: t('notifications.dailyReminderTitle'),
            body: t('notifications.dailyReminderBody'),
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
        },
    });
}

/**
 * Cancel only the daily reminder notification.
 */
export async function cancelDailyReminder() {
    try {
        await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
    } catch {
        // Notification may not exist yet, that's ok
    }
}

/**
 * Schedule a streak warning at 20:00.
 * "Streaken din er i fare! Gjor en ovelse for midnatt"
 */
export async function scheduleStreakWarning() {
    // Cancel existing streak warning first
    await cancelStreakWarning();

    await Notifications.scheduleNotificationAsync({
        identifier: STREAK_WARNING_ID,
        content: {
            title: t('notifications.streakReminderTitle'),
            body: t('notifications.streakReminderBody'),
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 20,
            minute: 0,
        },
    });
}

/**
 * Cancel only the streak warning notification.
 */
export async function cancelStreakWarning() {
    try {
        await Notifications.cancelScheduledNotificationAsync(STREAK_WARNING_ID);
    } catch {
        // Notification may not exist yet, that's ok
    }
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Keep backward compatibility alias.
 * @deprecated Use scheduleStreakWarning() instead.
 */
export const scheduleStreakReminder = scheduleStreakWarning;

export function addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
) {
    return Notifications.addNotificationReceivedListener(listener);
}

export function addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
) {
    return Notifications.addNotificationResponseReceivedListener(listener);
}
