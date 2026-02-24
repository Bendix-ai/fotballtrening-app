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
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Badge, useToast } from '../../components';
import { AdminStackParamList } from '../../types';
import { useStoreExercise, useStoreReviews, useDownloadExercise } from '../../hooks/useStore';

type DetailRoute = RouteProp<AdminStackParamList, 'ExerciseStoreDetail'>;

export function ExerciseStoreDetailScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<DetailRoute>();
    const { showToast } = useToast();
    const { exerciseId } = route.params;

    const { data: exercise } = useStoreExercise(exerciseId);
    const { data: reviews = [] } = useStoreReviews(exerciseId);
    const downloadMutation = useDownloadExercise();

    if (!exercise) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>Øvelse ikke funnet</Text>
            </SafeAreaView>
        );
    }

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds} ${t('exercises.seconds')}`;
        return `${Math.floor(seconds / 60)} ${t('exercises.minutes')}`;
    };

    const handleAddToClub = () => {
        downloadMutation.mutate(exerciseId, {
            onSuccess: () => showToast(t('admin.addedToClub'), 'success'),
            onError: () => showToast(t('common.error'), 'error'),
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Back button */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} testID="store-back-button">
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                {/* Hero */}
                <View style={[styles.hero, { backgroundColor: colors.primaryLight }]}>
                    <MaterialIcons name="fitness-center" size={64} color={colors.primary} />
                </View>

                {/* Title & meta */}
                <View style={styles.titleSection}>
                    <Text style={[styles.title, { color: colors.text }]}>{exercise.title}</Text>
                    <Text style={[styles.author, { color: colors.textSecondary }]}>
                        {t('admin.by')} {exercise.author}
                    </Text>
                    <View style={styles.metaRow}>
                        <Badge variant={exercise.difficulty} label={t(`exercises.${exercise.difficulty}`)} />
                        <View style={styles.metaItem}>
                            <MaterialIcons name="timer" size={14} color={colors.textSecondary} />
                            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                                {formatDuration(exercise.duration_seconds)}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <MaterialIcons name="star" size={14} color={colors.accent} />
                            <Text style={[styles.metaText, { color: colors.text }]}>
                                {exercise.rating}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{exercise.downloads}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('admin.downloads')}</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.accent }]}>{exercise.rating}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('admin.rating')}</Text>
                    </Card>
                    <Card style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.success }]}>+{exercise.points}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('exercises.points')}</Text>
                    </Card>
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
                <Card style={styles.descCard}>
                    <Text style={[styles.description, { color: colors.text }]}>{exercise.description}</Text>
                </Card>

                {/* Instructions */}
                {exercise.instructions ? (
                    <View style={styles.instructionsSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('exercises.instructions')}
                        </Text>
                        {exercise.instructions.split('. ').filter(Boolean).map((step, index) => (
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
                ) : null}

                {/* Reviews */}
                {reviews.length > 0 && (
                    <View style={styles.reviewsSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {t('admin.reviews')} ({reviews.length})
                        </Text>
                        {reviews.map((review) => (
                            <Card key={review.id} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <Text style={[styles.reviewClub, { color: colors.text }]}>{review.club_name}</Text>
                                    <View style={styles.reviewStars}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <MaterialIcons
                                                key={i}
                                                name={i < review.rating ? 'star' : 'star-border'}
                                                size={14}
                                                color={colors.accent}
                                            />
                                        ))}
                                    </View>
                                </View>
                                <Text style={[styles.reviewComment, { color: colors.textSecondary }]}>
                                    {review.comment}
                                </Text>
                                <Text style={[styles.reviewDate, { color: colors.textTertiary }]}>
                                    {new Date(review.created_at).toLocaleDateString('nb-NO')}
                                </Text>
                            </Card>
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Fixed CTA */}
            <View style={[styles.ctaContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <Button
                    title={t('admin.addToClub')}
                    onPress={handleAddToClub}
                    fullWidth
                    size="large"
                    testID="store-download-button"
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
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hero: {
        height: 180,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    author: {
        fontSize: 14,
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
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginTop: 20,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
        marginTop: 4,
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
    descCard: {
        marginHorizontal: 20,
        marginTop: 16,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
    },
    instructionsSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    stepNumber: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginTop: 2,
    },
    stepNumberText: {
        fontSize: 13,
        fontWeight: '700',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    reviewsSection: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    reviewCard: {
        marginBottom: 10,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewClub: {
        fontSize: 14,
        fontWeight: '600',
    },
    reviewStars: {
        flexDirection: 'row',
    },
    reviewComment: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    reviewDate: {
        fontSize: 12,
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
