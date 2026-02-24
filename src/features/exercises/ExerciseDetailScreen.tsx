import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Badge, Button } from '../../components';
import { ExercisesStackParamList } from '../../types';
import { useExercise, useExercises, useFavorites, useToggleFavorite } from '../../hooks/useExercises';
import { getCategoryIcon, getCategoryColor } from '../../lib/exerciseUtils';

type DetailRouteProp = RouteProp<ExercisesStackParamList, 'ExerciseDetail'>;
type DetailNavigationProp = NativeStackNavigationProp<ExercisesStackParamList, 'ExerciseDetail'>;

export function ExerciseDetailScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<DetailNavigationProp>();
    const route = useRoute<DetailRouteProp>();
    const { exerciseId } = route.params;

    const { data: exercise } = useExercise(exerciseId);
    const { data: allExercises = [] } = useExercises();
    const { data: favoriteIds = [] } = useFavorites();
    const toggleFavoriteMutation = useToggleFavorite();
    const favorited = exercise ? favoriteIds.includes(exercise.id) : false;

    const handleToggleFavorite = () => {
        if (exercise) {
            toggleFavoriteMutation.mutate({ exerciseId: exercise.id, isFavorite: favorited });
        }
    };

    if (!exercise) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>
                    Øvelse ikke funnet
                </Text>
            </SafeAreaView>
        );
    }

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds} ${t('exercises.seconds')}`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} ${t('exercises.minutes')}`;
    };

    const instructions = exercise.instructions.split('. ').filter(Boolean);

    const relatedExercises = allExercises
        .filter((e) => e.category === exercise.category && e.id !== exercise.id)
        .slice(0, 3);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Back button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    accessibilityRole="button"
                    accessibilityLabel={t('common.back')}
                >
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                {/* Favorite button */}
                <TouchableOpacity
                    onPress={handleToggleFavorite}
                    style={styles.favoriteButton}
                    accessibilityRole="button"
                    accessibilityLabel={favorited ? 'Remove from favorites' : 'Add to favorites'}
                    accessibilityState={{ selected: favorited }}
                    testID="exercise-favorite-button"
                >
                    <MaterialIcons
                        name={favorited ? 'favorite' : 'favorite-border'}
                        size={24}
                        color={favorited ? colors.error : colors.text}
                    />
                </TouchableOpacity>

                {/* Hero image placeholder */}
                <View style={[styles.heroImage, { backgroundColor: getCategoryColor(exercise.category) + '20' }]}>
                    <MaterialIcons
                        name={getCategoryIcon(exercise.category)}
                        size={80}
                        color={getCategoryColor(exercise.category)}
                    />
                </View>

                {/* Title & meta */}
                <View style={styles.titleSection}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {exercise.title}
                    </Text>
                    <View style={styles.metaRow}>
                        <Badge variant={exercise.difficulty} label={t(`exercises.${exercise.difficulty}`)} />
                        <View style={styles.metaItem}>
                            <MaterialIcons name="timer" size={16} color={colors.textSecondary} />
                            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                                {formatDuration(exercise.duration_seconds)}
                            </Text>
                        </View>
                        <Badge variant="points" label={`+${exercise.points} ${t('exercises.points')}`} />
                    </View>
                </View>

                {/* Equipment */}
                {exercise.equipment ? (
                    <View style={styles.equipmentRow}>
                        <MaterialIcons name="sports-soccer" size={16} color={colors.textSecondary} />
                        <Text style={[styles.equipmentText, { color: colors.textSecondary }]}>
                            Utstyr: {exercise.equipment}
                        </Text>
                    </View>
                ) : null}

                {/* Description */}
                <Card style={styles.descriptionCard}>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        {exercise.description}
                    </Text>
                </Card>

                {/* Instructions */}
                <View style={styles.instructionsSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {t('exercises.instructions')}
                    </Text>
                    {instructions.map((step, index) => (
                        <View key={index} style={styles.stepRow}>
                            <View style={[styles.stepNumber, { backgroundColor: colors.primaryLight }]}>
                                <Text style={[styles.stepNumberText, { color: colors.primary }]}>
                                    {index + 1}
                                </Text>
                            </View>
                            <Text style={[styles.stepText, { color: colors.text }]}>
                                {step.trim()}{step.endsWith('.') ? '' : '.'}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Related exercises */}
                {relatedExercises.length > 0 && (
                    <View style={styles.relatedSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Lignende øvelser
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.relatedList}
                        >
                            {relatedExercises.map((related) => (
                                <TouchableOpacity
                                    key={related.id}
                                    onPress={() => navigation.push('ExerciseDetail', { exerciseId: related.id })}
                                    activeOpacity={0.7}
                                    accessibilityRole="button"
                                    accessibilityLabel={`${related.title}, +${related.points} ${t('exercises.points')}`}
                                >
                                    <Card style={styles.relatedCard}>
                                        <View style={[styles.relatedIcon, { backgroundColor: getCategoryColor(related.category) + '20' }]}>
                                            <MaterialIcons
                                                name={getCategoryIcon(related.category)}
                                                size={24}
                                                color={getCategoryColor(related.category)}
                                            />
                                        </View>
                                        <Text
                                            style={[styles.relatedTitle, { color: colors.text }]}
                                            numberOfLines={2}
                                        >
                                            {related.title}
                                        </Text>
                                        <Text style={[styles.relatedPoints, { color: colors.primary }]}>
                                            +{related.points} {t('exercises.points')}
                                        </Text>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Spacer for fixed button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Fixed CTA */}
            <View style={[styles.ctaContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <Button
                    title={t('exercises.start')}
                    onPress={() => navigation.navigate('ExerciseExecution', { exerciseId: exercise.id })}
                    fullWidth
                    size="large"
                    testID="exercise-start-button"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroImage: {
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 14,
    },
    equipmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 20,
        marginTop: 16,
    },
    equipmentText: {
        fontSize: 14,
    },
    descriptionCard: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
    },
    instructionsSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'flex-start',
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepNumberText: {
        fontSize: 14,
        fontWeight: '700',
    },
    stepText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
    },
    relatedSection: {
        marginTop: 24,
        paddingLeft: 20,
    },
    relatedList: {
        gap: 12,
        paddingRight: 20,
    },
    relatedCard: {
        width: 150,
        alignItems: 'center',
        padding: 16,
    },
    relatedIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    relatedTitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    relatedPoints: {
        fontSize: 12,
        fontWeight: '600',
    },
    ctaContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 100,
    },
});
