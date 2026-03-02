import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MascotState } from '../types';

interface MascotProps {
    state: MascotState;
    size?: number;
}

const mascotConfig: Record<MascotState, { icon: keyof typeof MaterialIcons.glyphMap; color: string; bgColor: string }> = {
    happy: { icon: 'sports-soccer', color: '#FFFFFF', bgColor: '#4CAF50' },
    impressed: { icon: 'star', color: '#FFFFFF', bgColor: '#FFD700' },
    cheering: { icon: 'celebration', color: '#FFFFFF', bgColor: '#FF9800' },
    thinking: { icon: 'psychology', color: '#FFFFFF', bgColor: '#2196F3' },
    training: { icon: 'fitness-center', color: '#FFFFFF', bgColor: '#4CAF50' },
    worried: { icon: 'warning', color: '#FFFFFF', bgColor: '#FF9800' },
};

export function Mascot({ state, size = 48 }: MascotProps) {
    const config = mascotConfig[state];
    const iconSize = size * 0.55;

    return (
        <View
            testID="mascot"
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: config.bgColor,
                },
            ]}
        >
            <MaterialIcons name={config.icon} size={iconSize} color={config.color} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
