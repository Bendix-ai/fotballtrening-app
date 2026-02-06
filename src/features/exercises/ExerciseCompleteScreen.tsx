import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button } from '../../components';
import { ExercisesStackParamList } from '../../types';
import { mockExercises } from '../../data/mockData';
import { useExerciseStore } from '../../stores/exerciseStore';
import { useAuthStore } from '../../stores';

type CompleteRouteProp = RouteProp<ExercisesStackParamList, 'ExerciseComplete'>;
type CompleteNavigationProp = NativeStackNavigationProp<ExercisesStackParamList, 'ExerciseComplete'>;

export function ExerciseCompleteScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<CompleteNavigationProp>();
    const route = useRoute<CompleteRouteProp>();
    const { exerciseId, pointsEarned } = route.params;
    const { addCompletion } = useExerciseStore();
    const { user } = useAuthStore();

    const exercise = mockExercises.find((e) => e.id === exerciseId);

    const { width: screenWidth } = Dimensions.get('window');

    // Celebration particles
    const NUM_PARTICLES = 12;
    const particles = useRef(
        Array.from({ length: NUM_PARTICLES }, () => ({
            x: new Animated.Value(0),
            y: new Animated.Value(0),
            opacity: new Animated.Value(1),
            scale: new Animated.Value(0),
        }))
    ).current;

    const particleColors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

    // Animation
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Record the completion
        addCompletion({
            id: `${Date.now()}`,
            user_id: user?.id ?? 'unknown',
            exercise_id: exerciseId,
            points_earned: pointsEarned,
            completed_at: new Date().toISOString(),
        });

        // Run entrance animation
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();

        // Celebration particle burst
        const particleAnimations = particles.map((p) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 120;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance - 50;

            return Animated.sequence([
                Animated.delay(300),
                Animated.parallel([
                    Animated.spring(p.scale, {
                        toValue: 1,
                        tension: 80,
                        friction: 5,
                        useNativeDriver: true,
                    }),
                    Animated.timing(p.x, {
                        toValue: targetX,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(p.y, {
                        toValue: targetY,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.sequence([
                        Animated.delay(500),
                        Animated.timing(p.opacity, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
            ]);
        });

        Animated.stagger(50, particleAnimations).start();
    }, []);

    const handleContinue = () => {
        navigation.popToTop();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* Celebration particles */}
                {particles.map((p, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.particle,
                            {
                                backgroundColor: particleColors[i % particleColors.length],
                                transform: [
                                    { translateX: p.x },
                                    { translateY: p.y },
                                    { scale: p.scale },
                                ],
                                opacity: p.opacity,
                            },
                        ]}
                    />
                ))}

                {/* Animated checkmark */}
                <Animated.View
                    style={[
                        styles.checkCircle,
                        {
                            backgroundColor: colors.success + '20',
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={[styles.checkInner, { backgroundColor: colors.success }]}>
                        <MaterialIcons name="check" size={60} color="#FFFFFF" />
                    </View>
                </Animated.View>

                {/* Heading */}
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={[styles.heading, { color: colors.text }]}>
                        {t('exercises.greatJob')}
                    </Text>
                    <Text style={[styles.subheading, { color: colors.textSecondary }]}>
                        {exercise?.title ?? 'Øvelse'} {t('exercises.completed').toLowerCase()}
                    </Text>
                </Animated.View>

                {/* Points earned */}
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Card style={styles.pointsCard}>
                        <MaterialIcons name="star" size={32} color={colors.primary} />
                        <Text style={[styles.pointsValue, { color: colors.primary }]}>
                            +{pointsEarned}
                        </Text>
                        <Text style={[styles.pointsLabel, { color: colors.textSecondary }]}>
                            {t('exercises.points')}
                        </Text>
                    </Card>
                </Animated.View>
            </View>

            {/* Continue button */}
            <View style={styles.buttonContainer}>
                <Button
                    title={t('exercises.backToExercises')}
                    onPress={handleContinue}
                    fullWidth
                    size="large"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    particle: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    checkCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    checkInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    pointsCard: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 48,
    },
    pointsValue: {
        fontSize: 48,
        fontWeight: '700',
        marginTop: 8,
    },
    pointsLabel: {
        fontSize: 16,
        marginTop: 4,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
});
