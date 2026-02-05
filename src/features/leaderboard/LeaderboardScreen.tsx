import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { LeaderboardEntry, LeaderboardPeriod, LeaderboardScope } from '../../types';

// Placeholder leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, user_id: '1', display_name: 'Martin S.', avatar_url: null, total_points: 520, exercises_completed: 42, current_streak: 12, is_current_user: false },
    { rank: 2, user_id: '2', display_name: 'Emma L.', avatar_url: null, total_points: 485, exercises_completed: 38, current_streak: 8, is_current_user: false },
    { rank: 3, user_id: '3', display_name: 'Jonas K.', avatar_url: null, total_points: 460, exercises_completed: 35, current_streak: 15, is_current_user: false },
    { rank: 4, user_id: '4', display_name: 'Du', avatar_url: null, total_points: 390, exercises_completed: 30, current_streak: 5, is_current_user: true },
    { rank: 5, user_id: '5', display_name: 'Sofia M.', avatar_url: null, total_points: 350, exercises_completed: 28, current_streak: 3, is_current_user: false },
    { rank: 6, user_id: '6', display_name: 'Oliver T.', avatar_url: null, total_points: 320, exercises_completed: 25, current_streak: 7, is_current_user: false },
    { rank: 7, user_id: '7', display_name: 'Nora B.', avatar_url: null, total_points: 280, exercises_completed: 22, current_streak: 4, is_current_user: false },
    { rank: 8, user_id: '8', display_name: 'Henrik A.', avatar_url: null, total_points: 250, exercises_completed: 20, current_streak: 2, is_current_user: false },
];

const periods: { key: LeaderboardPeriod; label: string }[] = [
    { key: 'week', label: 'thisWeek' },
    { key: 'month', label: 'thisMonth' },
    { key: 'all_time', label: 'allTime' },
];

const getRankEmoji = (rank: number): string => {
    switch (rank) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return '';
    }
};

export function LeaderboardScreen() {
    const { colors } = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>('week');

    const renderLeaderboardEntry = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
        const isTopThree = item.rank <= 3;
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
                {/* Rank */}
                <View style={styles.rankContainer}>
                    {isTopThree ? (
                        <Text style={styles.rankEmoji}>{getRankEmoji(item.rank)}</Text>
                    ) : (
                        <Text style={[styles.rankNumber, { color: colors.textSecondary }]}>
                            {item.rank}
                        </Text>
                    )}
                </View>

                {/* Avatar */}
                <View
                    style={[
                        styles.avatar,
                        { backgroundColor: isTopThree ? colors.primary : colors.accent }
                    ]}
                >
                    <Text style={styles.avatarText}>
                        {item.display_name.charAt(0).toUpperCase()}
                    </Text>
                </View>

                {/* Player Info */}
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
                            <Text style={[styles.streak, { color: colors.streak }]}>
                                🔥 {item.current_streak}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Points */}
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

            {/* Period Filter */}
            <View style={styles.periodFilter}>
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

            {/* Leaderboard List */}
            <FlatList
                data={mockLeaderboard}
                keyExtractor={(item) => item.user_id}
                renderItem={renderLeaderboardEntry}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
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
    periodFilter: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    periodButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    periodText: {
        fontSize: 14,
        fontWeight: '600',
    },
    list: {
        padding: 20,
        paddingBottom: 100,
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
    rankEmoji: {
        fontSize: 24,
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
});
