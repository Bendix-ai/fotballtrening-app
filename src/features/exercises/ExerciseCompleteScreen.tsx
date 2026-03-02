import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, ProgressBar, LevelUpModal, Mascot } from '../../components';
import { ExercisesStackParamList } from '../../types';
import { useExercise, useCompleteExercise, useTodayCompletions } from '../../hooks/useExercises';
import { useAchievements } from '../../hooks/useAchievements';
import { useAppStore, useAuthStore } from '../../stores';
import { achievementDefinitions } from '../../data/mockData';
import { getLevelInfo, getPointsToNextLevel } from '../../lib/levelUtils';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { playSound } from '../../lib/sounds';
import * as Haptics from 'expo-haptics';

type CompleteRouteProp = RouteProp<ExercisesStackParamList, 'ExerciseComplete'>;
type CompleteNavigationProp = NativeStackNavigationProp<ExercisesStackParamList, 'ExerciseComplete'>;

export function ExerciseCompleteScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<CompleteNavigationProp>();
    const route = useRoute<CompleteRouteProp>();
    const { exerciseId, pointsEarned, isDailyChallenge } = route.params;
    const { data: exercise } = useExercise(exerciseId);
    const completeExercise = useCompleteExercise();
    const { data: todayCompletions = [] } = useTodayCompletions();
    const { dailyGoal } = useAppStore();
    const { user } = useAuthStore();

    const { data: achievements = [], refetch: refetchAchievements } = useAchievements();
    const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);
    const [showLevelUpModal, setShowLevelUpModal] = useState(false);
    const initialUnlockedRef = useRef<Set<string> | null>(null);

    // Level info
    const currentPoints = user?.total_points ?? 0;
    const levelInfo = getLevelInfo(currentPoints);
    const postLevelInfo = getLevelInfo(currentPoints + pointsEarned);
    const pointsNeeded = getPointsToNextLevel(currentPoints);

    // Leaderboard rank
    const { data: leaderboardData = [] } = useLeaderboard('club', null, 'all_time');
    const userRank = useMemo(() => {
        const entry = leaderboardData.find((e) => e.is_current_user);
        return entry?.rank ?? null;
    }, [leaderboardData]);

    // Capture initial achievement state on mount
    if (initialUnlockedRef.current === null && achievements.length > 0) {
        initialUnlockedRef.current = new Set(
            achievements.filter((a) => a.unlocked).map((a) => a.type)
        );
    }

    // Check if this completion hits the daily goal (+1 because this completion hasn't been recorded yet in the query cache)
    const completionsAfter = todayCompletions.length + 1;
    const dailyGoalJustReached = completionsAfter >= dailyGoal && todayCompletions.length < dailyGoal;

    // Celebration particles
    const NUM_PARTICLES = 20;
    const particles = useRef(
        Array.from({ length: NUM_PARTICLES }, () => ({
            x: new Animated.Value(0),
            y: new Animated.Value(0),
            opacity: new Animated.Value(1),
            scale: new Animated.Value(0),
        }))
    ).current;

    const particleColors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

    // Animation
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pointsScaleAnim = useRef(new Animated.Value(0)).current;
    const pointsBounceAnim = useRef(new Animated.Value(0)).current;
    const goalAnim = useRef(new Animated.Value(0)).current;
    const achievementAnim = useRef(new Animated.Value(0)).current;
    const levelScaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Detect level-up by comparing pre/post completion levels
        if (postLevelInfo.level > levelInfo.level) {
            // Delay showing modal so completion celebration plays first
            setTimeout(() => {
                setShowLevelUpModal(true);
            }, 2000);
        }

        // Record the completion (trigger handles 2x for daily challenge)
        completeExercise.mutate({ exerciseId, pointsEarned, isDailyChallenge: !!isDailyChallenge });

        // Success haptic
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Play completion sound
        playSound('complete');

        // Run entrance animation
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            // Points card bounce-in
            Animated.spring(pointsScaleAnim, {
                toValue: 1,
                tension: 40,
                friction: 5,
                useNativeDriver: true,
            }),
            // Extra bounce pulse on the points value
            Animated.sequence([
                Animated.timing(pointsBounceAnim, {
                    toValue: 1.15,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.spring(pointsBounceAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 6,
                    useNativeDriver: true,
                }),
            ]),
            // Level progress card bounce-in
            Animated.spring(levelScaleAnim, {
                toValue: 1,
                tension: 40,
                friction: 5,
                useNativeDriver: true,
            }),
            // Daily goal celebration (only animates if goal reached)
            ...(dailyGoalJustReached ? [
                Animated.spring(goalAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ] : []),
        ]).start();

        // Celebration particle burst
        const particleAnimations = particles.map((p) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 120;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance + 100;

            return Animated.sequence([
                Animated.delay(300),
                Animated.parallel([
                    Animated.spring(p.scale, {
                        toValue: 1,
                        tension: 80,
                        friction: 5,
                        useNativeDriver: true,
                    }),
                    Animated.timing(p.x, {
                        toValue: targetX,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(p.y, {
                        toValue: targetY,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.sequence([
                        Animated.delay(2000),
                        Animated.timing(p.opacity, {
                            toValue: 0,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
            ]);
        });

        Animated.stagger(50, particleAnimations).start();

        // Check for newly unlocked achievements after backend processes completion
        const timer = setTimeout(async () => {
            const { data: updated } = await refetchAchievements();
            if (updated && initialUnlockedRef.current) {
                const newAchievement = updated.find(
                    (a) => a.unlocked && !initialUnlockedRef.current!.has(a.type)
                );
                if (newAchievement) {
                    setNewlyUnlocked(newAchievement.type);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    playSound('achievement');
                    Animated.spring(achievementAnim, {
                        toValue: 1,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }).start();
                }
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleDoAnother = () => {
        navigation.popToTop();
    };

    const handleSeeProgress = () => {
        navigation.getParent()?.navigate('ProfileTab');
    };

    const handleBackToHome = () => {
        navigation.getParent()?.navigate('Home');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Celebration particles */}
                    {particles.map((p, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.particle,
                                {
                                    backgroundColor: particleColors[i % particleColors.length],
                                    transform: [
                                        { translateX: p.x },
                                        { translateY: p.y },
                                        { scale: p.scale },
                                    ],
                                    opacity: p.opacity,
                                },
                            ]}
                        />
                    ))}

                    {/* Animated checkmark */}
                    <Animated.View
                        style={[
                            styles.checkCircle,
                            {
                                backgroundColor: colors.success + '20',
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}
                    >
                        <View style={[styles.checkInner, { backgroundColor: colors.success }]}>
                            <MaterialIcons name="check" size={60} color="#FFFFFF" />
                        </View>
                    </Animated.View>

                    {/* Heading */}
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Text style={[styles.heading, { color: colors.text }]}>
                            {t('exercises.greatJob')}
                        </Text>
                        <View style={styles.cheeringMascot}>
                            <Mascot state="cheering" size={48} />
                        </View>
                        <Text style={[styles.subheading, { color: colors.textSecondary }]}>
                            {exercise?.title ?? t('exercises.title')} {t('exercises.completed').toLowerCase()}
                        </Text>
                    </Animated.View>

                    {/* Daily Challenge Banner */}
                    {isDailyChallenge && (
                        <Animated.View style={{ opacity: fadeAnim, width: '100%', marginBottom: 16 }}>
                            <Card style={styles.dailyChallengeBanner} testID="complete-daily-challenge-banner">
                                <MaterialIcons name="whatshot" size={24} color="#FFFFFF" />
                                <Text style={styles.dailyChallengeBannerText}>
                                    {t('home.dailyChallengeBonus')}
                                </Text>
                            </Card>
                        </Animated.View>
                    )}

                    {/* Points earned */}
                    <Animated.View style={{
                        opacity: fadeAnim,
                        transform: [{ scale: pointsScaleAnim }],
                    }}>
                        <Card style={styles.pointsCard}>
                            <MaterialIcons name="star" size={32} color={colors.primary} />
                            <View style={styles.pointsRow}>
                                <Animated.Text style={[
                                    styles.pointsValue,
                                    { color: colors.primary, transform: [{ scale: pointsBounceAnim }] },
                                ]}>
                                    +{isDailyChallenge ? pointsEarned * 2 : pointsEarned}
                                </Animated.Text>
                                {isDailyChallenge && (
                                    <View style={styles.multiplierBadge} testID="complete-multiplier-badge">
                                        <Text style={styles.multiplierText}>2x</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={[styles.pointsLabel, { color: colors.textSecondary }]}>
                                {t('exercises.points')}
                            </Text>
                        </Card>
                    </Animated.View>

                    {/* Level Progress Card */}
                    <Animated.View style={{
                        opacity: fadeAnim,
                        transform: [{ scale: levelScaleAnim }],
                        marginTop: 16,
                        width: '100%',
                    }}>
                        <Card style={styles.levelCard} testID="complete-level-progress">
                            <View style={styles.levelHeader}>
                                <MaterialIcons
                                    name={levelInfo.tierIcon as keyof typeof MaterialIcons.glyphMap}
                                    size={24}
                                    color={levelInfo.tierColor}
                                />
                                <Text style={[styles.levelTitle, { color: colors.text }]}>
                                    {t('exercises.levelProgress')}
                                </Text>
                            </View>
                            <Text style={[styles.levelText, { color: colors.text }]}>
                                {t('home.level', { level: String(levelInfo.level) })}
                            </Text>
                            <ProgressBar
                                progress={levelInfo.progressToNext}
                                color={levelInfo.tierColor}
                                height={8}
                                style={{ marginTop: 8 }}
                            />
                            <Text style={[styles.levelSubtext, { color: colors.textSecondary }]}>
                                {levelInfo.level >= 10
                                    ? t('home.maxLevel')
                                    : t('home.pointsToNextLevel', { points: String(pointsNeeded) })}
                            </Text>
                        </Card>
                    </Animated.View>

                    {/* Social comparison */}
                    {userRank !== null && (
                        <Animated.View style={{ opacity: fadeAnim, marginTop: 8 }}>
                            <Text style={[styles.rankText, { color: colors.textSecondary }]}>
                                {t('home.yourRank', { rank: String(userRank) })}
                            </Text>
                        </Animated.View>
                    )}

                    {/* Daily Goal Reached Banner */}
                    {dailyGoalJustReached && (
                        <Animated.View style={{
                            opacity: goalAnim,
                            transform: [{ scale: goalAnim }],
                            marginTop: 20,
                        }}>
                            <Card style={styles.goalCard}>
                                <MaterialIcons name="emoji-events" size={28} color={colors.accent} />
                                <Text style={[styles.goalText, { color: colors.text }]}>
                                    {t('home.dailyGoalComplete')}
                                </Text>
                            </Card>
                        </Animated.View>
                    )}

                    {/* Achievement Unlocked Banner */}
                    {newlyUnlocked && (() => {
                        const def = achievementDefinitions[newlyUnlocked];
                        return (
                            <Animated.View style={{
                                opacity: achievementAnim,
                                transform: [{ scale: achievementAnim }],
                                marginTop: 16,
                            }}>
                                <Card style={{ ...styles.achievementCard, borderColor: colors.accent }}>
                                    <View style={[styles.achievementIconContainer, { backgroundColor: colors.accent + '20' }]}>
                                        <MaterialIcons name={(def?.icon as any) ?? 'star'} size={28} color={colors.accent} />
                                    </View>
                                    <View style={styles.achievementInfo}>
                                        <Text style={[styles.achievementUnlockedLabel, { color: colors.accent }]}>
                                            {t('achievements.unlocked')}!
                                        </Text>
                                        <Text style={[styles.achievementTitle, { color: colors.text }]}>
                                            {def?.title ?? newlyUnlocked}
                                        </Text>
                                    </View>
                                </Card>
                            </Animated.View>
                        );
                    })()}
                </View>
            </ScrollView>

            {/* CTA buttons */}
            <View style={styles.buttonContainer}>
                <Button
                    title={t('exercises.doAnother')}
                    onPress={handleDoAnother}
                    variant="secondary"
                    fullWidth
                    size="large"
                    testID="complete-do-another-button"
                />
                <View style={{ height: 10 }} />
                <Button
                    title={t('exercises.seeProgress')}
                    onPress={handleSeeProgress}
                    variant="outline"
                    fullWidth
                    size="medium"
                    testID="complete-see-progress-button"
                />
                <View style={{ height: 8 }} />
                <Button
                    title={t('exercises.backToHome')}
                    onPress={handleBackToHome}
                    variant="ghost"
                    fullWidth
                    size="medium"
                    testID="complete-back-home-button"
                />
            </View>

            {/* Level Up Modal */}
            <LevelUpModal
                visible={showLevelUpModal}
                level={postLevelInfo.level}
                tierName={postLevelInfo.tier}
                tierColor={postLevelInfo.tierColor}
                onDismiss={() => setShowLevelUpModal(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingBottom: 16,
    },
    particle: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    checkCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    checkInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    cheeringMascot: {
        alignItems: 'center',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    dailyChallengeBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF9800',
        paddingVertical: 12,
        paddingHorizontal: 20,
        gap: 8,
    },
    dailyChallengeBannerText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    pointsCard: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 48,
    },
    pointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pointsValue: {
        fontSize: 48,
        fontWeight: '700',
        marginTop: 8,
    },
    multiplierBadge: {
        backgroundColor: '#FF9800',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    multiplierText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    pointsLabel: {
        fontSize: 16,
        marginTop: 4,
    },
    levelCard: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    levelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    levelTitle: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    levelText: {
        fontSize: 18,
        fontWeight: '700',
    },
    levelSubtext: {
        fontSize: 13,
        marginTop: 6,
    },
    rankText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    goalText: {
        fontSize: 16,
        fontWeight: '700',
    },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 2,
    },
    achievementIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    achievementInfo: {
        flex: 1,
        marginLeft: 12,
    },
    achievementUnlockedLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 2,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
});
