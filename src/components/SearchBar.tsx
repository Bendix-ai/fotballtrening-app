import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';
import { t } from '../lib/i18n';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    testID?: string;
}

export function SearchBar({ value, onChangeText, placeholder, testID }: SearchBarProps) {
    const resolvedPlaceholder = placeholder ?? `${t('common.search')}...`;
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MaterialIcons name="search" size={20} color={colors.textTertiary} />
            <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder={resolvedPlaceholder}
                placeholderTextColor={colors.textTertiary}
                value={value}
                onChangeText={onChangeText}
                accessibilityLabel={resolvedPlaceholder}
                accessibilityRole="search"
                testID={testID}
            />
            {value.length > 0 && (
                <TouchableOpacity
                    onPress={() => onChangeText('')}
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                >
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
