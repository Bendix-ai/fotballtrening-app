import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { LeaderboardEntry, LeaderboardPeriod, LeaderboardScope } from '../../types';
import { mockLeaderboard } from '../../data/mockData';

const periods: { key: LeaderboardPeriod; label: string }[] = [
    { key: 'week', label: 'thisWeek' },
    { key: 'month', label: 'thisMonth' },
    { key: 'all_time', label: 'allTime' },
];

const scopes: { key: LeaderboardScope; label: string }[] = [
    { key: 'club', label: 'club' },
    { key: 'year_group', label: 'yearGroup' },
    { key: 'team', label: 'team' },
];

const getRankColor = (rank: number, colors: any): string => {
    switch (rank) {
        case 1: return colors.leaderboardGold;
        case 2: return colors.leaderboardSilver;
        case 3: return colors.leaderboardBronze;
        default: return colors.textTertiary;
    }
};

// Podium component for top 3
function Podium({ top3, colors }: { top3: LeaderboardEntry[]; colors: any }) {
    const [second, first, third] = [top3[1], top3[0], top3[2]];
    if (!first) return null;

    const renderPodiumItem = (entry: LeaderboardEntry | undefined, height: number, rank: number) => {
        if (!entry) return <View style={{ flex: 1 }} />;
        const color = getRankColor(rank, colors);
        return (
            <View style={[styles.podiumItem, { flex: 1 }]}>
                <View style={[styles.podiumAvatar, { backgroundColor: color }]}>
                    <Text style={styles.podiumAvatarText}>
                        {entry.display_name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
                    {entry.display_name}
                </Text>
                <Text style={[styles.podiumPoints, { color }]}>
                    {entry.total_points}
                </Text>
                <View style={[styles.podiumBar, { height, backgroundColor: color + '30', borderColor: color }]}>
                    <MaterialIcons name="emoji-events" size={24} color={color} />
                    <Text style={[styles.podiumRank, { color }]}>{rank}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.podiumContainer}>
            {renderPodiumItem(second, 80, 2)}
            {renderPodiumItem(first, 110, 1)}
            {renderPodiumItem(third, 60, 3)}
        </View>
    );
}

export function LeaderboardScreen() {
    const { colors } = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>('week');
    const [selectedScope, setSelectedScope] = useState<LeaderboardScope>('club');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const top3 = mockLeaderboard.slice(0, 3);
    const rest = mockLeaderboard.slice(3);
    const currentUser = mockLeaderboard.find((e) => e.is_current_user);

    const renderLeaderboardEntry = ({ item }: { item: LeaderboardEntry }) => {
        const isCurrentUser = item.is_current_user;

        return (
            <View
                style={[
                    styles.entryCard,
                    {
                        backgroundColor: isCurrentUser ? colors.primaryLight : colors.card,
                        borderColor: isCurrentUser ? colors.primary : colors.border,
                    },
                ]}
            >
                <View style={styles.rankContainer}>
                    <Text style={[styles.rankNumber, { color: colors.textSecondary }]}>
                        {item.rank}
                    </Text>
                </View>

                <View
                    style={[styles.avatar, { backgroundColor: colors.accent }]}
                >
                    <Text style={styles.avatarText}>
                        {item.display_name.charAt(0).toUpperCase()}
                    </Text>
                </View>

                <View style={styles.playerInfo}>
                    <Text
                        style={[
                            styles.playerName,
                            {
                                color: colors.text,
                                fontWeight: isCurrentUser ? '700' : '600',
                            }
                        ]}
                    >
                        {item.display_name}
                        {isCurrentUser && ` (${t('leaderboard.you')})`}
                    </Text>
                    <View style={styles.statsRow}>
                        <Text style={[styles.stat, { color: colors.textSecondary }]}>
                            {item.exercises_completed} {t('home.exercises')}
                        </Text>
                        {item.current_streak > 0 && (
                            <View style={styles.streakContainer}>
                                <MaterialIcons name="local-fire-department" size={14} color={colors.streak} />
                                <Text style={[styles.streak, { color: colors.streak }]}>
                                    {item.current_streak}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.pointsContainer}>
                    <Text style={[styles.points, { color: colors.primary }]}>
                        {item.total_points}
                    </Text>
                    <Text style={[styles.pointsLabel, { color: colors.textSecondary }]}>
                        {t('leaderboard.points')}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    {t('leaderboard.title')}
                </Text>
            </View>

            {/* Scope Filter Chips */}
            <View style={styles.scopeFilter}>
                {scopes.map((scope) => (
                    <TouchableOpacity
                        key={scope.key}
                        onPress={() => setSelectedScope(scope.key)}
                        style={[
                            styles.scopeChip,
                            {
                                backgroundColor: selectedScope === scope.key
                                    ? colors.primary
                                    : colors.surface,
                                borderColor: selectedScope === scope.key
                                    ? colors.primary
                                    : colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.scopeText,
                                {
                                    color: selectedScope === scope.key
                                        ? '#ffffff'
                                        : colors.textSecondary,
                                },
                            ]}
                        >
                            {t(`leaderboard.${scope.label}`)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Period Filter */}
            <View style={[styles.periodFilter, { backgroundColor: colors.surface }]}>
                {periods.map((period) => (
                    <TouchableOpacity
                        key={period.key}
                        onPress={() => setSelectedPeriod(period.key)}
                        style={[
                            styles.periodButton,
                            {
                                backgroundColor: selectedPeriod === period.key
                                    ? colors.primary
                                    : 'transparent',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.periodText,
                                {
                                    color: selectedPeriod === period.key
                                        ? '#ffffff'
                                        : colors.textSecondary,
                                },
                            ]}
                        >
                            {t(`leaderboard.${period.label}`)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={rest}
                keyExtractor={(item) => item.user_id}
                renderItem={renderLeaderboardEntry}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<Podium top3={top3} colors={colors} />}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            />

            {/* Sticky current user card */}
            {currentUser && currentUser.rank > 3 && (
                <View style={[styles.stickyUser, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                    {renderLeaderboardEntry({ item: currentUser })}
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
    },
    scopeFilter: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 8,
        marginTop: 12,
    },
    scopeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    scopeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    periodFilter: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 16,
        borderRadius: 12,
        padding: 4,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    periodText: {
        fontSize: 13,
        fontWeight: '600',
    },
    // Podium styles
    podiumContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    podiumItem: {
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    podiumAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    podiumAvatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },
    podiumName: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 2,
    },
    podiumPoints: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
    },
    podiumBar: {
        width: '100%',
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    podiumRank: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 2,
    },
    // List styles
    list: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    entryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    rankContainer: {
        width: 36,
        alignItems: 'center',
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: '700',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },
    playerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    playerName: {
        fontSize: 16,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 12,
    },
    stat: {
        fontSize: 12,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    streak: {
        fontSize: 12,
        fontWeight: '600',
    },
    pointsContainer: {
        alignItems: 'flex-end',
    },
    points: {
        fontSize: 20,
        fontWeight: '700',
    },
    pointsLabel: {
        fontSize: 11,
    },
    stickyUser: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
        borderTopWidth: 1,
    },
});
