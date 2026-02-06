import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../lib/theme';

type BadgeVariant = 'easy' | 'medium' | 'hard' | 'category' | 'points' | 'custom';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    color?: string;
    backgroundColor?: string;
    size?: 'small' | 'medium';
    style?: ViewStyle;
}

export function Badge({
    label,
    variant = 'custom',
    color,
    backgroundColor,
    size = 'medium',
    style,
}: BadgeProps) {
    const { colors } = useTheme();

    const getColors = () => {
        if (color && backgroundColor) return { text: color, bg: backgroundColor };
        switch (variant) {
            case 'easy':
                return { text: '#2E7D32', bg: '#E8F5E9' };
            case 'medium':
                return { text: '#F57C00', bg: '#FFF3E0' };
            case 'hard':
                return { text: '#C62828', bg: '#FFEBEE' };
            case 'category':
                return { text: '#1976D2', bg: '#E3F2FD' };
            case 'points':
                return { text: '#F57C00', bg: '#FFF8E1' };
            default:
                return { text: colors.textSecondary, bg: colors.surface };
        }
    };

    const badgeColors = getColors();
    const isSmall = size === 'small';

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: badgeColors.bg,
                    paddingHorizontal: isSmall ? 6 : 8,
                    paddingVertical: isSmall ? 2 : 4,
                },
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color: badgeColors.text,
                        fontSize: isSmall ? 10 : 12,
                    },
                ]}
            >
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    text: {
        fontWeight: '600',
    },
});
