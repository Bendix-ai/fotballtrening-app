import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input } from '../../components';
import { useAuthStore } from '../../stores';
import { User } from '../../types';

export function LoginScreen() {
    const { colors } = useTheme();
    const { setUser, setClub } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setError('Fyll inn brukernavn og passord');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate login delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For demo purposes, accept any login
        // In production, this would call Supabase auth
        const mockUser: User = {
            id: '1',
            username: username,
            role: 'player',
            club_id: '1',
            team_id: '1',
            display_name: username,
            avatar_url: null,
            total_points: 390,
            current_streak: 5,
            longest_streak: 12,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
        };

        setUser(mockUser);
        setClub({
            id: '1',
            name: 'Våganes IL',
            logo_url: null,
            created_by: '1',
            created_at: new Date().toISOString(),
        });

        setIsLoading(false);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logo}>⚽</Text>
                        <Text style={[styles.title, { color: colors.text }]}>
                            FotballTrening
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            {t('auth.welcomeBack')}
                        </Text>
                    </View>

                    {/* Login Form */}
                    <Card style={styles.formCard}>
                        <Input
                            label={t('auth.username')}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                setError('');
                            }}
                            placeholder="Brukernavn"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label={t('auth.password')}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setError('');
                            }}
                            placeholder="••••••••"
                            secureTextEntry
                        />

                        {error ? (
                            <Text style={[styles.error, { color: colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            title={t('auth.loginButton')}
                            onPress={handleLogin}
                            loading={isLoading}
                            fullWidth
                            size="large"
                            style={styles.loginButton}
                        />
                    </Card>

                    {/* Club Info */}
                    <View style={styles.clubInfo}>
                        <Text style={[styles.clubLabel, { color: colors.textTertiary }]}>
                            Klubb:
                        </Text>
                        <TouchableOpacity>
                            <Text style={[styles.clubName, { color: colors.primary }]}>
                                Våganes IL • Gutter 2015
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    formCard: {
        marginBottom: 24,
    },
    error: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'center',
    },
    loginButton: {
        marginTop: 8,
    },
    clubInfo: {
        alignItems: 'center',
    },
    clubLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    clubName: {
        fontSize: 16,
        fontWeight: '600',
    },
});
