import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input, Dropdown, useToast } from '../../components';
import { useAuthStore, useAppStore } from '../../stores';
import { User } from '../../types';
import { mockClubs, mockYearGroups, mockGenders } from '../../data/mockData';

export function LoginScreen() {
    const { colors } = useTheme();
    const { setUser, setClub } = useAuthStore();
    const { selectedClubId, setSelectedClubId } = useAppStore();
    const { showToast } = useToast();

    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    const clubOptions = mockClubs.map(c => ({ value: c.id, label: c.name }));

    const handleLogin = async () => {
        if (!isAdminLogin) {
            if (!selectedClubId) {
                setError(t('auth.selectClub'));
                return;
            }
            if (!selectedYear) {
                setError(t('auth.selectYear'));
                return;
            }
            if (!selectedGender) {
                setError(t('auth.selectGender'));
                return;
            }
        }
        if (!username.trim() || !password.trim()) {
            setError('Fyll inn brukernavn og passord');
            return;
        }

        setIsLoading(true);
        setError('');

        // Simulate login delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (isAdminLogin) {
            const adminUser: User = {
                id: 'admin1',
                username: username,
                role: 'admin',
                club_id: '1',
                team_id: null,
                display_name: username,
                avatar_url: null,
                total_points: 0,
                current_streak: 0,
                longest_streak: 0,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
            };
            setUser(adminUser);
            setClub(mockClubs[0]);
        } else {
            const selectedClub = mockClubs.find(c => c.id === selectedClubId);

            const mockUser: User = {
                id: '4',
                username: username,
                role: 'player',
                club_id: selectedClubId!,
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
            if (selectedClub) {
                setClub(selectedClub);
            }
        }

        setIsLoading(false);
    };

    const handleForgotPassword = () => {
        showToast('Kontakt treneren din for a fa nytt passord', 'info');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <MaterialIcons name="sports-soccer" size={64} color={colors.primary} />
                        <Text style={[styles.title, { color: colors.text }]}>
                            FotballTrening
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            {t('auth.welcomeBack')}
                        </Text>
                    </View>

                    {/* Admin/Player Toggle */}
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            onPress={() => { setIsAdminLogin(false); setError(''); }}
                            style={[
                                styles.toggleButton,
                                {
                                    backgroundColor: !isAdminLogin ? colors.primary : colors.surface,
                                    borderColor: !isAdminLogin ? colors.primary : colors.border,
                                },
                            ]}
                        >
                            <Text style={[styles.toggleText, { color: !isAdminLogin ? '#ffffff' : colors.textSecondary }]}>
                                Spiller
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setIsAdminLogin(true); setError(''); }}
                            style={[
                                styles.toggleButton,
                                {
                                    backgroundColor: isAdminLogin ? colors.primary : colors.surface,
                                    borderColor: isAdminLogin ? colors.primary : colors.border,
                                },
                            ]}
                        >
                            <Text style={[styles.toggleText, { color: isAdminLogin ? '#ffffff' : colors.textSecondary }]}>
                                Admin
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Form */}
                    <Card style={styles.formCard}>
                        {!isAdminLogin && (
                            <>
                                <Dropdown
                                    label={t('auth.selectClub')}
                                    options={clubOptions}
                                    selectedValue={selectedClubId}
                                    onValueChange={(value) => {
                                        setSelectedClubId(value);
                                        setError('');
                                    }}
                                    placeholder="Velg klubb..."
                                />

                                <Dropdown
                                    label={t('auth.selectYear')}
                                    options={mockYearGroups}
                                    selectedValue={selectedYear}
                                    onValueChange={(value) => {
                                        setSelectedYear(value);
                                        setError('');
                                    }}
                                    placeholder="Velg argang..."
                                />

                                <Dropdown
                                    label={t('auth.selectGender')}
                                    options={mockGenders}
                                    selectedValue={selectedGender}
                                    onValueChange={(value) => {
                                        setSelectedGender(value);
                                        setError('');
                                    }}
                                    placeholder="Velg kjonn..."
                                />
                            </>
                        )}

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
                            placeholder="Passord"
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

                        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                                {t('auth.forgotPassword')}
                            </Text>
                        </TouchableOpacity>
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
    keyboardView: {
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
        fontSize: 32,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    toggleContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
    },
    toggleText: {
        fontSize: 15,
        fontWeight: '600',
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
    forgotPassword: {
        alignItems: 'center',
        marginTop: 16,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
