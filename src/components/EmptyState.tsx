import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';
import { Button } from './Button';

interface EmptyStateProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    style?: ViewStyle;
}

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    style,
}: EmptyStateProps) {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                <MaterialIcons name={icon} size={48} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
                {description}
            </Text>
            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    onPress={onAction}
                    style={styles.button}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 48,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    button: {
        marginTop: 24,
    },
});
