import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { useTheme } from '../lib/theme';

interface LoadingSkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export function LoadingSkeleton({
    width = '100%',
    height = 16,
    borderRadius = 8,
    style,
}: LoadingSkeletonProps) {
    const { colors } = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    width: width as any,
                    height,
                    borderRadius,
                    backgroundColor: colors.border,
                    opacity,
                },
                style,
            ]}
        />
    );
}

interface SkeletonCardProps {
    style?: ViewStyle;
}

export function SkeletonCard({ style }: SkeletonCardProps) {
    const { colors } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
            <View style={styles.cardRow}>
                <LoadingSkeleton width={60} height={60} borderRadius={12} />
                <View style={styles.cardContent}>
                    <LoadingSkeleton width="70%" height={16} />
                    <LoadingSkeleton width="50%" height={12} style={styles.spacer} />
                    <LoadingSkeleton width="30%" height={10} style={styles.spacer} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        marginBottom: 12,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardContent: {
        flex: 1,
    },
    spacer: {
        marginTop: 6,
    },
});
