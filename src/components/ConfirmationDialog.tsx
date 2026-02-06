import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useTheme } from '../lib/theme';
import { Button } from './Button';

interface ConfirmationDialogProps {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    destructive?: boolean;
}

export function ConfirmationDialog({
    visible,
    title,
    message,
    confirmLabel = 'OK',
    cancelLabel = 'Avbryt',
    onConfirm,
    onCancel,
    destructive = false,
}: ConfirmationDialogProps) {
    const { colors } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onCancel}
            >
                <View
                    style={[styles.dialog, { backgroundColor: colors.card }]}
                    onStartShouldSetResponder={() => true}
                >
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.message, { color: colors.textSecondary }]}>
                        {message}
                    </Text>
                    <View style={styles.actions}>
                        <Button
                            title={cancelLabel}
                            onPress={onCancel}
                            variant="ghost"
                            style={styles.actionButton}
                        />
                        <Button
                            title={confirmLabel}
                            onPress={onConfirm}
                            variant="primary"
                            style={{
                                ...styles.actionButton,
                                ...(destructive ? { backgroundColor: colors.error } : {}),
                            }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    dialog: {
        width: '100%',
        borderRadius: 16,
        padding: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    actionButton: {
        minWidth: 80,
    },
});
