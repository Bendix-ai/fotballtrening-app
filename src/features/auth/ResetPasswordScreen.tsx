import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input, useToast } from '../../components';
import { useAuthStore } from '../../stores';
import * as authService from '../../services/authService';

export function ResetPasswordScreen() {
    const { colors } = useTheme();
    const { showToast } = useToast();
    const { clearPasswordRecovery, logout } = useAuthStore();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        if (newPassword.length < 6) {
            setError('Passord må være minst 6 tegn');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError(t('auth.passwordMismatch'));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.updatePassword(newPassword);
            showToast(t('auth.passwordUpdated'), 'success');
            clearPasswordRecovery();
            await logout();
        } catch (err: any) {
            setError(err?.message || 'Noe gikk galt');
        }

        setIsLoading(false);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <MaterialIcons name="lock-reset" size={64} color={colors.primary} />
                        <Text style={[styles.title, { color: colors.text }]}>
                            {t('auth.resetPassword')}
                        </Text>
                        <Text style={[styles.description, { color: colors.textSecondary }]}>
                            {t('auth.resetPasswordDesc')}
                        </Text>
                    </View>

                    <Card style={styles.formCard}>
                        <Input
                            label={t('auth.password')}
                            value={newPassword}
                            onChangeText={(text) => { setNewPassword(text); setError(''); }}
                            placeholder="Minst 6 tegn"
                            secureTextEntry
                        />

                        <Input
                            label={t('auth.confirmPassword')}
                            value={confirmPassword}
                            onChangeText={(text) => { setConfirmPassword(text); setError(''); }}
                            placeholder="Bekreft passord"
                            secureTextEntry
                        />

                        {error ? (
                            <Text style={[styles.error, { color: colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            title={t('auth.resetPassword')}
                            onPress={handleResetPassword}
                            loading={isLoading}
                            fullWidth
                            size="large"
                            style={styles.button}
                        />
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        paddingVertical: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },
    formCard: {
        marginBottom: 24,
    },
    error: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
    },
    button: {
        marginTop: 8,
    },
});
