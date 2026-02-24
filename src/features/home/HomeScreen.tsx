import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, StreakCard, ProgressBar } from '../../components';
import { useAuthStore, useAppStore } from '../../stores';
import { MainTabParamList, RootStackParamList } from '../../types';
import { useExercises, useTodayCompletions } from '../../hooks/useExercises';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useActivePlan } from '../../hooks/useTrainingPlans';
import { useActivityFeed } from '../../hooks/useActivityFeed';
import { ActivityFeedItem } from '../../types';
import { getCategoryIcon, getCategoryColor } from '../../lib/exerciseUtils';
import { getLevelInfo, getPointsToNextLevel } from '../../lib/levelUtils';

type HomeNavProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
>;

function getActivityIcon(type: ActivityFeedItem['type']): string {
    switch (type) {
        case 'exercise_completed': return 'fitness-center';
        case 'achievement_unlocked': return 'military-tech';
        case 'streak_milestone': return 'local-fire-department';
    }
}

function getActivityIconColor(type: ActivityFeedItem['type'], colors: { primary: string; accent: string; warning?: string }): string {
    switch (type) {
        case 'exercise_completed': return colors.primary;
        case 'achievement_unlocked': return colors.accent;
        case 'streak_milestone': return '#FF6B35';
    }
}

function getActivityDescription(item: ActivityFeedItem): string {
    switch (item.type) {
        case 'exercise_completed':
            return t('home.completedExercise', { name: item.display_name, exercise: item.title });
        case 'achievement_unlocked':
            return t('home.unlockedAchievement', { name: item.display_name, achievement: item.title });
        case 'streak_milestone':
            return t('home.reachedStreak', { name: item.display_name, days: item.title });
    }
}

