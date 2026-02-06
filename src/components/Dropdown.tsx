import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';

interface DropdownOption {
    value: string;
    label: string;
}

interface DropdownProps {
    label?: string;
    options: DropdownOption[];
    selectedValue: string | null;
    onValueChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export function Dropdown({
    label,
    options,
    selectedValue,
    onValueChange,
    placeholder = 'Velg...',
    error,
    containerStyle,
}: DropdownProps) {
    const { colors } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(o => o.value === selectedValue);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                    {label}
                </Text>
            )}
            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                style={[
                    styles.trigger,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error ? colors.error : colors.border,
                    },
                ]}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.triggerText,
                        {
                            color: selectedOption ? colors.text : colors.textTertiary,
                        },
                    ]}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            {error && (
                <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
            )}

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={[styles.dropdown, { backgroundColor: colors.card }]}>
                        {label && (
                            <Text style={[styles.dropdownTitle, { color: colors.text }]}>
                                {label}
                            </Text>
                        )}
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onValueChange(item.value);
                                        setIsOpen(false);
                                    }}
                                    style={[
                                        styles.option,
                                        {
                                            backgroundColor:
                                                item.value === selectedValue
                                                    ? colors.primaryLight
                                                    : 'transparent',
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            {
                                                color:
                                                    item.value === selectedValue
                                                        ? colors.primary
                                                        : colors.text,
                                                fontWeight:
                                                    item.value === selectedValue ? '600' : '400',
                                            },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                    {item.value === selectedValue && (
                                        <MaterialIcons name="check" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
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
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    triggerText: {
        fontSize: 16,
        flex: 1,
    },
    error: {
        fontSize: 12,
        marginTop: 4,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    dropdown: {
        borderRadius: 16,
        maxHeight: 400,
        paddingVertical: 8,
    },
    dropdownTitle: {
        fontSize: 16,
        fontWeight: '700',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    optionText: {
        fontSize: 16,
    },
});
