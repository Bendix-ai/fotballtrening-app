import React from 'react';
import {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { useTheme } from '../lib/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    fullWidth = false,
    style,
    textStyle,
}: ButtonProps) {
    const { colors, isDark } = useTheme();

    const getBackgroundColor = () => {
        if (disabled) return colors.border;
        switch (variant) {
            case 'primary':
                return colors.primary;
            case 'secondary':
                return colors.accent;
            case 'outline':
            case 'ghost':
                return 'transparent';
            default:
                return colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return colors.textTertiary;
        switch (variant) {
            case 'primary':
            case 'secondary':
                return '#ffffff';
            case 'outline':
                return colors.primary;
            case 'ghost':
                return colors.text;
            default:
                return '#ffffff';
        }
    };

    const getBorderColor = () => {
        if (variant === 'outline') return colors.primary;
        return 'transparent';
    };

    const getPadding = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'large':
                return { paddingVertical: 16, paddingHorizontal: 32 };
            default:
                return { paddingVertical: 12, paddingHorizontal: 24 };
        }
    };

    const getFontSize = () => {
        switch (size) {
            case 'small':
                return 14;
            case 'large':
                return 18;
            default:
                return 16;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    ...getPadding(),
                },
                fullWidth && styles.fullWidth,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text
                        style={[
                            styles.text,
                            {
                                color: getTextColor(),
                                fontSize: getFontSize(),
                                marginLeft: icon ? 8 : 0,
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 2,
    },
    fullWidth: {
        width: '100%',
    },
    text: {
        fontWeight: '600',
    },
});
