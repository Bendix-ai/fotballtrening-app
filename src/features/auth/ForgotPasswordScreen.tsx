import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input } from '../../components';
import * as authService from '../../services/authService';
import { RootStackParamList } from '../../types';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<ForgotPasswordNavigationProp>();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleSendReset = async () => {
        if (!email.trim()) {
            setError('Fyll inn e-postadresse');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.sendPasswordResetEmail(email.trim());
            setEmailSent(true);
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
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={[styles.title, { color: colors.text }]}>
                            {t('auth.forgotPasswordTitle')}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <Card style={styles.formCard}>
                        {emailSent ? (
                            <View style={styles.successContainer}>
                                <MaterialIcons name="mark-email-read" size={64} color={colors.success} />
                                <Text style={[styles.successTitle, { color: colors.text }]}>
                                    {t('auth.resetEmailSent')}
                                </Text>
                                <Text style={[styles.successDesc, { color: colors.textSecondary }]}>
                                    {t('auth.resetEmailSentDesc')}
                                </Text>
                                <Button
                                    title={t('auth.backToLogin')}
                                    onPress={() => navigation.goBack()}
                                    fullWidth
                                    size="large"
                                    style={styles.button}
                                />
                            </View>
                        ) : (
                            <>
                                <Text style={[styles.description, { color: colors.textSecondary }]}>
                                    {t('auth.forgotPasswordDesc')}
                                </Text>

                                <Input
                                    label="E-post"
                                    value={email}
                                    onChangeText={(text) => { setEmail(text); setError(''); }}
                                    placeholder="din@epost.no"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                />

                                {error ? (
                                    <Text style={[styles.error, { color: colors.error }]}>
                                        {error}
                                    </Text>
                                ) : null}

                                <Button
                                    title={t('auth.sendResetLink')}
                                    onPress={handleSendReset}
                                    loading={isLoading}
                                    fullWidth
                                    size="large"
                                    style={styles.button}
                                />

                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    style={styles.backLink}
                                >
                                    <Text style={[styles.backLinkText, { color: colors.primary }]}>
                                        {t('auth.backToLogin')}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
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
    description: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16,
    },
    error: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
    },
    button: {
        marginTop: 8,
    },
    backLink: {
        alignItems: 'center',
        marginTop: 16,
    },
    backLinkText: {
        fontSize: 14,
        fontWeight: '500',
    },
    successContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    successTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    successDesc: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 24,
    },
});
