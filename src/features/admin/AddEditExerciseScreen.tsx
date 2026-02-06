import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input, Dropdown, useToast } from '../../components';
import { useAdminStore } from '../../stores';
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
    const { clubExercises, addExercise, updateExercise } = useAdminStore();

    const exerciseId = route.params?.exerciseId;
    const existingExercise = exerciseId ? clubExercises.find((e) => e.id === exerciseId) : null;
    const isEditing = !!existingExercise;

    const [title, setTitle] = useState(existingExercise?.title ?? '');
    const [description, setDescription] = useState(existingExercise?.description ?? '');
    const [category, setCategory] = useState<string | null>(existingExercise?.category ?? null);
    const [difficulty, setDifficulty] = useState<string | null>(existingExercise?.difficulty ?? null);
    const [duration, setDuration] = useState(existingExercise ? String(existingExercise.duration_seconds) : '');
    const [instructions, setInstructions] = useState(existingExercise?.instructions ?? '');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

        await new Promise((resolve) => setTimeout(resolve, 500));

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
            created_by_club_id: '1',
        };

        if (isEditing && existingExercise) {
            updateExercise(existingExercise.id, exerciseData);
            showToast('Øvelse oppdatert', 'success');
        } else {
            addExercise({
                id: `ex${Date.now()}`,
                ...exerciseData,
                created_at: new Date().toISOString(),
            });
            showToast('Øvelse opprettet', 'success');
        }

        setIsLoading(false);
        navigation.goBack();
    };

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
                        />

                        <Input
                            label={t('admin.description')}
                            value={description}
                            onChangeText={(text) => { setDescription(text); setError(''); }}
                            placeholder="Kort beskrivelse av øvelsen"
                            multiline
                            numberOfLines={3}
                        />

                        <Dropdown
                            label={t('admin.category')}
                            options={categoryOptions}
                            selectedValue={category}
                            onValueChange={(value) => { setCategory(value); setError(''); }}
                            placeholder="Velg kategori..."
                        />

                        <Dropdown
                            label={t('admin.difficulty')}
                            options={difficultyOptions}
                            selectedValue={difficulty}
                            onValueChange={(value) => { setDifficulty(value); setError(''); }}
                            placeholder="Velg vanskelighetsgrad..."
                        />

                        <Input
                            label={`${t('admin.duration')} (${t('exercises.seconds')})`}
                            value={duration}
                            onChangeText={(text) => { setDuration(text); setError(''); }}
                            placeholder="f.eks. 180"
                            keyboardType="numeric"
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
