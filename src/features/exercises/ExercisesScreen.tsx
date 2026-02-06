import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card } from '../../components';
import { ExerciseCategory, Difficulty, Exercise, ExercisesStackParamList } from '../../types';
import { mockExercises } from '../../data/mockData';
import { useExerciseStore } from '../../stores';

type ExercisesNavProp = NativeStackNavigationProp<ExercisesStackParamList, 'ExercisesList'>;

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
    const navigation = useNavigation<ExercisesNavProp>();
    const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const { toggleFavorite, isFavorite } = useExerciseStore();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const filteredExercises = mockExercises.filter((e) => {
        const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
        const matchesSearch = searchQuery.length === 0 ||
            e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds} ${t('exercises.seconds')}`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} ${t('exercises.minutes')}`;
    };

    const renderExercise = ({ item }: { item: Exercise }) => (
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.id })}>
            <Card style={styles.exerciseCard}>
                <View style={styles.exerciseContent}>
                    {/* Placeholder image */}
                    <View
                        style={[
                            styles.imagePlaceholder,
                            { backgroundColor: colors.primaryLight }
                        ]}
                    >
                        <MaterialIcons name="sports-soccer" size={28} color={colors.primary} />
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

                            <View style={styles.durationContainer}>
                                <MaterialIcons name="timer" size={14} color={colors.textTertiary} />
                                <Text style={[styles.duration, { color: colors.textTertiary }]}>
                                    {formatDuration(item.duration_seconds)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.pointsContainer}>
                        <TouchableOpacity
                            onPress={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.id);
                            }}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <MaterialIcons
                                name={isFavorite(item.id) ? 'favorite' : 'favorite-border'}
                                size={22}
                                color={isFavorite(item.id) ? colors.error : colors.textTertiary}
                            />
                        </TouchableOpacity>
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

            {/* Search Bar */}
            <View style={[styles.searchContainer, { paddingHorizontal: 20 }]}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <MaterialIcons name="search" size={20} color={colors.textTertiary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder={t('exercises.search')}
                        placeholderTextColor={colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialIcons name="close" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    )}
                </View>
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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
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
    searchContainer: {
        marginBottom: 4,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        height: '100%',
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
    durationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
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
