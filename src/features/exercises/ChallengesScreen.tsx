import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, useToast } from '../../components';
import { useAuthStore } from '../../stores';
import { useChallenges, useAcceptChallenge, useDeclineChallenge } from '../../hooks/useChallenges';
import { Challenge, ExercisesStackParamList } from '../../types';

type NavProp = NativeStackNavigationProp<ExercisesStackParamList>;

function getStatusColor(status: Challenge['status'], colors: ReturnType<typeof useTheme>['colors']) {
    switch (status) {
        case 'pending': return colors.warning;
        case 'accepted': return colors.info;
        case 'completed': return colors.success;
        case 'expired': return colors.textTertiary;
    }
}

function getStatusLabel(status: Challenge['status']): string {
    return t(`challenges.${status}`);
}

function getTimeRemaining(expiresAt: string): string {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return t('challenges.expired');
    const hours = Math.ceil(diff / (1000 * 60 * 60));
    return t('challenges.expiresIn', { hours: String(hours) });
}

export function ChallengesScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<NavProp>();
    const { showToast } = useToast();
    const { user } = useAuthStore();
    const { data: challenges = [], isLoading } = useChallenges();
    const acceptChallenge = useAcceptChallenge();
    const declineChallenge = useDeclineChallenge();
    const [tab, setTab] = useState<'active' | 'history'>('active');

    const activeChallenges = useMemo(
        () => challenges.filter((c) => c.status === 'pending' || c.status === 'accepted'),
        [challenges],
    );

    const historyChallenges = useMemo(
        () => challenges.filter((c) => c.status === 'completed' || c.status === 'expired'),
        [challenges],
    );

    const displayList = tab === 'active' ? activeChallenges : historyChallenges;

    const handleAccept = (challengeId: string) => {
        acceptChallenge.mutate(challengeId, {
            onSuccess: () => showToast(t('challenges.challengeAccepted'), 'success'),
        });
    };

    const handleDecline = (challengeId: string) => {
        declineChallenge.mutate(challengeId);
    };

    const renderChallenge = ({ item }: { item: Challenge }) => {
        const isChallenger = item.challenger_id === user?.id;
        const opponentName = isChallenger ? item.opponent_name : item.challenger_name;
        const statusColor = getStatusColor(item.status, colors);

        return (
            <Card style={styles.challengeCard} testID="challenge-card">
                <View style={styles.challengeHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {getStatusLabel(item.status)}
                        </Text>
                    </View>
                    {(item.status === 'pending' || item.status === 'accepted') && (
                        <Text style={[styles.expiresText, { color: colors.textTertiary }]}>
                            {getTimeRemaining(item.expires_at)}
                        </Text>
                    )}
                </View>

                <View style={styles.vsSection}>
                    <View style={styles.playerSide}>
                        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                            <Text style={[styles.avatarText, { color: colors.primary }]}>
                                {(isChallenger ? item.challenger_name : item.opponent_name).charAt(0)}
                            </Text>
                        </View>
                        <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>
                            {isChallenger ? t('leaderboard.you') : opponentName}
                        </Text>
                        {(isChallenger ? item.challenger_completed : item.opponent_completed) && (
                            <MaterialIcons name="check-circle" size={16} color={colors.success} />
                        )}
                    </View>

                    <View style={[styles.vsBadge, { backgroundColor: colors.secondary + '20' }]}>
                        <Text style={[styles.vsText, { color: colors.secondary }]}>
                            {t('challenges.vs')}
                        </Text>
                    </View>

                    <View style={styles.playerSide}>
                        <View style={[styles.avatar, { backgroundColor: colors.accent + '20' }]}>
                            <Text style={[styles.avatarText, { color: colors.accent }]}>
                                {opponentName.charAt(0)}
                            </Text>
                        </View>
                        <Text style={[styles.playerName, { color: colors.text }]} numberOfLines={1}>
                            {isChallenger ? opponentName : t('leaderboard.you')}
                        </Text>
                        {(isChallenger ? item.opponent_completed : item.challenger_completed) && (
                            <MaterialIcons name="check-circle" size={16} color={colors.success} />
                        )}
                    </View>
                </View>

                <View style={[styles.exerciseRow, { backgroundColor: colors.surface }]}>
                    <MaterialIcons name="fitness-center" size={18} color={colors.primary} />
                    <Text style={[styles.exerciseTitle, { color: colors.text }]} numberOfLines={1}>
                        {item.exercise_title}
                    </Text>
                    <View style={[styles.bonusBadge, { backgroundColor: colors.secondary + '20' }]}>
                        <Text style={[styles.bonusText, { color: colors.secondary }]}>
                            +{item.bonus_points}
                        </Text>
                    </View>
                </View>

                {item.status === 'pending' && !isChallenger && (
                    <View style={styles.actionRow}>
                        <Button
                            title={t('challenges.accept')}
                            onPress={() => handleAccept(item.id)}
                            style={styles.acceptButton}
                            testID="challenge-accept-button"
                        />
                        <TouchableOpacity
                            onPress={() => handleDecline(item.id)}
                            style={[styles.declineButton, { borderColor: colors.border }]}
                            testID="challenge-decline-button"
                        >
                            <Text style={[styles.declineText, { color: colors.textSecondary }]}>
                                {t('challenges.decline')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Card>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} testID="challenges-screen">
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} testID="challenges-back-button">
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>
                    {t('challenges.title')}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                <TouchableOpacity
                    onPress={() => setTab('active')}
                    style={[styles.tab, tab === 'active' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                    testID="challenges-active-tab"
                >
                    <Text style={[styles.tabText, { color: tab === 'active' ? colors.primary : colors.textSecondary }]}>
                        {t('challenges.active')} ({activeChallenges.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setTab('history')}
                    style={[styles.tab, tab === 'history' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
                    testID="challenges-history-tab"
                >
                    <Text style={[styles.tabText, { color: tab === 'history' ? colors.primary : colors.textSecondary }]}>
                        {t('challenges.history')} ({historyChallenges.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={displayList}
                keyExtractor={(item) => item.id}
                renderItem={renderChallenge}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialIcons name="sports-kabaddi" size={64} color={colors.textTertiary} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            {t('challenges.noChallenges')}
                        </Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                            {t('challenges.noChallengesDesc')}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 20, fontWeight: '700' },
    tabRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
    tabText: { fontSize: 15, fontWeight: '600' },
    list: { padding: 20, paddingBottom: 40 },
    challengeCard: { marginBottom: 16 },
    challengeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: '600' },
    expiresText: { fontSize: 12 },
    vsSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    playerSide: { flex: 1, alignItems: 'center', gap: 4 },
    avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 18, fontWeight: '700' },
    playerName: { fontSize: 13, fontWeight: '600', maxWidth: 100, textAlign: 'center' },
    vsBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    vsText: { fontSize: 13, fontWeight: '800' },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        gap: 8,
        marginBottom: 8,
    },
    exerciseTitle: { flex: 1, fontSize: 14, fontWeight: '500' },
    bonusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    bonusText: { fontSize: 12, fontWeight: '700' },
    actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    acceptButton: { flex: 1 },
    declineButton: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    declineText: { fontSize: 15, fontWeight: '600' },
    emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '700' },
    emptyDesc: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
});
