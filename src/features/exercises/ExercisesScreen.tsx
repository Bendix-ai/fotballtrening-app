import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, SkeletonCard } from '../../components';
import { ExerciseCategory, Difficulty, Exercise, ExercisesStackParamList } from '../../types';
import { useExercises, useFavorites, useToggleFavorite, useTodayCompletions } from '../../hooks/useExercises';
import { useAuthStore } from '../../stores';
import { getCategoryIcon, getCategoryColor } from '../../lib/exerciseUtils';
import * as Haptics from 'expo-haptics';

type ExercisesNavProp = NativeStackNavigationProp<ExercisesStackParamList, 'ExercisesList'>;

function AnimatedListItem({ children, index }: { children: React.ReactNode; index: number }) {
    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(anim, {
            toValue: 1,
            duration: 350,
            delay: Math.min(index * 60, 300),
            useNativeDriver: true,
        }).start();
    }, []);
    return (
        <Animated.View style={{
            opacity: anim,
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        }}>
            {children}
        </Animated.View>
    );
}

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
    const { user } = useAuthStore();
    const { data: allExercisesRaw = [], refetch, isLoading: exercisesLoading } = useExercises();

    // Filter exercises by team assignment: show exercises with no team restriction or assigned to player's team
    const allExercises = useMemo(() => {
        if (!user || user.role === 'admin') return allExercisesRaw;
        const teamId = user.team_id;
        return allExercisesRaw.filter((e) => {
            if (!e.assigned_team_ids || e.assigned_team_ids.length === 0) return true;
            return teamId ? e.assigned_team_ids.includes(teamId) : true;
        });
    }, [allExercisesRaw, user]);
    const { data: favoriteIds = [] } = useFavorites();
    const { data: todayCompletions = [] } = useTodayCompletions();
    const toggleFavoriteMutation = useToggleFavorite();

    const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
    const completedTodaySet = useMemo(
        () => new Set(todayCompletions.map((c) => c.exercise_id)),
        [todayCompletions]
    );
    const isFavorite = useCallback((id: string) => favoriteSet.has(id), [favoriteSet]);
    const favoriteScales = useRef<Record<string, Animated.Value>>({}).current;

    const getFavoriteScale = useCallback((id: string) => {
        if (!favoriteScales[id]) {
            favoriteScales[id] = new Animated.Value(1);
        }
        return favoriteScales[id];
    }, [favoriteScales]);

    const handleToggleFavorite = useCallback((id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const scale = getFavoriteScale(id);
        Animated.sequence([
            Animated.timing(scale, { toValue: 1.4, duration: 100, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, tension: 100, friction: 5, useNativeDriver: true }),
        ]).start();
        toggleFavoriteMutation.mutate({ exerciseId: id, isFavorite: favoriteSet.has(id) });
    }, [toggleFavoriteMutation, favoriteSet, getFavoriteScale]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch().finally(() => setRefreshing(false));
    }, [refetch]);

    const filteredExercises = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return allExercises.filter((e) => {
            const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
            const matchesSearch = query.length === 0 ||
                e.title.toLowerCase().includes(query) ||
                e.description.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [allExercises, selectedCategory, searchQuery]);

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds} ${t('exercises.seconds')}`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} ${t('exercises.minutes')}`;
    };

    const renderExercise = useCallback(({ item, index }: { item: Exercise; index: number }) => (
        <AnimatedListItem index={index}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: item.id })} testID="exercise-card">
            <Card style={styles.exerciseCard}>
                <View style={styles.exerciseContent}>
                    {/* Category icon */}
                    <View style={styles.iconWrapper}>
                        <View
                            style={[
                                styles.imagePlaceholder,
                                { backgroundColor: getCategoryColor(item.category) + '18' }
                            ]}
                        >
                            <MaterialIcons name={getCategoryIcon(item.category)} size={28} color={getCategoryColor(item.category)} />
                        </View>
                        {completedTodaySet.has(item.id) && (
                            <View style={[styles.completedBadge, { backgroundColor: colors.success }]}>
                                <MaterialIcons name="check" size={12} color="#ffffff" />
                            </View>
                        )}
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
                                handleToggleFavorite(item.id);
                            }}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        >
                            <Animated.View style={{ transform: [{ scale: getFavoriteScale(item.id) }] }}>
                                <MaterialIcons
                                    name={isFavorite(item.id) ? 'favorite' : 'favorite-border'}
                                    size={22}
                                    color={isFavorite(item.id) ? colors.error : colors.textTertiary}
                                />
                            </Animated.View>
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
        </AnimatedListItem>
    ), [colors, navigation, isFavorite, handleToggleFavorite, completedTodaySet]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    {t('exercises.title')}
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Challenges')}
                    style={[styles.challengesButton, { backgroundColor: colors.secondary + '18' }]}
                    testID="challenges-button"
                >
                    <MaterialIcons name="sports-kabaddi" size={20} color={colors.secondary} />
                </TouchableOpacity>
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
            {exercisesLoading ? (
                <View style={styles.list}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <SkeletonCard key={i} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={filteredExercises}
                    keyExtractor={(item) => item.id}
                    renderItem={renderExercise}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                    }
                />
            )}
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
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    challengesButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
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
    iconWrapper: {
        position: 'relative',
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completedBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
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
