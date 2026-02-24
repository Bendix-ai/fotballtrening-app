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
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input, Dropdown, useToast } from '../../components';
import { useAppStore } from '../../stores';
import * as authService from '../../services/authService';
import * as clubService from '../../services/clubService';
import { Club, Gender, RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
type RegistrationMode = 'player' | 'team_admin' | 'club_admin';

export function RegisterScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<NavigationProp>();
    const { selectedClubId, setSelectedClubId } = useAppStore();
    const { showToast } = useToast();

    const [registrationMode, setRegistrationMode] = useState<RegistrationMode>('player');
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [, setSelectedTeamId] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Create club state
    const [isCreatingClub, setIsCreatingClub] = useState(false);
    const [newClubName, setNewClubName] = useState('');

    // Team admin: multi-team selection
    const [allClubTeams, setAllClubTeams] = useState<{ id: string; name: string; year: number; gender: Gender }[]>([]);
    const [selectedManagedTeamIds, setSelectedManagedTeamIds] = useState<string[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(false);

    // Dynamic data from Supabase
    const [clubs, setClubs] = useState<{ value: string; label: string }[]>([]);
    const [yearGroups, setYearGroups] = useState<{ value: string; label: string }[]>([]);
    const [genderOptions, setGenderOptions] = useState<{ value: string; label: string }[]>([]);
    const [teamMap, setTeamMap] = useState<Record<string, string>>({});
    const [loadingClubs, setLoadingClubs] = useState(true);

    const isAdminMode = registrationMode !== 'player';

    // Load clubs on mount
    useEffect(() => {
        loadClubs();
    }, []);

    // Load year groups when club changes (for player mode)
    useEffect(() => {
        if (selectedClubId) {
            loadYearGroups(selectedClubId);
            if (registrationMode === 'team_admin') {
                loadAllTeamsForClub(selectedClubId);
            }
        } else {
            setYearGroups([]);
            setAllClubTeams([]);
        }
        setSelectedYear(null);
        setSelectedGender(null);
        setSelectedTeamId(null);
        setSelectedManagedTeamIds([]);
    }, [selectedClubId]);

    // Load all teams when switching to team_admin mode with a club selected
    useEffect(() => {
        if (registrationMode === 'team_admin' && selectedClubId) {
            loadAllTeamsForClub(selectedClubId);
        }
    }, [registrationMode]);

    // Load teams (genders) when year group changes (player mode)
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

    const loadAllTeamsForClub = async (clubId: string) => {
        setLoadingTeams(true);
        try {
            const data = await clubService.getAllTeamsForClub(clubId);
            setAllClubTeams(data);
        } catch (err) {
            console.error('Error loading all teams:', err);
        }
        setLoadingTeams(false);
    };

    const toggleManagedTeam = (teamId: string) => {
        setSelectedManagedTeamIds(prev =>
            prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]
        );
        setError('');
    };

    const handleRegister = async () => {
        // Validate club (unless creating new)
        if (!isCreatingClub && !selectedClubId) {
            setError(t('auth.selectClub'));
            return;
        }
        if (isCreatingClub && newClubName.trim().length < 2) {
            setError(t('auth.clubNameMinLength'));
            return;
        }

        if (registrationMode === 'player') {
            if (!selectedYear) {
                setError(t('auth.selectYear'));
                return;
            }
            if (!selectedGender) {
                setError(t('auth.selectGender'));
                return;
            }
        }

        if (registrationMode === 'team_admin' && selectedManagedTeamIds.length === 0) {
            setError(t('auth.atLeastOneTeam'));
            return;
        }

        if (!username.trim()) {
            setError(isAdminMode ? t('auth.fillEmail') : t('auth.fillUsername'));
            return;
        }
        if (!displayName.trim()) {
            setError(t('auth.fillDisplayName'));
            return;
        }
        if (!password.trim()) {
            setError(t('auth.fillPassword'));
            return;
        }
        if (password !== confirmPassword) {
            setError(t('auth.passwordMismatch'));
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Step 1: Create club if needed
            let clubId = selectedClubId;
            if (isCreatingClub) {
                clubId = await authService.createClub(newClubName.trim());
            }

            if (!clubId) {
                setError(t('auth.selectClub'));
                setIsLoading(false);
                return;
            }

            // Step 2: Signup based on mode
            let signUpData;
            switch (registrationMode) {
                case 'player': {
                    const teamId = teamMap[selectedGender!] ?? '';
                    signUpData = await authService.signUpPlayer(
                        username, password, clubId, teamId, displayName
                    );
                    break;
                }
                case 'club_admin':
                    signUpData = await authService.signUpClubAdmin(
                        username, password, clubId, displayName
                    );
                    break;
                case 'team_admin':
                    signUpData = await authService.signUpTeamAdmin(
                        username, password, clubId, displayName, selectedManagedTeamIds
                    );
                    break;
            }

            // If no session returned (email confirmation still enabled),
            // navigate to Login instead of leaving user stuck
            if (!signUpData?.session) {
                showToast(t('auth.accountCreatedLogin'), 'success');
                navigation.navigate('Login');
                setIsLoading(false);
                return;
            }

            // Auto-login happens via onAuthStateChange in authStore
            showToast(t('auth.registrationSuccess'), 'success');
        } catch (err: any) {
            const message = err?.message || t('auth.registrationFailed');
            setError(message);
        }

        setIsLoading(false);
    };

    const renderToggleButton = (mode: RegistrationMode, label: string) => {
        const isActive = registrationMode === mode;
        return (
            <TouchableOpacity
                onPress={() => { setRegistrationMode(mode); setError(''); }}
                style={[
                    styles.toggleButton,
                    {
                        backgroundColor: isActive ? colors.primary : colors.surface,
                        borderColor: isActive ? colors.primary : colors.border,
                    },
                ]}
            >
                <Text style={[styles.toggleText, { color: isActive ? '#ffffff' : colors.textSecondary }]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
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
                            {t('auth.createAccount')}
                        </Text>
                    </View>

                    {/* Three-way Toggle */}
                    <View style={styles.toggleContainer}>
                        {renderToggleButton('player', t('auth.player'))}
                        {renderToggleButton('team_admin', t('auth.teamAdmin'))}
                        {renderToggleButton('club_admin', t('auth.clubAdmin'))}
                    </View>

                    {/* Registration Form */}
                    <Card style={styles.formCard}>
                        {/* Club selection or creation */}
                        {isCreatingClub ? (
                            <>
                                <Input
                                    label={t('auth.clubName')}
                                    value={newClubName}
                                    onChangeText={(text) => {
                                        setNewClubName(text);
                                        setError('');
                                    }}
                                    placeholder={t('auth.clubNamePlaceholder')}
                                />
                                <TouchableOpacity
                                    onPress={() => { setIsCreatingClub(false); setNewClubName(''); }}
                                    style={styles.createClubLink}
                                >
                                    <Text style={[styles.createClubLinkText, { color: colors.primary }]}>
                                        {t('auth.backToClubList')}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        ) : (
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
                                    testID="register-club-dropdown"
                                />
                                <TouchableOpacity
                                    onPress={() => setIsCreatingClub(true)}
                                    style={styles.createClubLink}
                                >
                                    <Text style={[styles.createClubLinkText, { color: colors.primary }]}>
                                        {t('auth.clubNotFound')} {t('auth.createNewClub')}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Player mode: cascading dropdowns */}
                        {registrationMode === 'player' && (
                            <>
                                <Dropdown
                                    label={t('auth.selectYear')}
                                    options={yearGroups}
                                    selectedValue={selectedYear}
                                    onValueChange={(value) => {
                                        setSelectedYear(value);
                                        setError('');
                                    }}
                                    placeholder={t('auth.selectYearPlaceholder')}
                                    testID="register-year-dropdown"
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
                                    placeholder={t('auth.selectGenderPlaceholder')}
                                    testID="register-gender-dropdown"
                                />
                            </>
                        )}

                        {/* Team admin mode: multi-team selection */}
                        {registrationMode === 'team_admin' && selectedClubId && !isCreatingClub && (
                            <View style={styles.teamSelectionSection}>
                                <Text style={[styles.teamSelectionLabel, { color: colors.text }]}>
                                    {t('auth.selectTeams')}
                                </Text>
                                {loadingTeams ? (
                                    <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 12 }} />
                                ) : allClubTeams.length === 0 ? (
                                    <Text style={[styles.noTeamsText, { color: colors.textSecondary }]}>
                                        {t('auth.noTeamsFound')}
                                    </Text>
                                ) : (
                                    allClubTeams.map(team => {
                                        const isSelected = selectedManagedTeamIds.includes(team.id);
                                        return (
                                            <TouchableOpacity
                                                key={team.id}
                                                onPress={() => toggleManagedTeam(team.id)}
                                                style={[
                                                    styles.teamCheckbox,
                                                    {
                                                        backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                                                        borderColor: isSelected ? colors.primary : colors.border,
                                                    },
                                                ]}
                                            >
                                                <MaterialIcons
                                                    name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                                                    size={22}
                                                    color={isSelected ? colors.primary : colors.textSecondary}
                                                />
                                                <Text style={[
                                                    styles.teamCheckboxLabel,
                                                    { color: isSelected ? colors.primary : colors.text },
                                                ]}>
                                                    {team.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })
                                )}
                            </View>
                        )}

                        <Input
                            label={isAdminMode ? t('auth.emailLabel') : t('auth.username')}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                setError('');
                            }}
                            placeholder={isAdminMode ? 'admin@klubb.no' : t('auth.username')}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType={isAdminMode ? 'email-address' : 'default'}
                            testID="register-username-input"
                        />

                        <Input
                            label={t('auth.displayName')}
                            value={displayName}
                            onChangeText={(text) => {
                                setDisplayName(text);
                                setError('');
                            }}
                            placeholder={t('auth.displayNamePlaceholder')}
                            testID="register-displayname-input"
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
                            testID="register-password-input"
                        />

                        <Input
                            label={t('auth.confirmPassword')}
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setError('');
                            }}
                            placeholder={t('auth.confirmPassword')}
                            secureTextEntry
                            testID="register-confirm-password-input"
                        />

                        {error ? (
                            <Text style={[styles.error, { color: colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            title={t('auth.createAccountButton')}
                            onPress={handleRegister}
                            loading={isLoading}
                            fullWidth
                            size="large"
                            style={styles.registerButton}
                            testID="register-button"
                        />

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            style={styles.loginLink}
                        >
                            <Text style={[styles.loginLinkText, { color: colors.textSecondary }]}>
                                {t('auth.alreadyHaveAccount')}{' '}
                            </Text>
                            <Text style={[styles.loginLinkAction, { color: colors.primary }]}>
                                {t('auth.login')}
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
        gap: 8,
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
        fontSize: 14,
        fontWeight: '600',
    },
    formCard: {
        marginBottom: 24,
    },
    createClubLink: {
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 8,
    },
    createClubLinkText: {
        fontSize: 13,
        fontWeight: '500',
    },
    teamSelectionSection: {
        marginBottom: 8,
    },
    teamSelectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    teamCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 6,
        gap: 10,
    },
    teamCheckboxLabel: {
        fontSize: 15,
        fontWeight: '500',
    },
    noTeamsText: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 12,
    },
    error: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'center',
    },
    registerButton: {
        marginTop: 8,
    },
    loginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    loginLinkText: {
        fontSize: 14,
    },
    loginLinkAction: {
        fontSize: 14,
        fontWeight: '600',
    },
});
