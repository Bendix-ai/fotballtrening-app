import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input, Dropdown, useToast } from '../../components';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore, useAppStore } from '../../stores';
import { isSupabaseConfigured } from '../../lib/supabase';
import * as authService from '../../services/authService';
import * as clubService from '../../services/clubService';
import { Club, RootStackParamList } from '../../types';

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export function LoginScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<LoginNavigationProp>();
    const { setUser, setClub, setTeam, setManagedTeamIds } = useAuthStore();
    const { selectedClubId, setSelectedClubId, lastLoginYear, lastLoginGender, setLastLoginYear, setLastLoginGender } = useAppStore();
    const { showToast } = useToast();

    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [isCompactMode, setIsCompactMode] = useState(
        !!(selectedClubId && lastLoginYear && lastLoginGender)
    );

    // Dynamic data from Supabase
    const [clubs, setClubs] = useState<{ value: string; label: string }[]>([]);
    const [yearGroups, setYearGroups] = useState<{ value: string; label: string }[]>([]);
    const [genderOptions, setGenderOptions] = useState<{ value: string; label: string }[]>([]);
    const [teamMap, setTeamMap] = useState<Record<string, string>>({});
    const [loadingClubs, setLoadingClubs] = useState(true);

    // Load clubs on mount, and initialize compact mode data
    useEffect(() => {
        loadClubs();
        if (isCompactMode && selectedClubId && lastLoginYear && lastLoginGender) {
            setSelectedYear(lastLoginYear);
            setSelectedGender(lastLoginGender);
            loadYearGroups(selectedClubId);
            loadTeams(lastLoginYear);
        }
    }, []);

    // Load year groups when club changes (skip in compact mode on mount)
    useEffect(() => {
        if (isCompactMode) return;
        if (selectedClubId) {
            loadYearGroups(selectedClubId);
        } else {
            setYearGroups([]);
        }
        setSelectedYear(null);
        setSelectedGender(null);
    }, [selectedClubId]);

    // Load teams (genders) when year group changes (skip in compact mode on mount)
    useEffect(() => {
        if (isCompactMode) return;
        if (selectedYear) {
            loadTeams(selectedYear);
        } else {
            setGenderOptions([]);
        }
        setSelectedGender(null);
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
            setError(t('auth.fillCredentials'));
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
                            setError(t('auth.profileLoadError'));
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
                            setLastLoginYear(selectedYear);
                            setLastLoginGender(selectedGender);
                        } else {
                            setError(t('auth.profileLoadError'));
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
                    setLastLoginYear(selectedYear);
                    setLastLoginGender(selectedGender);
                }
            }
        } catch (err: any) {
            const message = err?.message || t('auth.loginFailed');
            if (message.includes('Invalid login credentials')) {
                setError(t('auth.wrongCredentials'));
            } else if (message.includes('Email not confirmed')) {
                setError(t('auth.emailNotConfirmed'));
            } else {
                setError(message);
            }
        }

        setIsLoading(false);
    };

    const handleForgotPassword = () => {
        if (isAdminLogin) {
            navigation.navigate('ForgotPassword');
        } else {
            showToast(t('auth.playerForgotPassword'), 'info');
        }
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
                        <Image source={require('../../../assets/Fotballtrening_icon.png')} style={{ width: 80, height: 80, borderRadius: 20 }} />
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
                                {t('auth.player')}
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
                        {!isAdminLogin && isCompactMode && (
                            <View style={styles.compactContainer}>
                                <Text
                                    testID="login-compact-summary"
                                    style={[styles.compactSummary, { color: colors.textSecondary }]}
                                >
                                    {t('auth.savedAs')}:{' '}
                                    <Text style={{ color: colors.text, fontWeight: '600' }}>
                                        {clubs.find(c => c.value === selectedClubId)?.label ?? ''},{' '}
                                        {yearGroups.find(y => y.value === lastLoginYear)?.label ?? lastLoginYear},{' '}
                                        {genderOptions.find(g => g.value === lastLoginGender)?.label ?? lastLoginGender}
                                    </Text>
                                </Text>
                                <TouchableOpacity
                                    testID="login-change-team-link"
                                    onPress={() => setIsCompactMode(false)}
                                    accessibilityRole="link"
                                    accessibilityLabel={t('auth.changeTeam')}
                                >
                                    <Text style={[styles.changeTeamText, { color: colors.primary }]}>
                                        {t('auth.changeTeam')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {!isAdminLogin && !isCompactMode && (
                            <>
                                <Dropdown
                                    label={t('auth.selectClub')}
                                    options={clubs}
                                    selectedValue={selectedClubId}
                                    onValueChange={(value) => {
                                        setSelectedClubId(value);
                                        setError('');
                                    }}
                                    placeholder={t('auth.selectClubPlaceholder')}
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
                                    placeholder={t('auth.selectYearPlaceholder')}
                                    testID="login-year-dropdown"
                                />

                                <Dropdown
                                    label={t('auth.selectGender')}
                                    options={genderOptions}
                                    selectedValue={selectedGender}
                                    onValueChange={(value) => {
                                        setSelectedGender(value);
                                        setError('');
                                    }}
                                    placeholder={t('auth.selectGenderPlaceholder')}
                                    testID="login-gender-dropdown"
                                />
                            </>
                        )}

                        <Input
                            label={isAdminLogin ? t('auth.email') : t('auth.username')}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                setError('');
                            }}
                            placeholder={isAdminLogin ? 'admin@klubb.no' : t('auth.username')}
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
                            placeholder={t('auth.password')}
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
    compactContainer: {
        marginBottom: 12,
        alignItems: 'center',
    },
    compactSummary: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 4,
    },
    changeTeamText: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
    },
});
