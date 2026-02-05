import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, StreakCard, Button } from '../../components';
import { useAuthStore, useAppStore } from '../../stores';

// Mock profile data
const mockProfile = {
    totalPoints: 390,
    exercisesCompleted: 30,
    currentStreak: 5,
    longestStreak: 12,
    achievements: [
        { type: 'first_exercise', unlocked: true },
        { type: 'streak_7', unlocked: true },
        { type: 'points_100', unlocked: true },
        { type: 'exercises_10', unlocked: true },
        { type: 'streak_30', unlocked: false },
        { type: 'points_500', unlocked: false },
    ],
};

export function ProfileScreen() {
    const { colors, isDark } = useTheme();
    const { user, logout } = useAuthStore();
    const { themeMode, setThemeMode } = useAppStore();

    const displayName = user?.display_name || 'Spiller';

    const handleLogout = () => {
        logout();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('profile.title')}
                    </Text>
                </View>

                {/* Profile Card */}
                <Card style={styles.profileCard}>
                    <View style={styles.profileContent}>
                        <View
                            style={[styles.avatar, { backgroundColor: colors.primary }]}
                        >
                            <Text style={styles.avatarText}>
                                {displayName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text style={[styles.name, { color: colors.text }]}>
                            {displayName}
                        </Text>
                        <Text style={[styles.club, { color: colors.textSecondary }]}>
                            Våganes IL • Gutter 2015
                        </Text>
                    </View>
                </Card>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>
                            {mockProfile.totalPoints}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            {t('profile.totalPoints')}
                        </Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.accent }]}>
                            {mockProfile.exercisesCompleted}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            {t('profile.exercisesCompleted')}
                        </Text>
                    </Card>
                </View>

                {/* Streak Card */}
                <View style={styles.section}>
                    <StreakCard
                        currentStreak={mockProfile.currentStreak}
                        longestStreak={mockProfile.longestStreak}
                    />
                </View>

                {/* Achievements Preview */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('profile.achievements')}
                        </Text>
                        <TouchableOpacity>
                            <Text style={[styles.viewAll, { color: colors.primary }]}>
                                {t('profile.viewAll')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.achievementsGrid}>
                        {mockProfile.achievements.map((achievement, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.achievementBadge,
                                    {
                                        backgroundColor: achievement.unlocked
                                            ? colors.primaryLight
                                            : colors.surface,
                                        borderColor: achievement.unlocked
                                            ? colors.primary
                                            : colors.border,
                                        opacity: achievement.unlocked ? 1 : 0.5,
                                    },
                                ]}
                            >
                                <Text style={styles.achievementIcon}>
                                    {achievement.unlocked ? '⭐' : '🔒'}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('settings.title')}
                    </Text>

                    <Card style={styles.settingsCard}>
                        {/* Theme Setting */}
                        <View style={styles.settingRow}>
                            <Text style={[styles.settingLabel, { color: colors.text }]}>
                                {t('settings.theme')}
                            </Text>
                            <View style={styles.themeButtons}>
                                {(['light', 'dark', 'system'] as const).map((mode) => (
                                    <TouchableOpacity
                                        key={mode}
                                        onPress={() => setThemeMode(mode)}
                                        style={[
                                            styles.themeButton,
                                            {
                                                backgroundColor: themeMode === mode
                                                    ? colors.primary
                                                    : colors.surface,
                                                borderColor: themeMode === mode
                                                    ? colors.primary
                                                    : colors.border,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.themeButtonText,
                                                {
                                                    color: themeMode === mode
                                                        ? '#ffffff'
                                                        : colors.textSecondary,
                                                },
                                            ]}
                                        >
                                            {t(`settings.${mode}`)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Logout Button */}
                <View style={styles.section}>
                    <Button
                        title={t('settings.logout')}
                        onPress={handleLogout}
                        variant="outline"
                        fullWidth
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
    },
    profileCard: {
        marginBottom: 20,
    },
    profileContent: {
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#ffffff',
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
    },
    club: {
        fontSize: 14,
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    achievementBadge: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    achievementIcon: {
        fontSize: 24,
    },
    settingsCard: {
        padding: 0,
    },
    settingRow: {
        padding: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    themeButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    themeButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
    },
    themeButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
