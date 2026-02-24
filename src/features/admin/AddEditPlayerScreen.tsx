import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input, Dropdown, useToast } from '../../components';
import { useAuthStore, useAdminStore } from '../../stores';
import { isSupabaseConfigured } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';
import * as authService from '../../services/authService';
import * as clubService from '../../services/clubService';
import { usePlayer } from '../../hooks/useAdmin';
import { AdminStackParamList, Gender } from '../../types';

type EditPlayerRoute = RouteProp<AdminStackParamList, 'AddEditPlayer'>;

const staticGenderOptions = [
    { value: 'boys', label: 'Gutter' },
    { value: 'girls', label: 'Jenter' },
];

export function AddEditPlayerScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<EditPlayerRoute>();
    const { showToast } = useToast();
    const { user } = useAuthStore();
    const { addPlayer, updatePlayer } = useAdminStore();

    const playerId = route.params?.playerId;
    const { data: existingPlayer, isLoading: loadingPlayer } = usePlayer(playerId);
    const isEditing = !!playerId && !!existingPlayer;

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [formPopulated, setFormPopulated] = useState(false);

    // Populate form when player data loads
    useEffect(() => {
        if (existingPlayer && !formPopulated) {
            setName(existingPlayer.display_name ?? '');
            setUsername(existingPlayer.username ?? '');
            setSelectedYear(existingPlayer.year_group_id ?? null);
            setSelectedGender(existingPlayer.gender ?? null);
            setFormPopulated(true);
        }
    }, [existingPlayer, formPopulated]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Dynamic data from Supabase
    const [yearGroups, setYearGroups] = useState<{ value: string; label: string }[]>([]);
    const [teamMap, setTeamMap] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user?.club_id) {
            loadYearGroups(user.club_id);
        }
    }, [user?.club_id]);

    useEffect(() => {
        if (selectedYear) {
            loadTeams(selectedYear);
        }
    }, [selectedYear]);

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
            const map: Record<string, string> = {};
            data.forEach(t => { map[t.value] = t.teamId; });
            setTeamMap(map);
        } catch (err) {
            console.error('Error loading teams:', err);
        }
    };

    const handleSaveWithConfirmation = () => {
        if (isEditing && password.trim()) {
            Alert.alert(
                t('auth.adminResetPassword'),
                t('auth.adminResetPasswordConfirm'),
                [
                    { text: t('common.cancel'), style: 'cancel' },
                    { text: t('common.yes'), onPress: () => handleSave() },
                ]
            );
        } else {
            handleSave();
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Fyll inn spillernavn');
            return;
        }
        if (!username.trim()) {
            setError('Fyll inn brukernavn');
            return;
        }
        if (!isEditing && !password.trim()) {
            setError('Fyll inn passord');
            return;
        }
        if (password && password.length < 6) {
            setError('Passord må være minst 6 tegn');
            return;
        }
        if (password && password !== confirmPassword) {
            setError('Passordene stemmer ikke overens');
            return;
        }
        if (!selectedYear) {
            setError('Velg årgang');
            return;
        }
        if (!selectedGender) {
            setError('Velg kjønn');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            if (isSupabaseConfigured()) {
                const teamId = teamMap[selectedGender] ?? '';
                const clubId = user?.club_id ?? '';

                if (isEditing && existingPlayer) {
                    // Update existing profile
                    const { error: updateError } = await supabase
                        .from('profiles')
                        .update({
                            display_name: name.trim(),
                            username: username.trim(),
                            team_id: teamId || undefined,
                        })
                        .eq('id', existingPlayer.id);

                    if (updateError) throw updateError;

                    // If password was filled, reset the player's password
                    if (password.trim()) {
                        await authService.adminResetPlayerPassword(existingPlayer.id, password);
                        showToast(t('auth.adminResetPasswordSuccess'), 'success');
                    } else {
                        showToast('Spiller oppdatert', 'success');
                    }
                } else {
                    // Create new player via Supabase Auth
                    await authService.signUpPlayer(
                        username.trim(),
                        password,
                        clubId,
                        teamId,
                        name.trim()
                    );
                    showToast('Spiller opprettet', 'success');
                }
            } else {
                // Mock fallback
                await new Promise((resolve) => setTimeout(resolve, 500));

                if (isEditing && existingPlayer) {
                    updatePlayer(existingPlayer.id, {
                        display_name: name.trim(),
                        username: username.trim(),
                        year_group: parseInt(selectedYear),
                        gender: selectedGender as Gender,
                    });
                    showToast('Spiller oppdatert', 'success');
                } else {
                    addPlayer({
                        id: `p${Date.now()}`,
                        display_name: name.trim(),
                        username: username.trim(),
                        year_group: parseInt(selectedYear),
                        gender: selectedGender as Gender,
                        total_points: 0,
                        exercises_completed: 0,
                        current_streak: 0,
                        longest_streak: 0,
                        last_active: new Date().toISOString().split('T')[0],
                        is_active: true,
                    });
                    showToast('Spiller opprettet', 'success');
                }
            }

            navigation.goBack();
        } catch (err: any) {
            const message = err?.message || 'Noe gikk galt';
            if (message.includes('already registered')) {
                setError('Brukernavnet er allerede i bruk');
            } else {
                setError(message);
            }
        }

        setIsLoading(false);
    };

    // Show loading spinner while fetching player data for edit
    if (playerId && loadingPlayer) {
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
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {isEditing ? t('admin.editPlayer') : t('admin.addPlayer')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Card style={styles.formCard}>
                        <Input
                            label={t('admin.playerName')}
                            value={name}
                            onChangeText={(text) => { setName(text); setError(''); }}
                            placeholder="Fullt navn"
                            required
                        />

                        <Input
                            label={t('admin.username')}
                            value={username}
                            onChangeText={(text) => { setUsername(text); setError(''); }}
                            placeholder="brukernavn"
                            autoCapitalize="none"
                            autoCorrect={false}
                            required
                        />

                        <Input
                            label={t('admin.password')}
                            value={password}
                            onChangeText={(text) => { setPassword(text); setError(''); }}
                            placeholder={isEditing ? 'La tom for å beholde' : 'Passord'}
                            secureTextEntry
                            required={!isEditing}
                        />

                        {password.length > 0 && (
                            <Input
                                label={t('admin.confirmPassword')}
                                value={confirmPassword}
                                onChangeText={(text) => { setConfirmPassword(text); setError(''); }}
                                placeholder="Bekreft passord"
                                secureTextEntry
                            />
                        )}

                        <Dropdown
                            label={t('admin.yearGroup')}
                            options={yearGroups}
                            selectedValue={selectedYear}
                            onValueChange={(value) => { setSelectedYear(value); setError(''); }}
                            placeholder="Velg årgang..."
                            required
                        />

                        <Dropdown
                            label={t('admin.gender')}
                            options={staticGenderOptions}
                            selectedValue={selectedGender}
                            onValueChange={(value) => { setSelectedGender(value); setError(''); }}
                            placeholder="Velg kjønn..."
                            required
                        />

                        {error ? (
                            <Text style={[styles.error, { color: colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            title={isEditing ? t('common.save') : t('admin.addPlayer')}
                            onPress={handleSaveWithConfirmation}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
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
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    formCard: {
        marginBottom: 24,
    },
    error: {
        fontSize: 14,
        marginBottom: 12,
        textAlign: 'center',
    },
    saveButton: {
        marginTop: 8,
    },
});
