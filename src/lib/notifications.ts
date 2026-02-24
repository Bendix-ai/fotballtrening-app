import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
        console.warn('Push notifications require a physical device');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
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

export async function scheduleDailyReminder(hour: number = 17, minute: number = 0) {
    // Cancel existing daily reminders first
    await cancelDailyReminder();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Tid for trening!',
            body: 'Ikke glem å trene i dag. Fortsett streaken din!',
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
        },
    });
}

export async function cancelDailyReminder() {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
}

export async function scheduleStreakReminder() {
    // Remind at 20:00 if they haven't trained
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Streaken din er i fare!',
            body: 'Tren litt i dag for å holde streaken gående.',
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 20,
            minute: 0,
        },
    });
}

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
