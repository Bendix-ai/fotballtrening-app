import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input, Dropdown, useToast } from '../../components';
import { useAuthStore } from '../../stores';
import { useExercise, useCreateExercise, useUpdateExercise } from '../../hooks/useExercises';
import { AdminStackParamList, ExerciseCategory, Difficulty } from '../../types';

type EditExerciseRoute = RouteProp<AdminStackParamList, 'AddEditExercise'>;

const categoryOptions = [
    { value: 'warmup', label: 'Oppvarming' },
    { value: 'strength', label: 'Styrke' },
    { value: 'agility', label: 'Hurtighet' },
    { value: 'skill', label: 'Teknikk' },
    { value: 'cooldown', label: 'Nedtrapping' },
];

const difficultyOptions = [
    { value: 'easy', label: 'Lett' },
    { value: 'medium', label: 'Middels' },
    { value: 'hard', label: 'Vanskelig' },
];

const getPointsForDifficulty = (difficulty: Difficulty | null): number => {
    switch (difficulty) {
        case 'easy': return 10;
        case 'medium': return 20;
        case 'hard': return 30;
        default: return 0;
    }
};

export function AddEditExerciseScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<EditExerciseRoute>();
    const { showToast } = useToast();
    const { user } = useAuthStore();

    const exerciseId = route.params?.exerciseId;
    const { data: existingExercise, isLoading: loadingExercise } = useExercise(exerciseId ?? '');
    const createExerciseMutation = useCreateExercise();
    const updateExerciseMutation = useUpdateExercise();
    const isEditing = !!exerciseId && !!existingExercise;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<string | null>(null);
    const [duration, setDuration] = useState('');
    const [instructions, setInstructions] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [populatedId, setPopulatedId] = useState<string | null>(null);

    // Populate form when exercise data loads or changes
    React.useEffect(() => {
        if (existingExercise && existingExercise.id !== populatedId) {
            setTitle(existingExercise.title);
            setDescription(existingExercise.description);
            setCategory(existingExercise.category);
            setDifficulty(existingExercise.difficulty);
            setDuration(String(existingExercise.duration_seconds));
            setInstructions(existingExercise.instructions ?? '');
            setPopulatedId(existingExercise.id);
        }
    }, [existingExercise, populatedId]);

    const points = getPointsForDifficulty(difficulty as Difficulty | null);

    const handleSave = async () => {
        if (!title.trim()) {
            setError('Fyll inn tittel');
            return;
        }
        if (!description.trim()) {
            setError('Fyll inn beskrivelse');
            return;
        }
        if (!category) {
            setError('Velg kategori');
            return;
        }
        if (!difficulty) {
            setError('Velg vanskelighetsgrad');
            return;
        }
        if (!duration.trim() || isNaN(Number(duration))) {
            setError('Fyll inn gyldig varighet i sekunder');
            return;
        }
        if (!instructions.trim()) {
            setError('Fyll inn instruksjoner');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const exerciseData = {
                title: title.trim(),
                description: description.trim(),
                instructions: instructions.trim(),
                category: category as ExerciseCategory,
                difficulty: difficulty as Difficulty,
                duration_seconds: parseInt(duration),
                points,
                image_url: null,
                video_url: null,
                is_public: false,
                created_by_club_id: user?.club_id ?? '',
                equipment: '',
            };

            if (isEditing && existingExercise) {
                await updateExerciseMutation.mutateAsync({ id: existingExercise.id, updates: exerciseData });
                showToast('Øvelse oppdatert', 'success');
            } else {
                await createExerciseMutation.mutateAsync(exerciseData);
                showToast('Øvelse opprettet', 'success');
            }

            navigation.goBack();
        } catch (err: any) {
            setError(err?.message || 'Kunne ikke lagre øvelsen');
        }

        setIsLoading(false);
    };

    if (exerciseId && loadingExercise) {
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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        {isEditing ? t('admin.editExercise') : t('admin.addExercise')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Card style={styles.formCard}>
                        <Input
                            label={t('admin.title')}
                            value={title}
                            onChangeText={(text) => { setTitle(text); setError(''); }}
                            placeholder="Øvelsens tittel"
                            testID="exercise-title-input"
                        />

                        <Input
                            label={t('admin.description')}
                            value={description}
                            onChangeText={(text) => { setDescription(text); setError(''); }}
                            placeholder="Kort beskrivelse av øvelsen"
                            multiline
                            numberOfLines={3}
                            testID="exercise-description-input"
                        />

                        <Dropdown
                            label={t('admin.category')}
                            options={categoryOptions}
                            selectedValue={category}
                            onValueChange={(value) => { setCategory(value); setError(''); }}
                            placeholder="Velg kategori..."
                            testID="exercise-category-dropdown"
                        />

                        <Dropdown
                            label={t('admin.difficulty')}
                            options={difficultyOptions}
                            selectedValue={difficulty}
                            onValueChange={(value) => { setDifficulty(value); setError(''); }}
                            placeholder="Velg vanskelighetsgrad..."
                            testID="exercise-difficulty-dropdown"
                        />

                        <Input
                            label={`${t('admin.duration')} (${t('exercises.seconds')})`}
                            value={duration}
                            onChangeText={(text) => { setDuration(text); setError(''); }}
                            placeholder="f.eks. 180"
                            keyboardType="numeric"
                            testID="exercise-duration-input"
                        />

                        <View style={styles.pointsRow}>
                            <Text style={[styles.pointsLabel, { color: colors.textSecondary }]}>
                                {t('admin.points')}:
                            </Text>
                            <Text style={[styles.pointsValue, { color: colors.primary }]}>
                                {points > 0 ? points : '-'}
                            </Text>
                        </View>

                        <Input
                            label={t('admin.instructions')}
                            value={instructions}
                            onChangeText={(text) => { setInstructions(text); setError(''); }}
                            placeholder="Steg-for-steg instruksjoner"
                            multiline
                            numberOfLines={5}
                            testID="exercise-instructions-input"
                        />

                        {error ? (
                            <Text style={[styles.error, { color: colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            title={isEditing ? t('common.save') : t('admin.addExercise')}
                            onPress={handleSave}
                            loading={isLoading}
                            fullWidth
                            size="large"
                            style={styles.saveButton}
                            testID="save-exercise-button"
                        />
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    formCard: {
        marginBottom: 24,
    },
    pointsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        paddingVertical: 8,
    },
    pointsLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    pointsValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    error: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'center',
    },
    saveButton: {
        marginTop: 8,
    },
});
