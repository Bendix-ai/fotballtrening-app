import React from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../lib/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    icon?: React.ReactNode;
}

export function Input({
    label,
    error,
    containerStyle,
    icon,
    ...props
}: InputProps) {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error ? colors.error : colors.border,
                    },
                ]}
            >
                {icon && <View style={styles.icon}>{icon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        { color: colors.text },
                        icon && styles.inputWithIcon,
                    ]}
                    placeholderTextColor={colors.textTertiary}
                    {...props}
                />
            </View>
            {error && (
                <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 14,
    },
    inputWithIcon: {
        paddingLeft: 0,
    },
    error: {
        fontSize: 12,
        marginTop: 4,
    },
});
