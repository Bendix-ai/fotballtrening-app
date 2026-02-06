import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { AdminHeader, SearchBar, Card, useToast } from '../../components';
import { AdminStackParamList, StoreExercise } from '../../types';
import { mockStoreExercises } from '../../data/mockData';

type StoreNavProp = NativeStackNavigationProp<AdminStackParamList>;

const getCategoryLabel = (category: string): string => {
    return t(`exercises.${category}`);
};

export function ExerciseStoreScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<StoreNavProp>();
    const { showToast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');

    const featured = mockStoreExercises.filter((e) => e.is_featured);
    const popular = [...mockStoreExercises].sort((a, b) => b.downloads - a.downloads).slice(0, 5);

    const allFiltered = searchQuery.length > 0
        ? mockStoreExercises.filter(
              (e) =>
                  e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  e.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : mockStoreExercises;

    const handleAddToClub = (exercise: StoreExercise) => {
        showToast(t('admin.addedToClub'), 'success');
    };

    const renderStoreCard = (exercise: StoreExercise, compact = false) => (
        <TouchableOpacity
            key={exercise.id}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ExerciseStoreDetail', { exerciseId: exercise.id })}
            style={compact ? styles.compactCard : undefined}
        >
            <Card style={compact ? styles.horizontalCard : styles.verticalCard}>
                <View style={[styles.cardIcon, { backgroundColor: colors.primaryLight }]}>
                    <MaterialIcons name="fitness-center" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                    {exercise.title}
                </Text>
                {!compact && (
                    <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                        {exercise.description}
                    </Text>
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
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <AdminHeader title={t('admin.exerciseStore')} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Search */}
                <View style={styles.searchContainer}>
                    <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Søk i butikken..." />
                </View>

                {searchQuery.length === 0 ? (
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
                            {mockStoreExercises.map((e) => renderStoreCard(e))}
                        </View>
                    </>
                ) : (
                    <View style={styles.section}>
                        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                            {allFiltered.length} resultater
                        </Text>
                        {allFiltered.map((e) => renderStoreCard(e))}
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
});