function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) return 'Nå';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}t`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

export function HomeScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<HomeNavProp>();
    const { user } = useAuthStore();
    const { dailyGoal } = useAppStore();

    const { data: exercises = [], isLoading: exercisesLoading, refetch: refetchExercises } = useExercises();
    const { data: todayCompletions = [], refetch: refetchToday } = useTodayCompletions();
    const { data: leaderboardData = [] } = useLeaderboard('club');
    const { data: announcements = [] } = useAnnouncements();
    const { data: activityFeed = [], refetch: refetchActivity } = useActivityFeed();
    const { data: activePlanData, refetch: refetchPlan } = useActivePlan();

    const onRefresh = useCallback(() => {
        refetchExercises();
        refetchToday();
        refetchActivity();
        refetchPlan();
    }, [refetchExercises, refetchToday, refetchActivity, refetchPlan]);

    const displayName = user?.display_name || 'Spiller';
    const todayExercises = todayCompletions.length;
    const todayPoints = useMemo(
        () => todayCompletions.reduce((sum, c) => sum + c.points_earned, 0),
        [todayCompletions]
    );

    // Deterministic daily challenge based on date
    const dailyChallenge = useMemo(() => {
        if (exercises.length === 0) return null;
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        return exercises[dayOfYear % exercises.length];
    }, [exercises]);

    const myRank = useMemo(() => {
        const entry = leaderboardData.find((e) => e.is_current_user);
        return entry?.rank ?? null;
    }, [leaderboardData]);

    // Show the 3 most recent exercises as suggestions
    const suggestedExercises = useMemo(() => exercises.slice(0, 3), [exercises]);

    // Latest 2 announcements for the home feed
    const latestAnnouncements = useMemo(() => announcements.slice(0, 2), [announcements]);

    // Latest 5 activity feed items
    const latestActivity = useMemo(() => activityFeed.slice(0, 5), [activityFeed]);

    // Today's planned exercises from the training plan
    const todayPlanExercises = useMemo(() => {
        if (!activePlanData?.days || exercises.length === 0) return [];
        const jsDay = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const planDay = jsDay === 0 ? 6 : jsDay - 1; // Convert to 0=Mon, 6=Sun
        const todayPlan = activePlanData.days.find((d) => d.day_of_week === planDay);
        if (!todayPlan) return [];
        const exerciseMap: Record<string, typeof exercises[0]> = {};
        for (const ex of exercises) exerciseMap[ex.id] = ex;
        return todayPlan.exercise_ids
            .map((id) => exerciseMap[id])
            .filter(Boolean);
    }, [activePlanData, exercises]);

    if (exercisesLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                            {t('home.greeting')},
                        </Text>
                        <Text style={[styles.name, { color: colors.text }]}>
                            {displayName}!
                        </Text>
                    </View>
                </View>

                {/* Today's Progress */}
                <Card style={styles.progressCard}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('home.todayProgress')}
                    </Text>
                    <View style={styles.progressRow}>
                        <View style={styles.progressItem} accessibilityLabel={`${todayExercises} ${t('home.exercises')}`}>
                            <Text style={[styles.progressValue, { color: colors.primary }]}>
                                {todayExercises}
                            </Text>
                            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                                {t('home.exercises')}
                            </Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} accessibilityElementsHidden />
                        <View style={styles.progressItem} accessibilityLabel={`${todayPoints} ${t('home.points')}`}>
                            <Text style={[styles.progressValue, { color: colors.accent }]}>
                                {todayPoints}
                            </Text>
                            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                                {t('home.points')}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Announcements */}
                {latestAnnouncements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('home.announcements')}
                        </Text>
                        {latestAnnouncements.map((announcement) => {
                            const date = new Date(announcement.created_at);
                            const now = new Date();
                            const diffMs = now.getTime() - date.getTime();
                            const diffHours = Math.floor(diffMs / 3600000);
                            const diffDays = Math.floor(diffMs / 86400000);
                            let relativeDate: string;
                            if (diffHours < 1) relativeDate = 'Nå';
                            else if (diffHours < 24) relativeDate = `${diffHours}t`;
                            else if (diffDays < 7) relativeDate = `${diffDays}d`;
                            else relativeDate = date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });

                            return (
                                <Card key={announcement.id} style={styles.announcementCard}>
                                    <View style={styles.announcementRow}>
                                        <View style={[styles.announcementIcon, { backgroundColor: colors.primary + '18' }]}>
                                            <MaterialIcons name="campaign" size={20} color={colors.primary} />
                                        </View>
                                        <View style={styles.announcementContent}>
                                            <View style={styles.announcementTitleRow}>
                                                <Text style={[styles.announcementTitle, { color: colors.text }]} numberOfLines={1}>
                                                    {announcement.title}
                                                </Text>
                                                <Text style={[styles.announcementDate, { color: colors.textTertiary }]}>
                                                    {relativeDate}
                                                </Text>
                                            </View>
                                            <Text style={[styles.announcementMessage, { color: colors.textSecondary }]} numberOfLines={2}>
                                                {announcement.message}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            );
                        })}
                    </View>
                )}

                {/* Team Activity Feed */}
                {latestActivity.length > 0 && (
                    <View style={styles.section} testID="activity-feed-section">
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('home.teamActivity')}
                        </Text>
                        {latestActivity.map((item) => {
                            const iconName = getActivityIcon(item.type);
                            const iconColor = getActivityIconColor(item.type, colors);
                            const description = getActivityDescription(item);
                            const relativeTime = getRelativeTime(item.created_at);
                            const initial = item.display_name.charAt(0).toUpperCase();

                            return (
                                <Card key={item.id} style={styles.activityCard} testID="activity-feed-item">
                                    <View style={styles.activityRow}>
                                        <View style={[styles.activityAvatar, { backgroundColor: iconColor + '18' }]}>
                                            <Text style={[styles.activityAvatarText, { color: iconColor }]}>
                                                {initial}
                                            </Text>
                                        </View>
                                        <View style={styles.activityContent}>
                                            <Text style={[styles.activityText, { color: colors.text }]} numberOfLines={2}>
                                                {description}
                                            </Text>
                                            <View style={styles.activityMeta}>
                                                <MaterialIcons name={iconName as any} size={14} color={iconColor} />
                                                <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
                                                    {relativeTime}
                                                </Text>
                                            </View>
                                        </View>
                                        {item.points != null && item.points > 0 && (
                                            <View style={[styles.activityPoints, { backgroundColor: colors.accent + '18' }]}>
                                                <Text style={[styles.activityPointsText, { color: colors.accent }]}>
                                                    +{item.points}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </Card>
                            );
                        })}
                    </View>
                )}

                {/* Today's Training Plan */}
                {todayPlanExercises.length > 0 && (
                    <View style={styles.section} testID="todays-plan-section">
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('admin.todaysPlan')}
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.planScrollContent}
                        >
                            {todayPlanExercises.map((exercise) => (
                                <TouchableOpacity
                                    key={exercise.id}
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate('ExercisesTab')}
                                    testID={`plan-exercise-${exercise.id}`}
                                >
                                    <Card style={styles.planExerciseCard}>
                                        <View style={[styles.planExerciseIcon, { backgroundColor: getCategoryColor(exercise.category) + '18' }]}>
                                            <MaterialIcons
                                                name={getCategoryIcon(exercise.category)}
                                                size={24}
                                                color={getCategoryColor(exercise.category)}
                                            />
                                        </View>
                                        <Text style={[styles.planExerciseTitle, { color: colors.text }]} numberOfLines={2}>
                                            {exercise.title}
                                        </Text>
                                        <Text style={[styles.planExerciseMeta, { color: colors.textSecondary }]}>
                                            +{exercise.points} {t('exercises.points')}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Daily Goal */}
                <Card style={styles.dailyGoalCard}>
                    <View style={styles.dailyGoalHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>
                            {t('home.dailyGoal')}
                        </Text>
                        <Text style={[styles.dailyGoalCount, { color: todayExercises >= dailyGoal ? colors.success : colors.primary }]}>
                            {todayExercises}/{dailyGoal}
                        </Text>
                    </View>
                    <View style={styles.dailyGoalBarContainer}>
                        <ProgressBar progress={Math.min(todayExercises / dailyGoal, 1)} />
                    </View>
                    <Text style={[styles.dailyGoalText, { color: todayExercises >= dailyGoal ? colors.success : colors.textSecondary }]}>
                        {todayExercises >= dailyGoal
                            ? t('home.dailyGoalComplete')
                            : t('home.dailyGoalProgress', { current: String(todayExercises), target: String(dailyGoal) })
                        }
                    </Text>
                </Card>

                {/* Leaderboard Rank */}
                {myRank !== null && (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('Leaderboard')}
                    >
                        <Card style={styles.rankCard}>
                            <View style={styles.rankRow}>
                                <View style={[styles.rankBadge, { backgroundColor: colors.accent + '18' }]}>
                                    <MaterialIcons name="leaderboard" size={24} color={colors.accent} />
                                </View>
                                <View style={styles.rankInfo}>
                                    <Text style={[styles.rankText, { color: colors.text }]}>
                                        {t('home.yourRank', { rank: String(myRank) })}
                                    </Text>
                                    <Text style={[styles.rankSubtext, { color: colors.textSecondary }]}>
                                        {t('leaderboard.club')}
                                    </Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}

                {/* Level Card */}
                {(() => {
                    const levelInfo = getLevelInfo(user?.total_points ?? 0);
                    const pointsNeeded = getPointsToNextLevel(user?.total_points ?? 0);
                    return (
                        <Card style={styles.levelCard}>
                            <View style={styles.levelRow}>
                                <View style={[styles.levelIconContainer, { backgroundColor: levelInfo.tierColor + '20' }]}>
                                    <MaterialIcons name={levelInfo.tierIcon as any} size={24} color={levelInfo.tierColor} />
                                </View>
                                <View style={styles.levelInfo}>
                                    <Text style={[styles.levelTitle, { color: colors.text }]}>
                                        {t('home.level', { level: String(levelInfo.level) })}
                                    </Text>
                                    <Text style={[styles.levelSubtext, { color: colors.textSecondary }]}>
                                        {levelInfo.level >= 10
                                            ? t('home.maxLevel')
                                            : t('home.pointsToNextLevel', { points: String(pointsNeeded) })
                                        }
                                    </Text>
                                </View>
                            </View>
                            {levelInfo.level < 10 && (
                                <View style={styles.levelProgressContainer}>
                                    <ProgressBar progress={levelInfo.progressToNext} color={levelInfo.tierColor} />
                                </View>
                            )}
                        </Card>
                    );
                })()}

                {/* Streak Card */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('home.currentStreak')}
                    </Text>
                    <StreakCard
                        currentStreak={user?.current_streak ?? 0}
                        longestStreak={user?.longest_streak ?? 0}
                    />
                </View>

                {/* Today's Challenge */}
                {dailyChallenge && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('home.todayChallenge')}
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('ExercisesTab')}
                            accessibilityRole="button"
                            accessibilityLabel={`${t('home.todayChallenge')}: ${dailyChallenge.title}, +${dailyChallenge.points} ${t('home.points')}`}
                        >
                            <Card style={styles.challengeCard}>
                                <View style={styles.challengeRow}>
                                    <View style={[styles.challengeIcon, { backgroundColor: colors.primaryLight }]}>
                                        <MaterialIcons name="emoji-events" size={28} color={colors.primary} />
                                    </View>
                                    <View style={styles.challengeInfo}>
                                        <Text style={[styles.challengeTitle, { color: colors.text }]}>
                                            {dailyChallenge.title}
                                        </Text>
                                        <Text style={[styles.challengeDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                                            {dailyChallenge.description}
                                        </Text>
                                    </View>
                                    <View style={[styles.challengePoints, { backgroundColor: colors.accent + '20' }]}>
                                        <Text style={[styles.challengePointsText, { color: colors.accent }]}>
                                            +{dailyChallenge.points}
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Quick Start */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('home.quickStart')}
                    </Text>
                    <Button
                        title={t('home.startTraining')}
                        onPress={() => navigation.navigate('ExercisesTab')}
                        fullWidth
                        size="large"
                    />
                </View>

                {/* Recent Exercises */}
                {suggestedExercises.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                {t('home.recentExercises')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ExercisesTab')}
                                accessibilityRole="link"
                                accessibilityLabel={t('home.viewAll')}
                            >
                                <Text style={[styles.viewAll, { color: colors.primary }]}>
                                    {t('home.viewAll')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {suggestedExercises.map((exercise) => (
                            <Card key={exercise.id} style={styles.exerciseCard}>
                                <View style={styles.exerciseRow}>
                                    <View style={[styles.exerciseCategoryIcon, { backgroundColor: getCategoryColor(exercise.category) + '18' }]}>
                                        <MaterialIcons name={getCategoryIcon(exercise.category)} size={20} color={getCategoryColor(exercise.category)} />
                                    </View>
                                    <View style={styles.exerciseTextContainer}>
                                        <Text style={[styles.exerciseTitle, { color: colors.text }]}>
                                            {exercise.title}
                                        </Text>
                                        <Text style={[styles.exerciseCategory, { color: colors.textSecondary }]}>
                                            {t(`exercises.${exercise.category}`)}
                                        </Text>
                                    </View>
                                    <View style={[styles.pointsBadge, { backgroundColor: colors.primaryLight }]}>
                                        <Text style={[styles.pointsText, { color: colors.primary }]}>
                                            +{exercise.points}
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 24,
    },
    greeting: {
        fontSize: 16,
    },
    name: {
        fontSize: 28,
        fontWeight: '700',
    },
    progressCard: {
        marginBottom: 20,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    progressItem: {
        flex: 1,
        alignItems: 'center',
    },
    progressValue: {
        fontSize: 32,
        fontWeight: '700',
    },
    progressLabel: {
        fontSize: 14,
        marginTop: 4,
    },
    divider: {
        width: 1,
        height: 50,
    },
    dailyGoalCard: {
        marginBottom: 20,
    },
    dailyGoalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dailyGoalCount: {
        fontSize: 18,
        fontWeight: '700',
    },
    dailyGoalBarContainer: {
        marginBottom: 8,
    },
    dailyGoalText: {
        fontSize: 13,
    },
    rankCard: {
        marginBottom: 20,
    },
    rankRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankBadge: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankInfo: {
        flex: 1,
        marginLeft: 12,
    },
    rankText: {
        fontSize: 16,
        fontWeight: '600',
    },
    rankSubtext: {
        fontSize: 13,
        marginTop: 2,
    },
    levelCard: {
        marginBottom: 20,
    },
    levelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelInfo: {
        flex: 1,
        marginLeft: 12,
    },
    levelTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    levelSubtext: {
        fontSize: 13,
        marginTop: 2,
    },
    levelProgressContainer: {
        marginTop: 10,
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
    viewAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    challengeCard: {
        marginBottom: 0,
    },
    challengeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    challengeIcon: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    challengeInfo: {
        flex: 1,
        marginLeft: 12,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    challengeDesc: {
        fontSize: 13,
        marginTop: 2,
    },
    challengePoints: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 8,
    },
    challengePointsText: {
        fontSize: 14,
        fontWeight: '700',
    },
    exerciseCard: {
        marginBottom: 12,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    exerciseCategoryIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    exerciseTextContainer: {
        flex: 1,
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    exerciseCategory: {
        fontSize: 13,
        marginTop: 2,
    },
    pointsBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pointsText: {
        fontSize: 14,
        fontWeight: '700',
    },
    announcementCard: {
        marginBottom: 12,
    },
    announcementRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    announcementIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    announcementContent: {
        flex: 1,
        marginLeft: 12,
    },
    announcementTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    announcementTitle: {
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    announcementDate: {
        fontSize: 12,
    },
    announcementMessage: {
        fontSize: 13,
        lineHeight: 18,
    },
    activityCard: {
        marginBottom: 10,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityAvatarText: {
        fontSize: 15,
        fontWeight: '700',
    },
    activityContent: {
        flex: 1,
        marginLeft: 12,
    },
    activityText: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 19,
    },
    activityMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        gap: 4,
    },
    activityTime: {
        fontSize: 12,
    },
    activityPoints: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
        marginLeft: 8,
    },
    activityPointsText: {
        fontSize: 13,
        fontWeight: '700',
    },
    planScrollContent: {
        paddingRight: 20,
        gap: 12,
    },
    planExerciseCard: {
        width: 130,
        marginBottom: 0,
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
    },
    planExerciseIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    planExerciseTitle: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    planExerciseMeta: {
        fontSize: 12,
        textAlign: 'center',
    },
});
