import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../lib/theme';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    style?: ViewStyle;
    padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({
    children,
    title,
    subtitle,
    style,
    padding = 'medium',
}: CardProps) {
    const { colors } = useTheme();

    const getPadding = () => {
        switch (padding) {
            case 'none':
                return 0;
            case 'small':
                return 12;
            case 'large':
                return 24;
            default:
                return 16;
        }
    };

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    padding: getPadding(),
                },
                style,
            ]}
        >
            {(title || subtitle) && (
                <View style={styles.header}>
                    {title && (
                        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    )}
                    {subtitle && (
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            )}
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    header: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
});
