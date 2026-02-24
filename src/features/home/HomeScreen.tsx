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
import { Card, Button, StreakCard } from '../../components';
import { useAuthStore } from '../../stores';
import { MainTabParamList, RootStackParamList } from '../../types';
import { useExercises, useTodayCompletions } from '../../hooks/useExercises';
import { getCategoryIcon, getCategoryColor } from '../../lib/exerciseUtils';

type HomeNavProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Home'>,
    NativeStackNavigationProp<RootStackParamList>
>;

export function HomeScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<HomeNavProp>();
    const { user } = useAuthStore();

    const { data: exercises = [], isLoading: exercisesLoading, refetch: refetchExercises } = useExercises();
    const { data: todayCompletions = [], refetch: refetchToday } = useTodayCompletions();

    const onRefresh = useCallback(() => {
        refetchExercises();
        refetchToday();
    }, [refetchExercises, refetchToday]);

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

    // Show the 3 most recent exercises as suggestions
    const suggestedExercises = useMemo(() => exercises.slice(0, 3), [exercises]);

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
});
