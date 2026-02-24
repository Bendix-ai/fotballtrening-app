import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { ProgressBar, Button, ConfirmationDialog } from '../../components';
import { ExercisesStackParamList } from '../../types';
import { useExercise } from '../../hooks/useExercises';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const TIMER_SIZE = 200;
const STROKE_WIDTH = 8;
const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type ExecRouteProp = RouteProp<ExercisesStackParamList, 'ExerciseExecution'>;
type ExecNavigationProp = NativeStackNavigationProp<ExercisesStackParamList, 'ExerciseExecution'>;

export function ExerciseExecutionScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<ExecNavigationProp>();
    const route = useRoute<ExecRouteProp>();
    const { exerciseId } = route.params;

    const { data: exercise } = useExercise(exerciseId);
    const totalDuration = exercise?.duration_seconds ?? 120;

    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const motivationalAnim = useRef(new Animated.Value(0)).current;
    const shownHalfway = useRef(false);
    const shownAlmost = useRef(false);

    const isComplete = elapsedSeconds >= totalDuration;
    const progress = Math.min(elapsedSeconds / totalDuration, 1);
    const remainingSeconds = Math.max(0, totalDuration - elapsedSeconds);

    // Animated progress for SVG circle
    const progressAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCUMFERENCE, 0],
    });

    // Color: green→yellow in last 10s, yellow→red in last 5s
    const timerColor = useMemo(() => {
        if (isComplete) return colors.success;
        if (remainingSeconds <= 5) return colors.error;
        if (remainingSeconds <= 10) return colors.warning;
        return colors.primary;
    }, [remainingSeconds, isComplete, colors]);

    const startTimer = useCallback(() => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval(() => {
            setElapsedSeconds((prev) => {
                if (prev >= totalDuration) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return totalDuration;
                }
                return prev + 1;
            });
        }, 1000);
    }, [totalDuration]);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, [startTimer, stopTimer]);

    const handlePauseResume = () => {
        if (isPaused) {
            startTimer();
            setIsPaused(false);
        } else {
            stopTimer();
            setIsPaused(true);
        }
    };

    const handleComplete = () => {
        stopTimer();
        navigation.replace('ExerciseComplete', {
            exerciseId,
            pointsEarned: exercise?.points ?? 0,
        });
    };

    const handleExit = () => {
        setShowExitDialog(true);
        stopTimer();
    };

    const handleConfirmExit = () => {
        setShowExitDialog(false);
        navigation.goBack();
    };

    const handleCancelExit = () => {
        setShowExitDialog(false);
        if (!isPaused) startTimer();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Show motivational messages at milestones
    useEffect(() => {
        if (progress >= 0.5 && !shownHalfway.current) {
            shownHalfway.current = true;
            setMotivationalMessage(t('exercises.halfway'));
            Animated.sequence([
                Animated.timing(motivationalAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.delay(2000),
                Animated.timing(motivationalAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start(() => setMotivationalMessage(null));
        } else if (progress >= 0.9 && !shownAlmost.current) {
            shownAlmost.current = true;
            setMotivationalMessage(t('exercises.almostThere'));
            Animated.sequence([
                Animated.timing(motivationalAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.delay(2000),
                Animated.timing(motivationalAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start(() => setMotivationalMessage(null));
        }
    }, [progress]);

    // Get current instruction step based on progress
    const instructions = exercise?.instructions.split('. ').filter(Boolean) ?? [];
    const currentStepIndex = Math.min(
        Math.floor(progress * instructions.length),
        instructions.length - 1
    );
    const currentStep = instructions[currentStepIndex] ?? '';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Top bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
                    <MaterialIcons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.exerciseTitle, { color: colors.text }]} numberOfLines={1}>
                    {exercise?.title}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Progress bar */}
            <View style={styles.progressSection}>
                <ProgressBar progress={progress} />
                <View style={styles.timeRow}>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                        {formatTime(elapsedSeconds)}
                    </Text>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                        -{formatTime(remainingSeconds)}
                    </Text>
                </View>
            </View>

            {/* Main content */}
            <View style={styles.mainContent}>
                {/* Motivational message */}
                {motivationalMessage && (
                    <Animated.View style={[
                        styles.motivationalBanner,
                        { backgroundColor: colors.primary, opacity: motivationalAnim, transform: [{ scale: motivationalAnim }] },
                    ]}>
                        <Text style={styles.motivationalText}>{motivationalMessage}</Text>
                    </Animated.View>
                )}

                {/* Timer circle with animated ring */}
                <View testID="exercise-timer" style={styles.timerContainer}>
                    <Svg width={TIMER_SIZE} height={TIMER_SIZE} style={styles.timerSvg}>
                        {/* Background track */}
                        <Circle
                            cx={TIMER_SIZE / 2}
                            cy={TIMER_SIZE / 2}
                            r={RADIUS}
                            stroke={colors.border}
                            strokeWidth={STROKE_WIDTH}
                            fill="none"
                        />
                        {/* Animated progress arc */}
                        <AnimatedCircle
                            cx={TIMER_SIZE / 2}
                            cy={TIMER_SIZE / 2}
                            r={RADIUS}
                            stroke={timerColor}
                            strokeWidth={STROKE_WIDTH}
                            fill="none"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${TIMER_SIZE / 2}, ${TIMER_SIZE / 2}`}
                        />
                    </Svg>
                    <View style={styles.timerContent}>
                        {isComplete ? (
                            <MaterialIcons name="check" size={60} color={colors.success} />
                        ) : (
                            <>
                                <Text style={[styles.timerValue, { color: timerColor }]}>
                                    {formatTime(remainingSeconds)}
                                </Text>
                                <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>
                                    {isPaused ? t('exercises.paused') : t('exercises.remaining')}
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Current step */}
                {currentStep ? (
                    <View style={[styles.stepCard, { backgroundColor: colors.card }]}>
                        <Text style={[styles.stepLabel, { color: colors.primary }]}>
                            {t('exercises.stepOf', { current: String(currentStepIndex + 1), total: String(instructions.length) })}
                        </Text>
                        <Text style={[styles.stepText, { color: colors.text }]}>
                            {currentStep.trim()}{currentStep.endsWith('.') ? '' : '.'}
                        </Text>
                    </View>
                ) : null}
            </View>

            {/* Bottom controls */}
            <View style={styles.controls}>
                {isComplete ? (
                    <Button
                        title={t('exercises.complete')}
                        onPress={handleComplete}
                        fullWidth
                        size="large"
                        testID="exercise-complete-button"
                    />
                ) : (
                    <Button
                        title={isPaused ? t('exercises.resume') : t('exercises.pause')}
                        onPress={handlePauseResume}
                        variant={isPaused ? 'primary' : 'secondary'}
                        fullWidth
                        size="large"
                    />
                )}
            </View>

            {/* Exit confirmation */}
            <ConfirmationDialog
                visible={showExitDialog}
                title={t('exercises.exitTitle')}
                message={t('exercises.exitMessage')}
                confirmLabel={t('exercises.exit')}
                cancelLabel={t('common.cancel')}
                onConfirm={handleConfirmExit}
                onCancel={handleCancelExit}
                destructive
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    exitButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    progressSection: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    timeText: {
        fontSize: 13,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    motivationalBanner: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 20,
    },
    motivationalText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    timerContainer: {
        width: TIMER_SIZE,
        height: TIMER_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    timerSvg: {
        position: 'absolute',
    },
    timerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerValue: {
        fontSize: 40,
        fontWeight: '700',
    },
    timerLabel: {
        fontSize: 14,
        marginTop: 4,
    },
    stepCard: {
        width: '100%',
        borderRadius: 16,
        padding: 20,
    },
    stepLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    stepText: {
        fontSize: 16,
        lineHeight: 24,
    },
    controls: {
        paddingHorizontal: 20,
        paddingBottom: 32,
        paddingTop: 16,
    },
});
