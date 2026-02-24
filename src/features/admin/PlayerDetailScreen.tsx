import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, SkeletonCard } from '../../components';
import { AdminStackParamList } from '../../types';
import { getLevelInfo, getTierColor, getTierIcon } from '../../lib/levelUtils';
import { usePlayer, usePlayerCompletions } from '../../hooks/useAdmin';
import { ProgressBar } from '../../components';

type PlayerDetailRouteProp = RouteProp<AdminStackParamList, 'PlayerDetail'>;
type PlayerDetailNavProp = NativeStackNavigationProp<AdminStackParamList>;

export function PlayerDetailScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<PlayerDetailNavProp>();
    const route = useRoute<PlayerDetailRouteProp>();
    const { playerId } = route.params;

    const { data: player, isLoading: playerLoading } = usePlayer(playerId);
    const { data: completions = [], isLoading: completionsLoading } = usePlayerCompletions(playerId);

    const isLoading = playerLoading || completionsLoading;

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        testID="player-detail-back-button"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {t('admin.playerDetail')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </View>
            </SafeAreaView>
        );
    }

    if (!player) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                        testID="player-detail-back-button"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {t('admin.playerDetail')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="person-off" size={48} color={colors.textTertiary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                        {t('admin.noPlayersFound')}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const levelInfo = getLevelInfo(player.total_points);
    const tierColor = getTierColor(levelInfo.tier);
    const tierIcon = getTierIcon(levelInfo.tier);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']} testID="player-detail-screen">
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    testID="player-detail-back-button"
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {t('admin.playerDetail')}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddEditPlayer', { playerId: player.id })}
                    style={styles.editButton}
                    testID="player-detail-edit-button"
                >
                    <MaterialIcons name="edit" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Player Profile Card */}
                <Card style={styles.profileCard}>
                    <View style={styles.profileContent}>
                        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                            <Text style={styles.avatarText}>
                                {player.display_name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <Text style={[styles.playerName, { color: colors.text }]}>
                            {player.display_name}
                        </Text>
                        <Text style={[styles.playerUsername, { color: colors.textSecondary }]}>
                            @{player.username}
                        </Text>
                        <View style={styles.metaRow}>
                            <View style={[styles.metaBadge, { backgroundColor: colors.primaryLight }]}>
                                <Text style={[styles.metaBadgeText, { color: colors.primary }]}>
                                    {player.year_group}
                                </Text>
                            </View>
                            <View style={[styles.metaBadge, { backgroundColor: colors.secondaryLight }]}>
                                <Text style={[styles.metaBadgeText, { color: colors.secondary }]}>
                                    {t(`admin.${player.gender}`)}
                                </Text>
                            </View>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: player.is_active ? colors.success + '20' : colors.textTertiary + '20' },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.statusDot,
                                        { backgroundColor: player.is_active ? colors.success : colors.textTertiary },
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.metaBadgeText,
                                        { color: player.is_active ? colors.success : colors.textTertiary },
                                    ]}
                                >
                                    {player.is_active ? t('admin.active') : t('admin.inactive')}
                                </Text>
                            </View>
                        </View>
                        {player.created_at && (
                            <Text style={[styles.memberSince, { color: colors.textTertiary }]}>
                                {t('admin.memberSince')} {new Date(player.created_at).toLocaleDateString('nb-NO')}
                            </Text>
                        )}
                    </View>
                </Card>

                {/* Level Card */}
                <Card style={styles.levelCard}>
                    <View style={styles.levelRow}>
                        <View style={[styles.levelIconContainer, { backgroundColor: tierColor + '20' }]}>
                            <MaterialIcons name={tierIcon as any} size={28} color={tierColor} />
                        </View>
                        <View style={styles.levelInfo}>
                            <Text style={[styles.levelTitle, { color: colors.text }]}>
                                {t('home.level', { level: String(levelInfo.level) })}
                            </Text>
                            <Text style={[styles.levelSubtext, { color: colors.textSecondary }]}>
                                {levelInfo.level >= 10
                                    ? t('home.maxLevel')
                                    : t('home.pointsToNextLevel', { points: String(levelInfo.pointsForNextLevel - player.total_points) })
                                }
                            </Text>
                        </View>
                    </View>
                    {levelInfo.level < 10 && (
                        <View style={styles.levelProgressContainer}>
                            <ProgressBar progress={levelInfo.progressToNext} color={tierColor} />
                        </View>
                    )}
                </Card>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <Card style={styles.statCard} testID="player-detail-points-stat">
                        <MaterialIcons name="star" size={24} color={colors.primary} />
                        <Text style={[styles.statValue, { color: colors.primary }]}>
                            {player.total_points}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            {t('profile.totalPoints')}
                        </Text>
                    </Card>

                    <Card style={styles.statCard} testID="player-detail-exercises-stat">
                        <MaterialIcons name="fitness-center" size={24} color={colors.accent} />
                        <Text style={[styles.statValue, { color: colors.accent }]}>
                            {player.exercises_completed}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            {t('profile.exercisesCompleted')}
                        </Text>
                    </Card>
                </View>

                <View style={styles.statsGrid}>
                    <Card style={styles.statCard} testID="player-detail-streak-stat">
                        <MaterialIcons name="local-fire-department" size={24} color={colors.streak} />
                        <Text style={[styles.statValue, { color: colors.streak }]}>
                            {player.current_streak}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            {t('profile.currentStreak')}
                        </Text>
                    </Card>

                    <Card style={styles.statCard} testID="player-detail-longest-streak-stat">
                        <MaterialIcons name="emoji-events" size={24} color={colors.leaderboardGold} />
                        <Text style={[styles.statValue, { color: colors.leaderboardGold }]}>
                            {player.longest_streak}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                            {t('profile.longestStreak')}
                        </Text>
                    </Card>
                </View>

                {/* Recent Completions */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('admin.recentCompletions')}
                    </Text>

                    {completions.length === 0 ? (
                        <Card style={styles.emptyCard}>
                            <View style={styles.emptyCompletions}>
                                <MaterialIcons name="history" size={36} color={colors.textTertiary} />
                                <Text style={[styles.emptyCompletionsText, { color: colors.textSecondary }]}>
                                    {t('admin.noCompletions')}
                                </Text>
                            </View>
                        </Card>
                    ) : (
                        completions.map((completion, index) => (
                            <Card key={`${completion.completed_at}-${index}`} style={styles.completionCard}>
                                <View style={styles.completionRow}>
                                    <View style={[styles.completionIcon, { backgroundColor: colors.primaryLight }]}>
                                        <MaterialIcons name="check-circle" size={20} color={colors.success} />
                                    </View>
                                    <View style={styles.completionInfo}>
                                        <Text style={[styles.completionTitle, { color: colors.text }]}>
                                            {completion.exercise_title}
                                        </Text>
                                        <Text style={[styles.completionDate, { color: colors.textTertiary }]}>
                                            {new Date(completion.completed_at).toLocaleDateString('nb-NO', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </Text>
                                    </View>
                                    <Text style={[styles.completionPoints, { color: colors.primary }]}>
                                        +{completion.points_earned}
                                    </Text>
                                </View>
                            </Card>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    editButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
    },

    // Profile card
    profileCard: {
        marginBottom: 16,
    },
    profileContent: {
        alignItems: 'center',
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#ffffff',
    },
    playerName: {
        fontSize: 22,
        fontWeight: '700',
    },
    playerUsername: {
        fontSize: 14,
        marginTop: 2,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    metaBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    metaBadgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    memberSince: {
        fontSize: 12,
        marginTop: 10,
    },

    // Level card
    levelCard: {
        marginBottom: 16,
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

    // Stats grid
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
        textAlign: 'center',
    },

    // Section
    section: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },

    // Completions
    completionCard: {
        marginBottom: 8,
    },
    completionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    completionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completionInfo: {
        flex: 1,
        marginLeft: 12,
    },
    completionTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    completionDate: {
        fontSize: 12,
        marginTop: 2,
    },
    completionPoints: {
        fontSize: 16,
        fontWeight: '700',
    },

    // Empty completions
    emptyCard: {
        marginBottom: 8,
    },
    emptyCompletions: {
        alignItems: 'center',
        paddingVertical: 20,
        gap: 8,
    },
    emptyCompletionsText: {
        fontSize: 14,
    },
});
