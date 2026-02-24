import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { AdminHeader, SearchBar, Card, Badge, useToast } from '../../components';
import { AdminStackParamList, StoreExercise, ExerciseCategory, Difficulty } from '../../types';
import { useStoreExercises, useDownloadExercise, useDownloadStarterPack } from '../../hooks/useStore';
import { getCategoryIcon, getCategoryColor } from '../../lib/exerciseUtils';

type StoreNavProp = NativeStackNavigationProp<AdminStackParamList>;

const categoryFilters: (ExerciseCategory | 'all')[] = ['all', 'warmup', 'strength', 'agility', 'skill', 'cooldown'];
const difficultyFilters: (Difficulty | 'all')[] = ['all', 'easy', 'medium', 'hard'];

export function ExerciseStoreScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<StoreNavProp>();
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
    const { data: storeExercises = [] } = useStoreExercises();
    const downloadMutation = useDownloadExercise();
    const starterPackMutation = useDownloadStarterPack();

    const featured = storeExercises.filter((e) => e.is_featured);
    const popular = [...storeExercises].sort((a, b) => b.downloads - a.downloads).slice(0, 5);

    const isFiltering = searchQuery.length > 0 || selectedCategory !== 'all' || selectedDifficulty !== 'all';

    const filteredExercises = useMemo(() => {
        return storeExercises.filter((e) => {
            const matchesSearch = searchQuery.length === 0 ||
                e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
            const matchesDifficulty = selectedDifficulty === 'all' || e.difficulty === selectedDifficulty;
            return matchesSearch && matchesCategory && matchesDifficulty;
        });
    }, [storeExercises, searchQuery, selectedCategory, selectedDifficulty]);

    const handleAddToClub = (exercise: StoreExercise) => {
        downloadMutation.mutate(exercise.id, {
            onSuccess: () => showToast(t('admin.addedToClub'), 'success'),
            onError: () => showToast(t('common.error'), 'error'),
        });
    };

    const handleStarterPack = () => {
        starterPackMutation.mutate(undefined, {
            onSuccess: (count) => showToast(`${t('admin.starterPackImported')} (${count})`, 'success'),
            onError: () => showToast(t('common.error'), 'error'),
        });
    };

    const renderStoreCard = (exercise: StoreExercise, compact = false) => (
        <TouchableOpacity
            key={exercise.id}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ExerciseStoreDetail', { exerciseId: exercise.id })}
            style={compact ? styles.compactCard : undefined}
            testID="store-exercise-card"
        >
            <Card style={compact ? styles.horizontalCard : styles.verticalCard}>
                <View style={[styles.cardIcon, { backgroundColor: getCategoryColor(exercise.category) + '18' }]}>
                    <MaterialIcons name={getCategoryIcon(exercise.category)} size={24} color={getCategoryColor(exercise.category)} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                    {exercise.title}
                </Text>
                {!compact && (
                    <>
                        <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                            {exercise.description}
                        </Text>
                        <View style={styles.badgeRow}>
                            <Badge variant={exercise.difficulty} label={t(`exercises.${exercise.difficulty}`)} />
                            <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(exercise.category) + '18' }]}>
                                <Text style={[styles.categoryTagText, { color: getCategoryColor(exercise.category) }]}>
                                    {t(`exercises.${exercise.category}`)}
                                </Text>
                            </View>
                        </View>
                    </>
                )}
                <View style={styles.ratingRow}>
                    <MaterialIcons name="star" size={14} color={colors.accent} />
                    <Text style={[styles.ratingText, { color: colors.text }]}>{exercise.rating}</Text>
                    <Text style={[styles.downloadsText, { color: colors.textTertiary }]}>
                        {exercise.downloads} {t('admin.downloads').toLowerCase()}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => handleAddToClub(exercise)}
                    style={[styles.addButton, { backgroundColor: colors.primary }]}
                >
                    <MaterialIcons name="add" size={16} color="#ffffff" />
                    <Text style={styles.addButtonText}>{t('admin.addToClub')}</Text>
                </TouchableOpacity>
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
            <AdminHeader title={t('admin.exerciseStore')} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Search */}
                <View style={styles.searchContainer}>
                    <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Søk i butikken..." />
                </View>

                {/* Starter Pack Button */}
                <TouchableOpacity
                    style={[styles.starterPackButton, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}
                    onPress={handleStarterPack}
                    disabled={starterPackMutation.isPending}
                    testID="store-starter-pack-button"
                >
                    <MaterialIcons name="download" size={20} color={colors.primary} />
                    <View style={styles.starterPackText}>
                        <Text style={[styles.starterPackTitle, { color: colors.primary }]}>
                            {t('admin.importStarterPack')}
                        </Text>
                        <Text style={[styles.starterPackDesc, { color: colors.textSecondary }]}>
                            {t('admin.starterPackDesc')}
                        </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
                </TouchableOpacity>

                {/* Category Filter */}
                <FlatList
                    horizontal
                    data={categoryFilters}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(item)}
                            style={[
                                styles.filterChip,
                                {
                                    backgroundColor: selectedCategory === item ? colors.primary : colors.surface,
                                    borderColor: selectedCategory === item ? colors.primary : colors.border,
                                },
                            ]}
                            testID={`store-category-chip-${item}`}
                        >
                            <Text style={[
                                styles.filterText,
                                { color: selectedCategory === item ? '#ffffff' : colors.textSecondary },
                            ]}>
                                {item === 'all' ? t('exercises.all') : t(`exercises.${item}`)}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* Difficulty Filter */}
                <FlatList
                    horizontal
                    data={difficultyFilters}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.filterList, { marginBottom: 16 }]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedDifficulty(item)}
                            style={[
                                styles.filterChip,
                                {
                                    backgroundColor: selectedDifficulty === item ? colors.accent : colors.surface,
                                    borderColor: selectedDifficulty === item ? colors.accent : colors.border,
                                },
                            ]}
                            testID={`store-difficulty-chip-${item}`}
                        >
                            <Text style={[
                                styles.filterText,
                                { color: selectedDifficulty === item ? '#ffffff' : colors.textSecondary },
                            ]}>
                                {item === 'all' ? t('exercises.all') : t(`exercises.${item}`)}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {!isFiltering ? (
                    <>
                        {/* Featured */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                {t('admin.featured')}
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalList}
                            >
                                {featured.map((e) => renderStoreCard(e, true))}
                            </ScrollView>
                        </View>

                        {/* Popular */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                {t('admin.popular')}
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalList}
                            >
                                {popular.map((e) => renderStoreCard(e, true))}
                            </ScrollView>
                        </View>

                        {/* All Exercises */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                {t('admin.allExercises')}
                            </Text>
                            {storeExercises.map((e) => renderStoreCard(e))}
                        </View>
                    </>
                ) : (
                    <View style={styles.section}>
                        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                            {filteredExercises.length} resultater
                        </Text>
                        {filteredExercises.map((e) => renderStoreCard(e))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    horizontalList: {
        paddingHorizontal: 20,
        gap: 12,
    },
    compactCard: {
        width: 180,
    },
    horizontalCard: {
        width: 180,
        padding: 14,
    },
    verticalCard: {
        marginHorizontal: 20,
        marginBottom: 12,
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        marginBottom: 8,
        lineHeight: 18,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 10,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '600',
    },
    downloadsText: {
        fontSize: 12,
        marginLeft: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        gap: 4,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
    },
    resultCount: {
        fontSize: 13,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 8,
    },
    categoryTag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    categoryTagText: {
        fontSize: 11,
        fontWeight: '600',
    },
    starterPackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    starterPackText: {
        flex: 1,
        marginLeft: 12,
    },
    starterPackTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    starterPackDesc: {
        fontSize: 12,
        marginTop: 2,
    },
    filterList: {
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 8,
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '500',
    },
});
