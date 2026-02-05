import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card } from '../../components';
import { ExerciseCategory, Difficulty, Exercise } from '../../types';

// Placeholder exercises
const mockExercises: Exercise[] = [
    {
        id: '1',
        title: 'Oppvarming med ball',
        description: 'Let oppvarming med fotball',
        instructions: 'Start med lett jogging mens du dribler ballen.',
        image_url: null,
        video_url: null,
        duration_seconds: 120,
        difficulty: 'easy',
        category: 'warmup',
        points: 10,
        is_public: true,
        created_by_club_id: null,
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Styrkeøvelse: Knebøy',
        description: 'Bygg styrke i beina',
        instructions: 'Utfør 3 sett med 15 knebøy.',
        image_url: null,
        video_url: null,
        duration_seconds: 180,
        difficulty: 'medium',
        category: 'strength',
        points: 20,
        is_public: true,
        created_by_club_id: null,
        created_at: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Hurtighet: Sprintøvelser',
        description: 'Forbedre akselerasjonen din',
        instructions: 'Sprint 20 meter, gå tilbake. Gjenta 8 ganger.',
        image_url: null,
        video_url: null,
        duration_seconds: 240,
        difficulty: 'hard',
        category: 'agility',
        points: 25,
        is_public: true,
        created_by_club_id: null,
        created_at: new Date().toISOString(),
    },
    {
        id: '4',
        title: 'Teknikk: Pasninger',
        description: 'Øv på presise pasninger',
        instructions: 'Tren pasninger mot vegg på 5-10 meters avstand.',
        image_url: null,
        video_url: null,
        duration_seconds: 300,
        difficulty: 'medium',
        category: 'skill',
        points: 15,
        is_public: true,
        created_by_club_id: null,
        created_at: new Date().toISOString(),
    },
    {
        id: '5',
        title: 'Nedtrapping: Stretch',
        description: 'Tøy ut etter trening',
        instructions: 'Tøy alle hovedmuskelgrupper i 30 sekunder hver.',
        image_url: null,
        video_url: null,
        duration_seconds: 300,
        difficulty: 'easy',
        category: 'cooldown',
        points: 10,
        is_public: true,
        created_by_club_id: null,
        created_at: new Date().toISOString(),
    },
];

const categories: (ExerciseCategory | 'all')[] = [
    'all',
    'warmup',
    'strength',
    'agility',
    'skill',
    'cooldown',
];

const getCategoryLabel = (category: ExerciseCategory | 'all'): string => {
    if (category === 'all') return t('exercises.all');
    return t(`exercises.${category}`);
};

const getDifficultyColor = (difficulty: Difficulty, colors: any) => {
    switch (difficulty) {
        case 'easy':
            return colors.success;
        case 'medium':
            return colors.warning;
        case 'hard':
            return colors.error;
    }
};

export function ExercisesScreen() {
    const { colors } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');

    const filteredExercises = selectedCategory === 'all'
        ? mockExercises
        : mockExercises.filter(e => e.category === selectedCategory);

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds} ${t('exercises.seconds')}`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} ${t('exercises.minutes')}`;
    };

    const renderExercise = ({ item }: { item: Exercise }) => (
        <TouchableOpacity activeOpacity={0.7}>
            <Card style={styles.exerciseCard}>
                <View style={styles.exerciseContent}>
                    {/* Placeholder image */}
                    <View
                        style={[
                            styles.imagePlaceholder,
                            { backgroundColor: colors.primaryLight }
                        ]}
                    >
                        <Text style={styles.imageEmoji}>⚽</Text>
                    </View>

                    <View style={styles.exerciseInfo}>
                        <Text style={[styles.exerciseTitle, { color: colors.text }]}>
                            {item.title}
                        </Text>
                        <Text style={[styles.exerciseDesc, { color: colors.textSecondary }]}>
                            {item.description}
                        </Text>

                        <View style={styles.exerciseMeta}>
                            <View
                                style={[
                                    styles.difficultyBadge,
                                    { backgroundColor: getDifficultyColor(item.difficulty, colors) + '20' }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.difficultyText,
                                        { color: getDifficultyColor(item.difficulty, colors) }
                                    ]}
                                >
                                    {t(`exercises.${item.difficulty}`)}
                                </Text>
                            </View>

                            <Text style={[styles.duration, { color: colors.textTertiary }]}>
                                ⏱️ {formatDuration(item.duration_seconds)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.pointsContainer}>
                        <Text style={[styles.points, { color: colors.primary }]}>
                            +{item.points}
                        </Text>
                        <Text style={[styles.pointsLabel, { color: colors.textSecondary }]}>
                            {t('exercises.points')}
                        </Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    {t('exercises.title')}
                </Text>
            </View>

            {/* Category Filter */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(item)}
                            style={[
                                styles.filterChip,
                                {
                                    backgroundColor: selectedCategory === item
                                        ? colors.primary
                                        : colors.surface,
                                    borderColor: selectedCategory === item
                                        ? colors.primary
                                        : colors.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    {
                                        color: selectedCategory === item
                                            ? '#ffffff'
                                            : colors.textSecondary,
                                    },
                                ]}
                            >
                                {getCategoryLabel(item)}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Exercise List */}
            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                renderItem={renderExercise}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
    },
    filterContainer: {
        marginVertical: 12,
    },
    filterList: {
        paddingHorizontal: 20,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
    },
    list: {
        padding: 20,
        paddingBottom: 100,
    },
    exerciseCard: {
        marginBottom: 16,
    },
    exerciseContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageEmoji: {
        fontSize: 28,
    },
    exerciseInfo: {
        flex: 1,
        marginLeft: 12,
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    exerciseDesc: {
        fontSize: 13,
        marginTop: 2,
    },
    exerciseMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 12,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    difficultyText: {
        fontSize: 11,
        fontWeight: '600',
    },
    duration: {
        fontSize: 12,
    },
    pointsContainer: {
        alignItems: 'center',
        marginLeft: 12,
    },
    points: {
        fontSize: 20,
        fontWeight: '700',
    },
    pointsLabel: {
        fontSize: 11,
    },
});
