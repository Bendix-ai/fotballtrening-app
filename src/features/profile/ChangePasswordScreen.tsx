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

export function ChangePasswordScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { showToast } = useToast();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleChangePassword = () => {
        if (!currentPassword.trim()) {
            setError('Skriv inn nåværende passord');
            return;
        }
        if (newPassword.length < 6) {
            setError('Nytt passord må være minst 6 tegn');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passordene stemmer ikke overens');
            return;
        }

        // Mock success
        showToast('Passord endret!', 'success');
        navigation.goBack();
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
                            Endre passord
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <Card style={styles.formCard}>
                        <Input
                            label="Nåværende passord"
                            value={currentPassword}
                            onChangeText={(text) => { setCurrentPassword(text); setError(''); }}
                            secureTextEntry
                            placeholder="Skriv inn nåværende passord"
                        />
                        <Input
                            label="Nytt passord"
                            value={newPassword}
                            onChangeText={(text) => { setNewPassword(text); setError(''); }}
                            secureTextEntry
                            placeholder="Minst 6 tegn"
                        />
                        <Input
                            label="Bekreft nytt passord"
                            value={confirmPassword}
                            onChangeText={(text) => { setConfirmPassword(text); setError(''); }}
                            secureTextEntry
                            placeholder="Skriv inn passord på nytt"
                        />

                        {error ? (
                            <Text style={[styles.error, { color: colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            title={t('common.save')}
                            onPress={handleChangePassword}
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
