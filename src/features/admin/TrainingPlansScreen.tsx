import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { AdminHeader, Card, Button, useToast } from '../../components';
import { useActivePlan, useCreatePlan, useUpdatePlan } from '../../hooks/useTrainingPlans';
import { useExercises } from '../../hooks/useExercises';
import { Exercise, TrainingPlanDay } from '../../types';
import { getCategoryIcon, getCategoryColor } from '../../lib/exerciseUtils';

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;

interface DayPlan {
    day_of_week: number;
    exercise_ids: string[];
}

export function TrainingPlansScreen() {
    const { colors } = useTheme();
    const { showToast } = useToast();

    const { data: activePlanData, isLoading } = useActivePlan();
    const { data: exercises = [] } = useExercises();
    const createMutation = useCreatePlan();
    const updateMutation = useUpdatePlan();

    // Local state for editing: 5 days (Mon-Fri), each with exercise IDs
    const [dayPlans, setDayPlans] = useState<DayPlan[]>(
        DAY_KEYS.map((_, i) => ({ day_of_week: i, exercise_ids: [] }))
    );

    // Modal state for exercise picker
    const [pickerVisible, setPickerVisible] = useState(false);
    const [pickerDayIndex, setPickerDayIndex] = useState<number>(0);

    // Sync from fetched data
    useEffect(() => {
        if (activePlanData?.days) {
            const newDayPlans: DayPlan[] = DAY_KEYS.map((_, i) => {
                const existing = activePlanData.days.find((d) => d.day_of_week === i);
                return {
                    day_of_week: i,
                    exercise_ids: existing?.exercise_ids ?? [],
                };
            });
            setDayPlans(newDayPlans);
        }
    }, [activePlanData]);

    const exerciseMap = useMemo(() => {
        const map: Record<string, Exercise> = {};
        for (const ex of exercises) {
            map[ex.id] = ex;
        }
        return map;
    }, [exercises]);

    const handleAddExercise = (dayIndex: number) => {
        setPickerDayIndex(dayIndex);
        setPickerVisible(true);
    };

    const handleSelectExercise = (exerciseId: string) => {
        setDayPlans((prev) => {
            const updated = [...prev];
            const day = { ...updated[pickerDayIndex] };
            if (!day.exercise_ids.includes(exerciseId)) {
                day.exercise_ids = [...day.exercise_ids, exerciseId];
            }
            updated[pickerDayIndex] = day;
            return updated;
        });
        setPickerVisible(false);
    };

    const handleRemoveExercise = (dayIndex: number, exerciseId: string) => {
        setDayPlans((prev) => {
            const updated = [...prev];
            const day = { ...updated[dayIndex] };
            day.exercise_ids = day.exercise_ids.filter((id) => id !== exerciseId);
            updated[dayIndex] = day;
            return updated;
        });
    };

    const handleSave = async () => {
        const daysToSave: Omit<TrainingPlanDay, 'id' | 'plan_id'>[] = dayPlans
            .filter((d) => d.exercise_ids.length > 0)
            .map((d) => ({
                day_of_week: d.day_of_week,
                exercise_ids: d.exercise_ids,
            }));

        try {
            if (activePlanData?.plan) {
                await updateMutation.mutateAsync({
                    planId: activePlanData.plan.id,
                    days: daysToSave,
                });
            } else {
                await createMutation.mutateAsync(daysToSave);
            }
            showToast(t('admin.planSaved'), 'success');
        } catch {
            showToast(t('common.error'), 'error');
        }
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
                <AdminHeader title={t('admin.trainingPlans')} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
            <AdminHeader title={t('admin.trainingPlans')} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {t('admin.weeklyPlan')}
                </Text>

                {DAY_KEYS.map((dayKey, dayIndex) => {
                    const dayPlan = dayPlans[dayIndex];
                    const dayExercises = dayPlan.exercise_ids
                        .map((id) => exerciseMap[id])
                        .filter(Boolean);

                    return (
                        <Card key={dayKey} style={styles.dayCard}>
                            <Text style={[styles.dayTitle, { color: colors.text }]}>
                                {t(`admin.${dayKey}`)}
                            </Text>

                            {dayExercises.length > 0 ? (
                                dayExercises.map((exercise) => (
                                    <View key={exercise.id} style={styles.exerciseRow}>
                                        <View style={[styles.exerciseIcon, { backgroundColor: getCategoryColor(exercise.category) + '18' }]}>
                                            <MaterialIcons
                                                name={getCategoryIcon(exercise.category)}
                                                size={16}
                                                color={getCategoryColor(exercise.category)}
                                            />
                                        </View>
                                        <Text
                                            style={[styles.exerciseName, { color: colors.text }]}
                                            numberOfLines={1}
                                        >
                                            {exercise.title}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => handleRemoveExercise(dayIndex, exercise.id)}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                            testID={`remove-exercise-${dayIndex}-${exercise.id}`}
                                        >
                                            <MaterialIcons name="close" size={18} color={colors.textTertiary} />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            ) : null}

                            <TouchableOpacity
                                style={[styles.addButton, { borderColor: colors.border }]}
                                onPress={() => handleAddExercise(dayIndex)}
                                testID={`add-exercise-day-${dayIndex}`}
                            >
                                <MaterialIcons name="add" size={18} color={colors.primary} />
                                <Text style={[styles.addButtonText, { color: colors.primary }]}>
                                    {t('admin.addExerciseToDay')}
                                </Text>
                            </TouchableOpacity>
                        </Card>
                    );
                })}

                <Button
                    title={t('common.save')}
                    onPress={handleSave}
                    fullWidth
                    size="large"
                    loading={isSaving}
                    testID="save-training-plan-button"
                />
            </ScrollView>

            {/* Exercise Picker Modal */}
            <Modal
                visible={pickerVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setPickerVisible(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            {t('admin.selectExercise')}
                        </Text>
                        <Button
                            title={t('common.cancel')}
                            variant="ghost"
                            size="small"
                            onPress={() => setPickerVisible(false)}
                        />
                    </View>

                    <FlatList
                        data={exercises}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.pickerList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                                onPress={() => handleSelectExercise(item.id)}
                                testID={`picker-exercise-${item.id}`}
                            >
                                <View style={[styles.pickerIcon, { backgroundColor: getCategoryColor(item.category) + '18' }]}>
                                    <MaterialIcons
                                        name={getCategoryIcon(item.category)}
                                        size={20}
                                        color={getCategoryColor(item.category)}
                                    />
                                </View>
                                <View style={styles.pickerInfo}>
                                    <Text style={[styles.pickerTitle, { color: colors.text }]}>
                                        {item.title}
                                    </Text>
                                    <Text style={[styles.pickerMeta, { color: colors.textSecondary }]}>
                                        {t(`exercises.${item.category}`)} · {item.points} {t('exercises.points')}
                                    </Text>
                                </View>
                                <MaterialIcons name="add-circle-outline" size={22} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
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
        paddingBottom: 40,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 16,
    },
    dayCard: {
        marginBottom: 16,
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    exerciseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    exerciseIcon: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    exerciseName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 10,
        marginTop: 4,
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    pickerList: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    pickerIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    pickerTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    pickerMeta: {
        fontSize: 13,
        marginTop: 2,
    },
});
