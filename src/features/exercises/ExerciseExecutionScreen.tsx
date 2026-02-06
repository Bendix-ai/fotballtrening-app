import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { ProgressBar, Button, ConfirmationDialog } from '../../components';
import { ExercisesStackParamList } from '../../types';
import { mockExercises } from '../../data/mockData';

type ExecRouteProp = RouteProp<ExercisesStackParamList, 'ExerciseExecution'>;
type ExecNavigationProp = NativeStackNavigationProp<ExercisesStackParamList, 'ExerciseExecution'>;

export function ExerciseExecutionScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<ExecNavigationProp>();
    const route = useRoute<ExecRouteProp>();
    const { exerciseId } = route.params;

    const exercise = mockExercises.find((e) => e.id === exerciseId);
    const totalDuration = exercise?.duration_seconds ?? 120;

    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isComplete = elapsedSeconds >= totalDuration;
    const progress = Math.min(elapsedSeconds / totalDuration, 1);

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

    const remainingSeconds = Math.max(0, totalDuration - elapsedSeconds);

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
                {/* Timer circle */}
                <View style={[styles.timerCircle, { borderColor: isComplete ? colors.success : colors.primary }]}>
                    {isComplete ? (
                        <MaterialIcons name="check" size={60} color={colors.success} />
                    ) : (
                        <>
                            <Text style={[styles.timerValue, { color: colors.text }]}>
                                {formatTime(remainingSeconds)}
                            </Text>
                            <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>
                                {isPaused ? 'Pauset' : 'Gjenstår'}
                            </Text>
                        </>
                    )}
                </View>

                {/* Current step */}
                {currentStep ? (
                    <View style={[styles.stepCard, { backgroundColor: colors.card }]}>
                        <Text style={[styles.stepLabel, { color: colors.primary }]}>
                            Steg {currentStepIndex + 1} av {instructions.length}
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
                    />
                ) : (
                    <Button
                        title={isPaused ? 'Fortsett' : 'Pause'}
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
                title="Avslutt øvelse?"
                message="Er du sikker på at du vil avslutte? Fremgangen din vil gå tapt."
                confirmLabel="Avslutt"
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
        width: 40,
        height: 40,
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
    timerCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
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
