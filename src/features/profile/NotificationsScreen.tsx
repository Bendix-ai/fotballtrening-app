import React, { useState } from 'react';
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
import { Card } from '../../components';

export function NotificationsScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [dailyReminder, setDailyReminder] = useState(true);
    const [newExercises, setNewExercises] = useState(true);
    const [leaderboardUpdates, setLeaderboardUpdates] = useState(false);
    const [streakReminder, setStreakReminder] = useState(true);

    const notificationItems = [
        {
            label: t('notifications.dailyReminder'),
            description: t('notifications.dailyReminderDesc'),
            value: dailyReminder,
            onToggle: setDailyReminder,
        },
        {
            label: t('notifications.newExercises'),
            description: t('notifications.newExercisesDesc'),
            value: newExercises,
            onToggle: setNewExercises,
        },
        {
            label: t('notifications.leaderboard'),
            description: t('notifications.leaderboardDesc'),
            value: leaderboardUpdates,
            onToggle: setLeaderboardUpdates,
        },
        {
            label: t('notifications.streakReminder'),
            description: t('notifications.streakReminderDesc'),
            value: streakReminder,
            onToggle: setStreakReminder,
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
