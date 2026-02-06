import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../lib/theme';

interface ProgressBarProps {
    progress: number; // 0 to 1
    color?: string;
    backgroundColor?: string;
    height?: number;
    style?: ViewStyle;
}

export function ProgressBar({
    progress,
    color,
    backgroundColor,
    height = 4,
    style,
}: ProgressBarProps) {
    const { colors } = useTheme();
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: backgroundColor || colors.border,
                    height,
                    borderRadius: height / 2,
                },
                style,
            ]}
        >
            <View
                style={[
                    styles.fill,
                    {
                        backgroundColor: color || colors.primary,
                        width: `${clampedProgress * 100}%`,
                        height,
                        borderRadius: height / 2,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    fill: {
        position: 'absolute',
        left: 0,
        top: 0,
    },
});
