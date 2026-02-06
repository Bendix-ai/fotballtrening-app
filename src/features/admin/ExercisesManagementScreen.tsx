import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { AdminHeader, SearchBar, Card, Badge } from '../../components';
import { useAdminStore } from '../../stores';
import { AdminStackParamList, Exercise, ExerciseCategory } from '../../types';

type ExercisesNavProp = NativeStackNavigationProp<AdminStackParamList>;

const categoryFilters: (ExerciseCategory | null)[] = [null, 'warmup', 'strength', 'agility', 'skill', 'cooldown'];

const getCategoryLabel = (cat: ExerciseCategory | null): string => {
    if (!cat) return t('exercises.all');
    return t(`exercises.${cat}`);
};

const getDifficultyLabel = (diff: string): string => {
    return t(`exercises.${diff}`);
};

const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    if (mins > 0) return `${mins} min`;
    return `${seconds}s`;
};

export function ExercisesManagementScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<ExercisesNavProp>();
    const { getFilteredExercises, exerciseCategoryFilter, setExerciseCategoryFilter, deleteExercise } = useAdminStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const allExercises = getFilteredExercises();
    const filteredExercises = searchQuery.length > 0
        ? allExercises.filter(
              (e) =>
                  e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  e.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : allExercises;

    const handleDelete = (exercise: Exercise) => {
        Alert.alert(
            t('admin.deleteExercise'),
            `Er du sikker på at du vil slette "${exercise.title}"?`,
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: () => deleteExercise(exercise.id),
                },
            ]
        );
    };

    const renderExercise = ({ item }: { item: Exercise }) => (
        <Card style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
                <Text style={[styles.exerciseTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                </Text>
            </View>
            <View style={styles.badgeRow}>
                <Badge label={getCategoryLabel(item.category)} variant="category" size="small" />
                <Badge label={getDifficultyLabel(item.difficulty)} variant={item.difficulty} size="small" />
            </View>
            <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                    <MaterialIcons name="timer" size={14} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {formatDuration(item.duration_seconds)}
                    </Text>
                </View>
                <View style={styles.metaItem}>
                    <MaterialIcons name="star" size={14} color={colors.textSecondary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {item.points} {t('exercises.points')}
                    </Text>
                </View>
            </View>
            <View style={styles.actionRow}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AddEditExercise', { exerciseId: item.id })}
                    style={styles.actionButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <MaterialIcons name="edit" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    style={styles.actionButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <MaterialIcons name="delete" size={20} color={colors.error} />
                </TouchableOpacity>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <AdminHeader title={t('admin.exercises')} />

            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={`${t('exercises.search')}`}
                />
            </View>

            {/* Category filter chips */}
            <View style={styles.filterRow}>
                {categoryFilters.map((cat) => (
                    <TouchableOpacity
                        key={cat ?? 'all'}
                        onPress={() => setExerciseCategoryFilter(cat)}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor: exerciseCategoryFilter === cat ? colors.primary : colors.surface,
                                borderColor: exerciseCategoryFilter === cat ? colors.primary : colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                { color: exerciseCategoryFilter === cat ? '#ffffff' : colors.textSecondary },
                            ]}
                        >
                            {getCategoryLabel(cat)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                renderItem={renderExercise}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="fitness-center" size={48} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            Ingen øvelser funnet
                        </Text>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity
                onPress={() => navigation.navigate('AddEditExercise', {})}
                style={[styles.fab, { backgroundColor: colors.primary }]}
            >
                <MaterialIcons name="add" size={28} color="#ffffff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 8,
        marginTop: 8,
        marginBottom: 4,
        flexWrap: 'wrap',
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '500',
    },
    list: {
        padding: 20,
        paddingBottom: 100,
    },
    exerciseCard: {
        marginBottom: 10,
    },
    exerciseHeader: {
        marginBottom: 8,
    },
    exerciseTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 13,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E0E0E0',
        paddingTop: 8,
    },
    actionButton: {
        padding: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
