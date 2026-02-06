import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, AdminHeader } from '../../components';
import { mockDashboardMetrics, mockAdminActivity, mockAdminPlayers } from '../../data/mockData';

export function DashboardScreen() {
    const { colors } = useTheme();
    const metrics = mockDashboardMetrics;
    const recentActivity = mockAdminActivity.slice(0, 8);
    const topPlayers = [...mockAdminPlayers].sort((a, b) => b.total_points - a.total_points).slice(0, 5);

    const metricCards = [
        { label: t('admin.totalPlayers'), value: metrics.totalPlayers, icon: 'people' as const, color: colors.primary },
        { label: t('admin.activeLast7Days'), value: metrics.activeLast7Days, icon: 'trending-up' as const, color: colors.success },
        { label: t('admin.totalCompletions'), value: metrics.totalCompletions, icon: 'check-circle' as const, color: colors.accent },
        { label: t('admin.engagementRate'), value: `${metrics.engagementRate}%`, icon: 'speed' as const, color: colors.secondary },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <AdminHeader title={t('admin.dashboard')} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Metric Cards */}
                <View style={styles.metricsGrid}>
                    {metricCards.map((metric, index) => (
                        <Card key={index} style={styles.metricCard}>
                            <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                                <MaterialIcons name={metric.icon} size={22} color={metric.color} />
                            </View>
                            <Text style={[styles.metricValue, { color: colors.text }]}>
                                {metric.value}
                            </Text>
                            <Text style={[styles.metricLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                                {metric.label}
                            </Text>
                        </Card>
                    ))}
                </View>

                {/* Recent Activity */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('admin.recentActivity')}
                    </Text>
                    <Card style={styles.activityCard}>
                        {recentActivity.map((activity, index) => (
                            <View
                                key={activity.id}
                                style={[
                                    styles.activityRow,
                                    index < recentActivity.length - 1 && {
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border,
                                    },
                                ]}
                            >
                                <View style={[styles.activityDot, { backgroundColor: activity.points ? colors.success : colors.accent }]} />
                                <View style={styles.activityInfo}>
                                    <Text style={[styles.activityName, { color: colors.text }]}>
                                        {activity.player_name}
                                    </Text>
                                    <Text style={[styles.activityAction, { color: colors.textSecondary }]} numberOfLines={1}>
                                        {activity.action}
                                    </Text>
                                </View>
                                {activity.points && (
                                    <Text style={[styles.activityPoints, { color: colors.primary }]}>
                                        +{activity.points}
                                    </Text>
                                )}
                            </View>
                        ))}
                    </Card>
                </View>

                {/* Top Performers */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('admin.topPerformers')}
                    </Text>
                    <Card style={styles.activityCard}>
                        {topPlayers.map((player, index) => (
                            <View
                                key={player.id}
                                style={[
                                    styles.playerRow,
                                    index < topPlayers.length - 1 && {
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border,
                                    },
                                ]}
                            >
                                <Text style={[styles.playerRank, { color: colors.textTertiary }]}>
                                    {index + 1}
                                </Text>
                                <View style={[styles.playerAvatar, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.playerAvatarText}>
                                        {player.display_name.charAt(0)}
                                    </Text>
                                </View>
                                <View style={styles.playerInfo}>
                                    <Text style={[styles.playerName, { color: colors.text }]}>
                                        {player.display_name}
                                    </Text>
                                    <Text style={[styles.playerStat, { color: colors.textSecondary }]}>
                                        {player.exercises_completed} {t('home.exercises')}
                                    </Text>
                                </View>
                                <Text style={[styles.playerPoints, { color: colors.primary }]}>
                                    {player.total_points}
                                </Text>
                            </View>
                        ))}
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    metricCard: {
        width: '47%',
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    metricIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    metricValue: {
        fontSize: 28,
        fontWeight: '700',
    },
    metricLabel: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    activityCard: {
        padding: 0,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    activityInfo: {
        flex: 1,
    },
    activityName: {
        fontSize: 14,
        fontWeight: '600',
    },
    activityAction: {
        fontSize: 12,
        marginTop: 2,
    },
    activityPoints: {
        fontSize: 14,
        fontWeight: '700',
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    playerRank: {
        fontSize: 16,
        fontWeight: '700',
        width: 24,
        textAlign: 'center',
    },
    playerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerAvatarText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#ffffff',
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 14,
        fontWeight: '600',
    },
    playerStat: {
        fontSize: 12,
        marginTop: 2,
    },
    playerPoints: {
        fontSize: 16,
        fontWeight: '700',
    },
});
