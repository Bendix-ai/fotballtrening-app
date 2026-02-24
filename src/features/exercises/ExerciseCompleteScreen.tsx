import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button } from '../../components';
import { ExercisesStackParamList } from '../../types';
import { useExercise, useCompleteExercise, useTodayCompletions } from '../../hooks/useExercises';
import { useAchievements } from '../../hooks/useAchievements';
import { useAppStore } from '../../stores';
import { achievementDefinitions } from '../../data/mockData';
import * as Haptics from 'expo-haptics';

type CompleteRouteProp = RouteProp<ExercisesStackParamList, 'ExerciseComplete'>;
type CompleteNavigationProp = NativeStackNavigationProp<ExercisesStackParamList, 'ExerciseComplete'>;

export function ExerciseCompleteScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<CompleteNavigationProp>();
    const route = useRoute<CompleteRouteProp>();
    const { exerciseId, pointsEarned } = route.params;
    const { data: exercise } = useExercise(exerciseId);
    const completeExercise = useCompleteExercise();
    const { data: todayCompletions = [] } = useTodayCompletions();
    const { dailyGoal } = useAppStore();

    const { data: achievements = [], refetch: refetchAchievements } = useAchievements();
    const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);
    const initialUnlockedRef = useRef<Set<string> | null>(null);

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
    const NUM_PARTICLES = 12;
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

    useEffect(() => {
        // Record the completion
        completeExercise.mutate({ exerciseId, pointsEarned });

        // Success haptic
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

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
            const targetY = Math.sin(angle) * distance - 50;

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
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(p.y, {
                        toValue: targetY,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.sequence([
                        Animated.delay(500),
                        Animated.timing(p.opacity, {
                            toValue: 0,
                            duration: 300,
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

    const handleContinue = () => {
        navigation.popToTop();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
                    <Text style={[styles.subheading, { color: colors.textSecondary }]}>
                        {exercise?.title ?? 'Øvelse'} {t('exercises.completed').toLowerCase()}
                    </Text>
                </Animated.View>

                {/* Points earned */}
                <Animated.View style={{
                    opacity: fadeAnim,
                    transform: [{ scale: pointsScaleAnim }],
                }}>
                    <Card style={styles.pointsCard}>
                        <MaterialIcons name="star" size={32} color={colors.primary} />
                        <Animated.Text style={[
                            styles.pointsValue,
                            { color: colors.primary, transform: [{ scale: pointsBounceAnim }] },
                        ]}>
                            +{pointsEarned}
                        </Animated.Text>
                        <Text style={[styles.pointsLabel, { color: colors.textSecondary }]}>
                            {t('exercises.points')}
                        </Text>
                    </Card>
                </Animated.View>

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

            {/* Continue button */}
            <View style={styles.buttonContainer}>
                <Button
                    title={t('exercises.continueTraining')}
                    onPress={handleContinue}
                    fullWidth
                    size="large"
                    testID="exercise-back-button"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
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
    subheading: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    pointsCard: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 48,
    },
    pointsValue: {
        fontSize: 48,
        fontWeight: '700',
        marginTop: 8,
    },
    pointsLabel: {
        fontSize: 16,
        marginTop: 4,
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
