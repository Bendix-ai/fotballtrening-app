import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input, Dropdown, useToast } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore, useAppStore } from '../../stores';
import { isSupabaseConfigured } from '../../lib/supabase';
import * as authService from '../../services/authService';
import * as clubService from '../../services/clubService';
import { Club, Gender, RootStackParamList } from '../../types';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function LoginScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<LoginNavigationProp>();
    const { setUser, setClub, setTeam, setManagedTeamIds } = useAuthStore();
    const { selectedClubId, setSelectedClubId } = useAppStore();
    const { showToast } = useToast();

    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    // Dynamic data from Supabase
    const [clubs, setClubs] = useState<{ value: string; label: string }[]>([]);
    const [yearGroups, setYearGroups] = useState<{ value: string; label: string }[]>([]);
    const [genderOptions, setGenderOptions] = useState<{ value: string; label: string }[]>([]);
    const [teamMap, setTeamMap] = useState<Record<string, string>>({});
    const [loadingClubs, setLoadingClubs] = useState(true);

    // Load clubs on mount
    useEffect(() => {
        loadClubs();
    }, []);

    // Load year groups when club changes
    useEffect(() => {
        if (selectedClubId) {
            loadYearGroups(selectedClubId);
        } else {
            setYearGroups([]);
        }
        setSelectedYear(null);
        setSelectedGender(null);
        setSelectedTeamId(null);
    }, [selectedClubId]);

    // Load teams (genders) when year group changes
    useEffect(() => {
        if (selectedYear) {
            loadTeams(selectedYear);
        } else {
            setGenderOptions([]);
        }
        setSelectedGender(null);
        setSelectedTeamId(null);
    }, [selectedYear]);

    const loadClubs = async () => {
        setLoadingClubs(true);
        try {
            const data = await clubService.getClubs();
            const clubOptions = data.map((c: Club) => ({ value: c.id, label: c.name }));
            setClubs(clubOptions);

            // Clear stale selectedClubId if it doesn't match any real club
            if (selectedClubId && !clubOptions.some(c => c.value === selectedClubId)) {
                setSelectedClubId(null);
            }
        } catch (err) {
            console.error('Error loading clubs:', err);
        }
        setLoadingClubs(false);
    };

    const loadYearGroups = async (clubId: string) => {
        try {
            const data = await clubService.getYearGroups(clubId);
            setYearGroups(data);
        } catch (err) {
            console.error('Error loading year groups:', err);
        }
    };

    const loadTeams = async (yearGroupId: string) => {
        try {
            const data = await clubService.getTeams(yearGroupId);
            setGenderOptions(data.map(t => ({ value: t.value, label: t.label })));
            const map: Record<string, string> = {};
            data.forEach(t => { map[t.value] = t.teamId; });
            setTeamMap(map);
        } catch (err) {
            console.error('Error loading teams:', err);
        }
    };

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

        try {
            if (isSupabaseConfigured()) {
                if (isAdminLogin) {
                    const { session } = await authService.loginAdmin(username, password);
                    if (session?.user) {
                        const profile = await authService.getProfile(session.user.id);
                        if (profile) {
                            setUser(profile.user);
                            setClub(profile.club);
                            setTeam(profile.team);
                            setManagedTeamIds(profile.managedTeamIds);
                        } else {
                            setError('Kunne ikke laste profilen. Prøv igjen.');
                        }
                    }
                } else {
                    const teamId = teamMap[selectedGender!] ?? '';
                    const { session } = await authService.loginPlayer(username, password, teamId);
                    if (session?.user) {
                        const profile = await authService.getProfile(session.user.id);
                        if (profile) {
                            setUser(profile.user);
                            setClub(profile.club);
                            setTeam(profile.team);
                            setManagedTeamIds(profile.managedTeamIds);
                        } else {
                            setError('Kunne ikke laste profilen. Prøv igjen.');
                        }
                    }
                }
            } else {
                // Mock fallback for development
                await new Promise(resolve => setTimeout(resolve, 1000));
                const { mockClubs } = require('../../data/mockData');

                if (isAdminLogin) {
                    setUser({
                        id: 'admin1',
                        username,
                        role: 'admin',
                        admin_type: 'club_admin',
                        club_id: '1',
                        team_id: null,
                        display_name: username,
                        avatar_url: null,
                        total_points: 0,
                        current_streak: 0,
                        longest_streak: 0,
                        created_at: new Date().toISOString(),
                        last_login: new Date().toISOString(),
                    });
                    setClub(mockClubs[0]);
                } else {
                    const selectedClub = mockClubs.find((c: Club) => c.id === selectedClubId);
                    setUser({
                        id: '4',
                        username,
                        role: 'player',
                        admin_type: null,
                        club_id: selectedClubId!,
                        team_id: '1',
                        display_name: username,
                        avatar_url: null,
                        total_points: 390,
                        current_streak: 5,
                        longest_streak: 12,
                        created_at: new Date().toISOString(),
                        last_login: new Date().toISOString(),
                    });
                    if (selectedClub) setClub(selectedClub);
                }
            }
        } catch (err: any) {
            const message = err?.message || 'Innlogging feilet';
            if (message.includes('Invalid login credentials')) {
                setError('Feil brukernavn eller passord');
            } else if (message.includes('Email not confirmed')) {
                setError('E-posten er ikke bekreftet ennå. Kontakt treneren din.');
            } else {
                setError(message);
            }
        }

        setIsLoading(false);
    };

    const handleForgotPassword = () => {
        showToast('Kontakt treneren din for a fa nytt passord', 'info');
    };

    if (loadingClubs) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

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
                            accessibilityRole="button"
                            accessibilityLabel={t('auth.player')}
                            accessibilityState={{ selected: !isAdminLogin }}
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
                            accessibilityRole="button"
                            accessibilityLabel="Admin"
                            accessibilityState={{ selected: isAdminLogin }}
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
                                    options={clubs}
                                    selectedValue={selectedClubId}
                                    onValueChange={(value) => {
                                        setSelectedClubId(value);
                                        setError('');
                                    }}
                                    placeholder="Velg klubb..."
                                    testID="login-club-dropdown"
                                />

                                <Dropdown
                                    label={t('auth.selectYear')}
                                    options={yearGroups}
                                    selectedValue={selectedYear}
                                    onValueChange={(value) => {
                                        setSelectedYear(value);
                                        setError('');
                                    }}
                                    placeholder="Velg argang..."
                                    testID="login-year-dropdown"
                                />

                                <Dropdown
                                    label={t('auth.selectGender')}
                                    options={genderOptions}
                                    selectedValue={selectedGender}
                                    onValueChange={(value) => {
                                        setSelectedGender(value);
                                        setSelectedTeamId(teamMap[value] ?? null);
                                        setError('');
                                    }}
                                    placeholder="Velg kjonn..."
                                    testID="login-gender-dropdown"
                                />
                            </>
                        )}

                        <Input
                            label={isAdminLogin ? 'E-post' : t('auth.username')}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                setError('');
                            }}
                            placeholder={isAdminLogin ? 'admin@klubb.no' : 'Brukernavn'}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType={isAdminLogin ? 'email-address' : 'default'}
                            testID="login-username"
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
                            testID="login-password"
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
                            testID="login-button"
                        />

                        <TouchableOpacity
                            onPress={handleForgotPassword}
                            style={styles.forgotPassword}
                            accessibilityRole="link"
                            accessibilityLabel={t('auth.forgotPassword')}
                        >
                            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                                {t('auth.forgotPassword')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            style={styles.registerLink}
                            accessibilityRole="link"
                            accessibilityLabel={t('auth.createAccountButton')}
                        >
                            <Text style={[styles.registerLinkText, { color: colors.textSecondary }]}>
                                {t('auth.noAccount')}{' '}
                            </Text>
                            <Text style={[styles.registerLinkAction, { color: colors.primary }]}>
                                {t('auth.createAccountButton')}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    registerLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    registerLinkText: {
        fontSize: 14,
    },
    registerLinkAction: {
        fontSize: 14,
        fontWeight: '600',
    },
});
