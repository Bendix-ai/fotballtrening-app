import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Switch,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, useToast } from '../../components';
import { useAppStore } from '../../stores';
import {
    requestPermissions,
    scheduleDailyReminder,
    cancelDailyReminder,
    scheduleStreakWarning,
    cancelStreakWarning,
} from '../../lib/notifications';

export function NotificationsScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { showToast } = useToast();
    const { notificationPrefs, setNotificationPref } = useAppStore();

    // Request permissions on mount if any notification is enabled
    useEffect(() => {
        async function checkPermissions() {
            if (notificationPrefs.dailyReminder || notificationPrefs.streakReminder) {
                await requestPermissions();
            }
        }
        checkPermissions();
    }, []);

    const handleToggleDailyReminder = async (v: boolean) => {
        if (v) {
            const granted = await requestPermissions();
            if (!granted) {
                showToast(t('notifications.permissionDenied'), 'error');
                return;
            }
            await scheduleDailyReminder();
        } else {
            await cancelDailyReminder();
        }
        setNotificationPref('dailyReminder', v);
    };

    const handleToggleStreakReminder = async (v: boolean) => {
        if (v) {
            const granted = await requestPermissions();
            if (!granted) {
                showToast(t('notifications.permissionDenied'), 'error');
                return;
            }
            await scheduleStreakWarning();
        } else {
            await cancelStreakWarning();
        }
        setNotificationPref('streakReminder', v);
    };

    const notificationItems = [
        {
            label: t('notifications.dailyReminder'),
            description: t('notifications.dailyReminderDesc'),
            value: notificationPrefs.dailyReminder,
            onToggle: handleToggleDailyReminder,
        },
        {
            label: t('notifications.newExercises'),
            description: t('notifications.newExercisesDesc'),
            value: notificationPrefs.newExercises,
            onToggle: (v: boolean) => setNotificationPref('newExercises', v),
        },
        {
            label: t('notifications.leaderboard'),
            description: t('notifications.leaderboardDesc'),
            value: notificationPrefs.leaderboardUpdates,
            onToggle: (v: boolean) => setNotificationPref('leaderboardUpdates', v),
        },
        {
            label: t('notifications.streakReminder'),
            description: t('notifications.streakReminderDesc'),
            value: notificationPrefs.streakReminder,
            onToggle: handleToggleStreakReminder,
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('settings.notifications')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <Card style={styles.card}>
                    {notificationItems.map((item, index) => (
                        <View
                            key={index}
                            style={[
                                styles.row,
                                index < notificationItems.length - 1 && {
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.border,
                                },
                            ]}
                        >
                            <View style={styles.rowText}>
                                <Text style={[styles.label, { color: colors.text }]}>
                                    {item.label}
                                </Text>
                                <Text style={[styles.description, { color: colors.textSecondary }]}>
                                    {item.description}
                                </Text>
                            </View>
                            <Switch
                                value={item.value}
                                onValueChange={item.onToggle}
                                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                thumbColor={item.value ? colors.primary : colors.textTertiary}
                            />
                        </View>
                    ))}
                </Card>

                <Text style={[styles.note, { color: colors.textTertiary }]}>
                    {t('notifications.note')}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    card: {
        marginHorizontal: 20,
        padding: 0,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    rowText: {
        flex: 1,
        marginRight: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    description: {
        fontSize: 13,
        marginTop: 4,
    },
    note: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 32,
    },
});
