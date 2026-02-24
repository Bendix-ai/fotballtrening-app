import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Input, Button, useToast } from '../../components';
import { isSupabaseConfigured } from '../../lib/supabase';
import * as authService from '../../services/authService';

export function ChangePasswordScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { showToast } = useToast();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword.trim()) {
            setError(t('auth.enterCurrentPassword'));
            return;
        }
        if (newPassword.length < 6) {
            setError(t('auth.passwordMinLength'));
            return;
        }
        if (newPassword !== confirmPassword) {
            setError(t('auth.passwordMismatch'));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            if (isSupabaseConfigured()) {
                await authService.updatePassword(newPassword);
            }
            showToast(t('auth.passwordUpdated'), 'success');
            navigation.goBack();
        } catch (err: any) {
            setError(err?.message || t('common.error'));
        }

        setIsLoading(false);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {t('auth.changePassword')}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <Card style={styles.formCard}>
                        <Input
                            label={t('auth.currentPassword')}
                            value={currentPassword}
                            onChangeText={(text) => { setCurrentPassword(text); setError(''); }}
                            secureTextEntry
                            placeholder={t('auth.enterCurrentPassword')}
                        />
                        <Input
                            label={t('auth.newPassword')}
                            value={newPassword}
                            onChangeText={(text) => { setNewPassword(text); setError(''); }}
                            secureTextEntry
                            placeholder={t('auth.minChars')}
                        />
                        <Input
                            label={t('auth.confirmNewPassword')}
                            value={confirmPassword}
                            onChangeText={(text) => { setConfirmPassword(text); setError(''); }}
                            secureTextEntry
                            placeholder={t('auth.enterPasswordAgain')}
                        />

                        {error ? (
                            <Text style={[styles.error, { color: colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            title={t('common.save')}
                            onPress={handleChangePassword}
                            loading={isLoading}
                            fullWidth
                            size="large"
                            style={styles.saveButton}
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
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    formCard: {
        marginHorizontal: 20,
    },
    error: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
    },
    saveButton: {
        marginTop: 8,
    },
});
