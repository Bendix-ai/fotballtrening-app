import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, StreakCard } from '../../components';
import { useAuthStore } from '../../stores';

// Placeholder data for demo
const mockData = {
    todayExercises: 3,
    todayPoints: 45,
    currentStreak: 5,
    longestStreak: 12,
    recentExercises: [
        { id: '1', title: 'Oppvarming', points: 10, category: 'warmup' },
        { id: '2', title: 'Styrketrening', points: 20, category: 'strength' },
        { id: '3', title: 'Hurtighet', points: 15, category: 'agility' },
    ],
};

export function HomeScreen() {
    const { colors } = useTheme();
    const { user } = useAuthStore();

    const displayName = user?.display_name || 'Spiller';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                            {t('home.greeting')},
                        </Text>
                        <Text style={[styles.name, { color: colors.text }]}>
                            {displayName}! 👋
                        </Text>
                    </View>
                </View>

                {/* Today's Progress */}
                <Card style={styles.progressCard}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('home.todayProgress')}
                    </Text>
                    <View style={styles.progressRow}>
                        <View style={styles.progressItem}>
                            <Text style={[styles.progressValue, { color: colors.primary }]}>
                                {mockData.todayExercises}
                            </Text>
                            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                                {t('home.exercises')}
                            </Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <View style={styles.progressItem}>
                            <Text style={[styles.progressValue, { color: colors.accent }]}>
                                {mockData.todayPoints}
                            </Text>
                            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                                {t('home.points')}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Streak Card */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('home.currentStreak')}
                    </Text>
                    <StreakCard
                        currentStreak={mockData.currentStreak}
                        longestStreak={mockData.longestStreak}
                    />
                </View>

                {/* Quick Start */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('home.quickStart')}
                    </Text>
                    <Button
                        title={t('home.startTraining')}
                        onPress={() => { }}
                        fullWidth
                        size="large"
                    />
                </View>

                {/* Recent Exercises */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Nylige øvelser
                        </Text>
                        <Text style={[styles.viewAll, { color: colors.primary }]}>
                            {t('home.viewAll')}
                        </Text>
                    </View>
                    {mockData.recentExercises.map((exercise) => (
                        <Card key={exercise.id} style={styles.exerciseCard}>
                            <View style={styles.exerciseRow}>
                                <View>
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
    exerciseCard: {
        marginBottom: 12,
    },
    exerciseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
});
