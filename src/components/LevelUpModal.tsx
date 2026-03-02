import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { playSound } from '../lib/sounds';
import { t } from '../lib/i18n';

interface LevelUpModalProps {
    visible: boolean;
    level: number;
    tierName: string;
    tierColor: string;
    onDismiss: () => void;
}

const NUM_PARTICLES = 15;
const PARTICLE_COLORS = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];

export function LevelUpModal({ visible, level, tierName, tierColor, onDismiss }: LevelUpModalProps) {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const particles = useRef(
        Array.from({ length: NUM_PARTICLES }, () => ({
            x: new Animated.Value(0),
            y: new Animated.Value(0),
            opacity: new Animated.Value(1),
            scale: new Animated.Value(0),
        }))
    ).current;

    useEffect(() => {
        if (!visible) return;

        // Sound and haptic feedback
        playSound('levelup');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Pulsating icon animation
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        // Spring text animation
        Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
        }).start();

        // Fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Confetti particles
        const particleAnimations = particles.map((p) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 100;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance + 80;

            return Animated.parallel([
                Animated.spring(p.scale, {
                    toValue: 1,
                    tension: 80,
                    friction: 5,
                    useNativeDriver: true,
                }),
                Animated.timing(p.x, {
                    toValue: targetX,
                    duration: 2500,
                    useNativeDriver: true,
                }),
                Animated.timing(p.y, {
                    toValue: targetY,
                    duration: 2500,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(1500),
                    Animated.timing(p.opacity, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ]);
        });
        Animated.stagger(40, particleAnimations).start();

        // Auto-dismiss after 4 seconds
        const timer = setTimeout(() => {
            onDismiss();
        }, 4000);

        return () => {
            clearTimeout(timer);
            pulse.stop();
        };
    }, [visible]);

    if (!visible) return null;

    // Map tier name to icon
    const tierIconMap: Record<string, string> = {
        bronze: 'shield',
        silver: 'verified',
        gold: 'military-tech',
    };
    const iconName = tierIconMap[tierName] ?? 'star';

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            testID="level-up-modal"
        >
            <TouchableWithoutFeedback onPress={onDismiss} testID="level-up-dismiss">
                <View style={styles.overlay}>
                    <View style={styles.content}>
                        {/* Confetti particles */}
                        {particles.map((p, i) => (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.particle,
                                    {
                                        backgroundColor: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
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

                        {/* Pulsating tier icon */}
                        <Animated.View
                            style={[
                                styles.iconContainer,
                                {
                                    backgroundColor: tierColor + '30',
                                    transform: [{ scale: pulseAnim }],
                                },
                            ]}
                        >
                            <MaterialIcons
                                name={iconName as keyof typeof MaterialIcons.glyphMap}
                                size={64}
                                color={tierColor}
                            />
                        </Animated.View>

                        {/* "NIVA OPP!" text with spring */}
                        <Animated.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }}
                        >
                            <Text style={styles.levelUpText}>
                                {t('home.levelUp')}
                            </Text>
                            <Text style={styles.levelText}>
                                {t('home.nowLevel', { level: String(level) })}
                            </Text>
                            <View style={[styles.tierBadge, { backgroundColor: tierColor + '30' }]}>
                                <Text style={[styles.tierText, { color: tierColor }]}>
                                    {tierName.toUpperCase()}
                                </Text>
                            </View>
                        </Animated.View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
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
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    levelUpText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: 8,
    },
    levelText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
    },
    tierBadge: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'center',
    },
    tierText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
    },
});
