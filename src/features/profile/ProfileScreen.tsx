import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, StreakCard } from '../../components';
import { useAuthStore, useExerciseStore } from '../../stores';
import { ProfileStackParamList, AchievementDefinition } from '../../types';
import { mockAchievements, mockExercises, achievementDefinitions } from '../../data/mockData';
import { AchievementDetailModal } from './AchievementDetailModal';

type ProfileNavProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

export function ProfileScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<ProfileNavProp>();
    const { user } = useAuthStore();
    const { completions, totalPoints } = useExerciseStore();

    const [selectedAchievement, setSelectedAchievement] = useState<AchievementDefinition | null>(null);
    const [selectedUnlocked, setSelectedUnlocked] = useState(false);
    const [showAchievementModal, setShowAchievementModal] = useState(false);

    const displayName = user?.display_name || 'Spiller';

    // Get recent completions for activity history
    const recentCompletions = [...completions]
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
        .slice(0, 5);

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
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <MaterialIcons name="settings" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
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
                            {user?.club_id ? 'Våganes IL' : ''}
                        </Text>
                    </View>
                </Card>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>
                            {totalPoints + (user?.total_points ?? 0)}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            {t('profile.totalPoints')}
                        </Text>
                    </Card>

                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.accent }]}>
                            {completions.length}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            {t('profile.exercisesCompleted')}
                        </Text>
                    </Card>
                </View>

                {/* Streak Card */}
                <View style={styles.section}>
                    <StreakCard
                        currentStreak={user?.current_streak ?? 0}
                        longestStreak={user?.longest_streak ?? 0}
                    />
                </View>

                {/* Activity History */}
                {recentCompletions.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Aktivitetshistorikk
                        </Text>
                        {recentCompletions.map((completion) => {
                            const exercise = mockExercises.find((e) => e.id === completion.exercise_id);
                            return (
                                <Card key={completion.id} style={styles.activityCard}>
                                    <View style={styles.activityRow}>
                                        <View style={[styles.activityIcon, { backgroundColor: colors.primaryLight }]}>
                                            <MaterialIcons name="check-circle" size={20} color={colors.success} />
                                        </View>
                                        <View style={styles.activityInfo}>
                                            <Text style={[styles.activityTitle, { color: colors.text }]}>
                                                {exercise?.title ?? 'Øvelse'}
                                            </Text>
                                            <Text style={[styles.activityDate, { color: colors.textTertiary }]}>
                                                {new Date(completion.completed_at).toLocaleDateString('nb-NO')}
                                            </Text>
                                        </View>
                                        <Text style={[styles.activityPoints, { color: colors.primary }]}>
                                            +{completion.points_earned}
                                        </Text>
                                    </View>
                                </Card>
                            );
                        })}
                    </View>
                )}

                {/* Achievements Preview */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('profile.achievements')}
                        </Text>
                    </View>

                    <View style={styles.achievementsGrid}>
                        {mockAchievements.map((achievement, index) => {
                            const definition = achievementDefinitions[achievement.type];
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setSelectedAchievement(definition);
                                        setSelectedUnlocked(achievement.unlocked);
                                        setShowAchievementModal(true);
                                    }}
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
                                    <MaterialIcons
                                        name={achievement.unlocked ? (definition?.icon as any ?? 'star') : 'lock'}
                                        size={24}
                                        color={achievement.unlocked ? colors.secondary : colors.textTertiary}
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <AchievementDetailModal
                visible={showAchievementModal}
                achievement={selectedAchievement}
                unlocked={selectedUnlocked}
                onClose={() => setShowAchievementModal(false)}
            />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        marginBottom: 12,
    },
    // Activity history
    activityCard: {
        marginBottom: 8,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityInfo: {
        flex: 1,
        marginLeft: 12,
    },
    activityTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    activityDate: {
        fontSize: 12,
        marginTop: 2,
    },
    activityPoints: {
        fontSize: 16,
        fontWeight: '700',
    },
    // Achievements
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
});
