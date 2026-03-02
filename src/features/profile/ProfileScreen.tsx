import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, StreakCard, ProgressBar, useToast } from '../../components';
import { useAuthStore } from '../../stores';
import { ProfileStackParamList, AchievementDefinition } from '../../types';
import { achievementDefinitions } from '../../data/mockData';
import { AchievementDetailModal } from './AchievementDetailModal';
import { useCompletions, useExercises } from '../../hooks/useExercises';
import { useAchievements } from '../../hooks/useAchievements';
import { useUploadAvatar } from '../../hooks/useProfile';
import { useFriends } from '../../hooks/useFriends';
import { getLevelInfo, getPointsToNextLevel } from '../../lib/levelUtils';

type ProfileNavProp = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

export function ProfileScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<ProfileNavProp>();
    const { user, club } = useAuthStore();
    const { data: completions = [] } = useCompletions();
    const { data: allExercises = [] } = useExercises();
    const { data: achievements = [] } = useAchievements();
    const { data: friends = [] } = useFriends();

    const { showToast } = useToast();
    const uploadAvatarMutation = useUploadAvatar();

    const [selectedAchievement, setSelectedAchievement] = useState<AchievementDefinition | null>(null);
    const [selectedUnlocked, setSelectedUnlocked] = useState(false);
    const [showAchievementModal, setShowAchievementModal] = useState(false);

    const displayName = user?.display_name || 'Spiller';

    // Compute next achievement progress
    const nextAchievement = useMemo(() => {
        const locked = achievements.filter((a) => !a.unlocked);
        if (locked.length === 0) return null;

        const totalPoints = user?.total_points ?? 0;
        const totalCompletions = completions.length;
        const currentStreak = user?.current_streak ?? 0;

        // Progress map: { current, target } for each achievement type
        const progressMap: Record<string, { current: number; target: number }> = {
            first_exercise: { current: Math.min(totalCompletions, 1), target: 1 },
            streak_3: { current: Math.min(currentStreak, 3), target: 3 },
            streak_7: { current: Math.min(currentStreak, 7), target: 7 },
            streak_30: { current: Math.min(currentStreak, 30), target: 30 },
            points_10: { current: Math.min(totalPoints, 10), target: 10 },
            points_100: { current: Math.min(totalPoints, 100), target: 100 },
            points_500: { current: Math.min(totalPoints, 500), target: 500 },
            points_1000: { current: Math.min(totalPoints, 1000), target: 1000 },
            exercises_5: { current: Math.min(totalCompletions, 5), target: 5 },
            exercises_10: { current: Math.min(totalCompletions, 10), target: 10 },
            exercises_50: { current: Math.min(totalCompletions, 50), target: 50 },
            first_favorite: { current: 0, target: 1 }, // Tracked separately
            tried_2_categories: { current: 0, target: 2 }, // Hard to calculate exactly
            first_challenge: { current: 0, target: 1 }, // Tracked separately
            first_highfive: { current: 0, target: 1 }, // Tracked separately
            all_categories: { current: 0, target: 5 }, // Hard to calculate exactly
        };

        // Find the locked achievement with the highest progress percentage
        let best: { type: string; current: number; target: number; progress: number } | null = null;
        for (const a of locked) {
            const p = progressMap[a.type];
            if (!p) continue;
            const progress = p.target > 0 ? p.current / p.target : 0;
            if (!best || progress > best.progress) {
                best = { type: a.type, current: p.current, target: p.target, progress };
            }
        }
        return best;
    }, [achievements, completions.length, user?.total_points, user?.current_streak]);

    const handleChangePhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets[0]) {
            uploadAvatarMutation.mutate(result.assets[0].uri, {
                onSuccess: () => showToast(t('profile.photoUpdated'), 'success'),
                onError: () => showToast(t('profile.photoError'), 'error'),
            });
        }
    };

    // Get recent completions for activity history
    const recentCompletions = useMemo(
        () => [...completions]
            .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
            .slice(0, 5),
        [completions]
    );

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
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Settings')}
                        accessibilityRole="button"
                        accessibilityLabel={t('profile.settings')}
                        testID="profile-settings-button"
                    >
                        <MaterialIcons name="settings" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Profile Card */}
                <Card style={styles.profileCard}>
                    <View style={styles.profileContent}>
                        <View style={styles.avatarContainer} testID="profile-avatar">
                            {user?.avatar_url ? (
                                <Image
                                    source={{ uri: user.avatar_url }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.avatarText}>
                                        {displayName.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <TouchableOpacity
                                style={[styles.cameraButton, { backgroundColor: colors.primary }]}
                                onPress={handleChangePhoto}
                                disabled={uploadAvatarMutation.isPending}
                                testID="profile-change-photo-button"
                            >
                                <MaterialIcons name="camera-alt" size={16} color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.name, { color: colors.text }]}>
                            {displayName}
                        </Text>
                        <Text style={[styles.club, { color: colors.textSecondary }]}>
                            {club?.name ?? ''}
                        </Text>
                    </View>
                </Card>

                {/* Level Card */}
                {(() => {
                    const levelInfo = getLevelInfo(user?.total_points ?? 0);
                    const pointsNeeded = getPointsToNextLevel(user?.total_points ?? 0);
                    return (
                        <Card style={styles.levelCard}>
                            <View style={styles.levelRow}>
                                <View style={[styles.levelIconContainer, { backgroundColor: levelInfo.tierColor + '20' }]}>
                                    <MaterialIcons name={levelInfo.tierIcon as any} size={28} color={levelInfo.tierColor} />
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

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <Card style={styles.statCard}>
                        <View accessibilityLabel={`${user?.total_points ?? 0} ${t('profile.totalPoints')}`}>
                            <Text style={[styles.statValue, { color: colors.primary }]}>
                                {user?.total_points ?? 0}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                {t('profile.totalPoints')}
                            </Text>
                        </View>
                    </Card>

                    <Card style={styles.statCard}>
                        <View accessibilityLabel={`${completions.length} ${t('profile.exercisesCompleted')}`}>
                            <Text style={[styles.statValue, { color: colors.accent }]}>
                                {completions.length}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                {t('profile.exercisesCompleted')}
                            </Text>
                        </View>
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
                            {t('profile.activityHistory')}
                        </Text>
                        {recentCompletions.map((completion) => {
                            const exercise = allExercises.find((e) => e.id === completion.exercise_id);
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

                {/* Next Achievement Preview */}
                {nextAchievement && (() => {
                    const def = achievementDefinitions[nextAchievement.type];
                    return (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                {t('achievements.nextAchievement')}
                            </Text>
                            <Card style={styles.nextAchievementCard}>
                                <View style={styles.nextAchievementRow}>
                                    <View style={[styles.nextAchievementIcon, { backgroundColor: colors.accent + '18' }]}>
                                        <MaterialIcons name={(def?.icon as any) ?? 'star'} size={24} color={colors.accent} />
                                    </View>
                                    <View style={styles.nextAchievementInfo}>
                                        <Text style={[styles.nextAchievementTitle, { color: colors.text }]}>
                                            {def?.title ?? nextAchievement.type}
                                        </Text>
                                        <Text style={[styles.nextAchievementDesc, { color: colors.textSecondary }]}>
                                            {def?.description ?? ''}
                                        </Text>
                                    </View>
                                    <Text style={[styles.nextAchievementProgress, { color: colors.accent }]}>
                                        {nextAchievement.current}/{nextAchievement.target}
                                    </Text>
                                </View>
                                <View style={styles.nextAchievementBarContainer}>
                                    <ProgressBar progress={nextAchievement.progress} color={colors.accent} />
                                </View>
                            </Card>
                        </View>
                    );
                })()}

                {/* Achievements Preview */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('profile.achievements')}
                        </Text>
                    </View>

                    <View style={styles.achievementsGrid}>
                        {achievements.map((achievement, index) => {
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
                                    accessibilityRole="button"
                                    accessibilityLabel={`${definition?.title ?? achievement.type}: ${achievement.unlocked ? t('achievements.unlocked') : t('achievements.locked')}`}
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

                {/* Friends Section */}
                <TouchableOpacity
                    style={styles.section}
                    onPress={() => navigation.navigate('Friends')}
                    accessibilityRole="button"
                    testID="profile-friends-button"
                >
                    <Card style={styles.friendsCard}>
                        <View style={styles.friendsRow}>
                            <View style={[styles.friendsIcon, { backgroundColor: colors.primaryLight }]}>
                                <MaterialIcons name="people" size={24} color={colors.primary} />
                            </View>
                            <View style={styles.friendsInfo}>
                                <Text style={[styles.friendsTitle, { color: colors.text }]}>
                                    {t('profile.friends')}
                                </Text>
                                <Text style={[styles.friendsCount, { color: colors.textSecondary }]}>
                                    {friends.length} {t('profile.friends').toLowerCase()}
                                </Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />
                        </View>
                    </Card>
                </TouchableOpacity>
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
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#ffffff',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: -4,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
    },
    club: {
        fontSize: 14,
        marginTop: 4,
    },
    levelCard: {
        marginBottom: 20,
    },
    levelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelInfo: {
        flex: 1,
        marginLeft: 12,
    },
    levelTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    levelSubtext: {
        fontSize: 13,
        marginTop: 2,
    },
    levelProgressContainer: {
        marginTop: 12,
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
    // Next Achievement
    nextAchievementCard: {
        marginBottom: 0,
    },
    nextAchievementRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nextAchievementIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextAchievementInfo: {
        flex: 1,
        marginLeft: 12,
    },
    nextAchievementTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    nextAchievementDesc: {
        fontSize: 12,
        marginTop: 2,
    },
    nextAchievementProgress: {
        fontSize: 14,
        fontWeight: '700',
    },
    nextAchievementBarContainer: {
        marginTop: 10,
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
    // Friends
    friendsCard: {
        marginBottom: 0,
    },
    friendsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    friendsIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    friendsInfo: {
        flex: 1,
        marginLeft: 12,
    },
    friendsTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    friendsCount: {
        fontSize: 13,
        marginTop: 2,
    },
});
