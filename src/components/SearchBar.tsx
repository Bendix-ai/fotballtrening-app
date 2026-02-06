import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Søk...' }: SearchBarProps) {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialIcons name="search" size={20} color={colors.textTertiary} />
            <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                value={value}
                onChangeText={onChangeText}
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <MaterialIcons name="close" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        height: '100%',
    },
});
