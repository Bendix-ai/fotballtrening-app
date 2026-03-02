import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, ProgressBar, MascotMessage } from '../../components';
import { useAuthStore, useAppStore } from '../../stores';
import { MainTabParamList, RootStackParamList } from '../../types';
import { useExercises, useTodayCompletions } from '../../hooks/useExercises';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useActivePlan } from '../../hooks/useTrainingPlans';
import { useActivityFeed, useFriendActivityFeed } from '../../hooks/useActivityFeed';
import { useActiveChallenges } from '../../hooks/useChallenges';
import { useFriends } from '../../hooks/useFriends';
import { useSendHighFive } from '../../hooks/useHighFives';
import { ActivityFeedItem } from '../../types';
import { getCategoryIcon, getCategoryColor } from '../../lib/exerciseUtils';
import { getLevelInfo } from '../../lib/levelUtils';
import { playSound } from '../../lib/sounds';
import { useMascotMessage } from '../../hooks/useMascotMessage';
import { useDailyChallenge } from '../../hooks/useDailyChallenge';

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

    if (diffMinutes < 1) return 'N\u00e5';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}t`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

export function HomeScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<HomeNavProp>();
    const { user } = useAuthStore();
    const { dailyGoal, lastLoginBonusDate, awardLoginBonus } = useAppStore();

    const { data: exercises = [], isLoading: exercisesLoading, refetch: refetchExercises } = useExercises();
    const { data: todayCompletions = [], refetch: refetchToday } = useTodayCompletions();
    const { data: leaderboardData = [] } = useLeaderboard('club');
    const { data: announcements = [] } = useAnnouncements();
    const { data: activityFeed = [], refetch: refetchActivity } = useActivityFeed();
    const { data: friendActivityFeed = [], refetch: refetchFriendActivity } = useFriendActivityFeed();
    const { data: activePlanData, refetch: refetchPlan } = useActivePlan();
    const { data: activeChallenges = [] } = useActiveChallenges();
    const { data: friends = [] } = useFriends();
    const sendHighFive = useSendHighFive();

    const [activityTab, setActivityTab] = useState<'team' | 'friends'>('team');
    const [highFivedIds, setHighFivedIds] = useState<Set<string>>(new Set());
    const [showMascot, setShowMascot] = useState(true);
    const { message: mascotMessage, state: mascotState } = useMascotMessage();

    const hasFriends = friends.length > 0;

    const handleHighFive = useCallback((toUserId: string, activityId: string) => {
        if (highFivedIds.has(activityId)) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setHighFivedIds((prev) => new Set(prev).add(activityId));
        sendHighFive.mutate({ toUserId, activityId });
    }, [highFivedIds, sendHighFive]);

    const onRefresh = useCallback(() => {
        refetchExercises();
        refetchToday();
        refetchActivity();
        refetchFriendActivity();
        refetchPlan();
    }, [refetchExercises, refetchToday, refetchActivity, refetchFriendActivity, refetchPlan]);

    const displayName = user?.display_name || 'Spiller';
    const todayExercises = todayCompletions.length;

    // Daily challenge from shared hook (no longer duplicated)
    const { dailyChallenge } = useDailyChallenge();

    const myRank = useMemo(() => {
        const entry = leaderboardData.find((e) => e.is_current_user);
        return entry?.rank ?? null;
    }, [leaderboardData]);

    // Show the 3 most recent exercises as suggestions
    const suggestedExercises = useMemo(() => exercises.slice(0, 3), [exercises]);

    // Latest 2 announcements for the home feed
    const latestAnnouncements = useMemo(() => announcements.slice(0, 2), [announcements]);

    // Latest 3 activity feed items (reduced from 5)
    const latestActivity = useMemo(() => activityFeed.slice(0, 3), [activityFeed]);

    // Latest 3 friend activity feed items
    const latestFriendActivity = useMemo(() => friendActivityFeed.slice(0, 3), [friendActivityFeed]);

    // Active feed based on selected tab
    const displayedActivity = activityTab === 'friends' ? latestFriendActivity : latestActivity;

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

    // Level info for status stripe
    const levelInfo = useMemo(() => getLevelInfo(user?.total_points ?? 0), [user?.total_points]);

    // Day 1 welcome flow: detect new users with 0 points and no completions today
    const isNewUser = (user?.total_points === 0) && todayCompletions.length === 0;

    // Countdown timer for daily challenge (time remaining until midnight)
    const [timeRemaining, setTimeRemaining] = useState(() => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diffMs = midnight.getTime() - now.getTime();
        return {
            hours: Math.floor(diffMs / 3600000),
            minutes: Math.floor((diffMs % 3600000) / 60000),
        };
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const diffMs = midnight.getTime() - now.getTime();
            setTimeRemaining({
                hours: Math.floor(diffMs / 3600000),
                minutes: Math.floor((diffMs % 3600000) / 60000),
            });
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Login bonus
    const [showLoginBonus, setShowLoginBonus] = useState(false);
    const loginBonusOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        if (lastLoginBonusDate === today) return;

        awardLoginBonus();
        setShowLoginBonus(true);
        playSound('coin');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        Animated.sequence([
            Animated.timing(loginBonusOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(3000),
            Animated.timing(loginBonusOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setShowLoginBonus(false));
    }, []);

    if (exercisesLoading) {
        return (
            <SafeAreaView testID="home-screen" style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView testID="home-screen" style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* 1. Greeting (kept as-is) */}
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

                {/* Mascot Message */}
                {showMascot && (
                    <MascotMessage
                        message={mascotMessage}
                        state={mascotState}
                        onDismiss={() => setShowMascot(false)}
                        testID="home-mascot-message"
                    />
                )}

                {/* Login Bonus Toast */}
                {showLoginBonus && (
                    <Animated.View
                        style={[styles.loginBonusToast, { backgroundColor: colors.accent, opacity: loginBonusOpacity }]}
                        testID="login-bonus-toast"
                    >
                        <MaterialIcons name="stars" size={22} color="#FFFFFF" />
                        <View style={styles.loginBonusTextContainer}>
                            <Text style={styles.loginBonusTitle}>{t('home.loginBonus')}</Text>
                            <Text style={styles.loginBonusPoints}>{t('home.loginBonusPoints', { points: '5' })}</Text>
                        </View>
                    </Animated.View>
                )}

                {isNewUser ? (
                    /* Day 1 Welcome Card — shown instead of status stripe + CTA for new users */
                    <Card style={styles.welcomeCard} testID="home-welcome-card">
                        <View style={styles.welcomeContent}>
                            <View style={[styles.welcomeIconCircle, { backgroundColor: colors.primary + '18' }]}>
                                <MaterialIcons name="sports-soccer" size={40} color={colors.primary} />
                            </View>
                            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                                {t('home.welcomeNewUser')}
                            </Text>
                            <Text style={[styles.welcomeTip, { color: colors.textSecondary }]}>
                                {t('home.newUserTip')}
                            </Text>
                            <TouchableOpacity
                                style={[styles.welcomeButton, { backgroundColor: colors.primary }]}
                                activeOpacity={0.85}
                                onPress={() => navigation.navigate('ExercisesTab')}
                                testID="home-first-exercise-button"
                                accessibilityRole="button"
                            >
                                <MaterialIcons name="play-arrow" size={22} color="#FFFFFF" />
                                <Text style={styles.welcomeButtonText}>
                                    {t('home.firstExercise')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                ) : (
                    <>
                        {/* 2. Compact Status Stripe */}
                        <Card style={styles.statusStripe} testID="home-status-stripe">
                            <View style={styles.statusRow}>
                                <View style={styles.statusItem}>
                                    <MaterialIcons name="local-fire-department" size={20} color="#FF6B35" />
                                    <Text style={[styles.statusValue, { color: colors.text }]}>
                                        {user?.current_streak ?? 0}d
                                    </Text>
                                </View>
                                <View style={[styles.statusDivider, { backgroundColor: colors.border }]} />
                                <View style={styles.statusItem}>
                                    <MaterialIcons name={levelInfo.tierIcon as any} size={20} color={levelInfo.tierColor} />
                                    <Text style={[styles.statusValue, { color: colors.text }]}>
                                        {t('home.level', { level: String(levelInfo.level) })}
                                    </Text>
                                </View>
                                <View style={[styles.statusDivider, { backgroundColor: colors.border }]} />
                                <View style={styles.statusItem}>
                                    <MaterialIcons name="leaderboard" size={20} color={colors.accent} />
                                    <Text style={[styles.statusValue, { color: colors.text }]}>
                                        {myRank !== null ? `#${myRank}` : '—'}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* 3. "Dagens trening" CTA Card */}
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('ExercisesTab')}
                            testID="home-cta-card"
                            accessibilityRole="button"
                        >
                            <View style={[styles.ctaCard, { backgroundColor: colors.primary }]}>
                                <View style={[styles.ctaAccentCircle, { backgroundColor: colors.primaryLight, opacity: 0.15 }]} />
                                <View style={styles.ctaContent}>
                                    <View style={styles.ctaIconContainer}>
                                        <MaterialIcons name="emoji-events" size={40} color="#FFFFFF" />
                                    </View>
                                    <Text style={styles.ctaTitle}>
                                        {t('home.todayTraining')}
                                    </Text>
                                    {dailyChallenge && (
                                        <>
                                            <View style={styles.ctaChallengeRow}>
                                                <Text style={styles.ctaChallengeTitle} numberOfLines={1}>
                                                    {dailyChallenge.title}
                                                </Text>
                                                <View style={styles.ctaDoublePointsBadge} testID="home-double-points-badge">
                                                    <Text style={styles.ctaDoublePointsText}>{t('home.doublePoints').toUpperCase()}</Text>
                                                </View>
                                                <View style={styles.ctaPointsBadge}>
                                                    <Text style={styles.ctaPointsText}>+{dailyChallenge.points * 2}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.ctaCountdownText} testID="home-challenge-countdown">
                                                {t('home.hoursRemaining', {
                                                    hours: String(timeRemaining.hours),
                                                    minutes: String(timeRemaining.minutes),
                                                })}
                                            </Text>
                                        </>
                                    )}
                                    {exercises.length > 0 && (
                                        <Text style={styles.ctaSubtext}>
                                            {t('home.exercisesAvailable', { count: String(exercises.length) })}
                                        </Text>
                                    )}
                                    <View style={styles.ctaButton} testID="home-cta-button">
                                        <Text style={[styles.ctaButtonText, { color: colors.primary }]}>
                                            {t('home.startDailyPlan')}
                                        </Text>
                                        <MaterialIcons name="arrow-forward" size={20} color={colors.primary} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </>
                )}

                {/* 4. Daily Goal — compact bar */}
                <View style={styles.dailyGoalCompact}>
                    <View style={styles.dailyGoalLabelRow}>
                        <Text style={[styles.dailyGoalLabel, { color: todayExercises >= dailyGoal ? colors.success : colors.textSecondary }]}>
                            {t('home.dailyGoal')}
                        </Text>
                        <Text style={[styles.dailyGoalCount, { color: todayExercises >= dailyGoal ? colors.success : colors.primary }]}>
                            {todayExercises}/{dailyGoal}
                        </Text>
                    </View>
                    <ProgressBar progress={Math.min(todayExercises / dailyGoal, 1)} />
                </View>

                {/* 4b. Active Challenges Card */}
                {activeChallenges.length > 0 && (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => (navigation as any).navigate('ExercisesTab', { screen: 'Challenges' })}
                        testID="home-active-challenges-card"
                        accessibilityRole="button"
                    >
                        <Card style={styles.challengesCard}>
                            <View style={styles.challengesRow}>
                                <View style={[styles.challengesIcon, { backgroundColor: colors.secondary + '18' }]}>
                                    <MaterialIcons name="sports-kabaddi" size={24} color={colors.secondary} />
                                </View>
                                <View style={styles.challengesContent}>
                                    <Text style={[styles.challengesTitle, { color: colors.text }]}>
                                        {t('home.activeChallenges')}
                                    </Text>
                                    <Text style={[styles.challengesCount, { color: colors.textSecondary }]}>
                                        {t('home.activeChallengesCount', { count: String(activeChallenges.length) })}
                                    </Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />
                            </View>
                        </Card>
                    </TouchableOpacity>
                )}

                {/* 5. Activity Feed — with Team/Friends toggle + high five */}
                {(latestActivity.length > 0 || latestFriendActivity.length > 0) && (
                    <View style={styles.section} testID="activity-feed-section">
                        <View style={styles.sectionHeader}>
                            {hasFriends ? (
                                <View style={styles.activityTabRow}>
                                    <TouchableOpacity
                                        onPress={() => setActivityTab('team')}
                                        style={[
                                            styles.activityTab,
                                            activityTab === 'team' && { backgroundColor: colors.primary + '18' },
                                        ]}
                                        testID="activity-tab-team"
                                    >
                                        <Text style={[
                                            styles.activityTabText,
                                            { color: activityTab === 'team' ? colors.primary : colors.textSecondary },
                                        ]}>
                                            {t('home.teamActivity')}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setActivityTab('friends')}
                                        style={[
                                            styles.activityTab,
                                            activityTab === 'friends' && { backgroundColor: colors.primary + '18' },
                                        ]}
                                        testID="activity-tab-friends"
                                    >
                                        <Text style={[
                                            styles.activityTabText,
                                            { color: activityTab === 'friends' ? colors.primary : colors.textSecondary },
                                        ]}>
                                            {t('home.friendActivity')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                    {t('home.teamActivity')}
                                </Text>
                            )}
                            {activityFeed.length > 3 && activityTab === 'team' && (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Leaderboard')}
                                    accessibilityRole="link"
                                >
                                    <Text style={[styles.seeMoreLink, { color: colors.primary }]}>
                                        {t('home.seeMore')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {displayedActivity.map((item) => {
                            const iconName = getActivityIcon(item.type);
                            const iconColor = getActivityIconColor(item.type, colors);
                            const description = getActivityDescription(item);
                            const relativeTime = getRelativeTime(item.created_at);
                            const initial = item.display_name.charAt(0).toUpperCase();
                            const isHighFived = highFivedIds.has(item.id);

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
                                        {activityTab === 'friends' && item.user_id !== user?.id && (
                                            <TouchableOpacity
                                                onPress={() => handleHighFive(item.user_id, item.id)}
                                                style={[
                                                    styles.highFiveButton,
                                                    { backgroundColor: isHighFived ? colors.success + '18' : colors.secondary + '18' },
                                                ]}
                                                testID="activity-highfive-button"
                                                accessibilityLabel={t('home.highFive')}
                                                disabled={isHighFived}
                                            >
                                                <Text style={styles.highFiveEmoji}>
                                                    {isHighFived ? '\u2705' : '\uD83D\uDC4B'}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {activityTab === 'team' && item.points != null && item.points > 0 && (
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

                {/* 6. Announcements (kept as-is) */}
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
                            if (diffHours < 1) relativeDate = 'N\u00e5';
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

                {/* 7. Training Plan (moved below activity feed) */}
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

                {/* 8. Recent Exercises (moved to bottom) */}
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
        marginBottom: 16,
    },
    greeting: {
        fontSize: 16,
    },
    name: {
        fontSize: 28,
        fontWeight: '700',
    },

    // Welcome Card (Day 1)
    welcomeCard: {
        marginBottom: 16,
    },
    welcomeContent: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    welcomeIconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    welcomeTip: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 21,
        marginBottom: 20,
    },
    welcomeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 28,
        gap: 8,
    },
    welcomeButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Status Stripe
    statusStripe: {
        marginBottom: 16,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusValue: {
        fontSize: 15,
        fontWeight: '700',
    },
    statusDivider: {
        width: 1,
        height: 24,
    },

    // CTA Card
    ctaCard: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 12,
        minHeight: 220,
        justifyContent: 'center',
    },
    ctaAccentCircle: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 160,
        height: 160,
        borderRadius: 80,
    },
    ctaContent: {
        padding: 24,
        alignItems: 'center',
    },
    ctaIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    ctaTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    ctaChallengeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    ctaChallengeTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        flexShrink: 1,
    },
    ctaPointsBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    ctaPointsText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    ctaDoublePointsBadge: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 12,
    },
    ctaDoublePointsText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    ctaCountdownText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.75)',
        marginBottom: 4,
    },
    ctaSubtext: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 16,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 28,
        gap: 8,
    },
    ctaButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },

    // Daily Goal compact
    dailyGoalCompact: {
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    dailyGoalLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    dailyGoalLabel: {
        fontSize: 13,
    },
    dailyGoalCount: {
        fontSize: 13,
        fontWeight: '700',
    },

    // Active Challenges
    challengesCard: {
        marginBottom: 16,
    },
    challengesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    challengesIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    challengesContent: {
        flex: 1,
        marginLeft: 12,
    },
    challengesTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    challengesCount: {
        fontSize: 13,
        marginTop: 2,
    },

    // Sections
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
    seeMoreLink: {
        fontSize: 14,
        fontWeight: '600',
    },

    // Activity feed
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

    // Activity feed tab toggle
    activityTabRow: {
        flexDirection: 'row',
        gap: 8,
    },
    activityTab: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
    },
    activityTabText: {
        fontSize: 14,
        fontWeight: '600',
    },

    // High five button
    highFiveButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    highFiveEmoji: {
        fontSize: 18,
    },

    // Announcements
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

    // Training plan
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

    // Recent exercises
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

    // Login Bonus Toast
    loginBonusToast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 16,
        gap: 12,
    },
    loginBonusTextContainer: {
        flex: 1,
    },
    loginBonusTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    loginBonusPoints: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
    },
});
