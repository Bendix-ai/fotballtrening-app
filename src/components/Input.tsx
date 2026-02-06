import React, { useState } from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
    ViewStyle,
    TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
    secureTextEntry,
    ...props
}: InputProps) {
    const { colors } = useTheme();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isPassword = secureTextEntry !== undefined;

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
                        icon ? styles.inputWithIcon : undefined,
                    ]}
                    placeholderTextColor={colors.textTertiary}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.toggleButton}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <MaterialIcons
                            name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                            size={20}
                            color={colors.textTertiary}
                        />
                    </TouchableOpacity>
                )}
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
    toggleButton: {
        paddingLeft: 8,
    },
    error: {
        fontSize: 12,
        marginTop: 4,
    },
});
