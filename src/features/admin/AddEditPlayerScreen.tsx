import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input, Dropdown, useToast } from '../../components';
import { useAdminStore } from '../../stores';
import { AdminStackParamList, Gender } from '../../types';
import { mockYearGroups } from '../../data/mockData';

type EditPlayerRoute = RouteProp<AdminStackParamList, 'AddEditPlayer'>;

const genderOptions = [
    { value: 'boys', label: 'Gutter' },
    { value: 'girls', label: 'Jenter' },
];

export function AddEditPlayerScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<EditPlayerRoute>();
    const { showToast } = useToast();
    const { players, addPlayer, updatePlayer } = useAdminStore();

    const playerId = route.params?.playerId;
    const existingPlayer = playerId ? players.find((p) => p.id === playerId) : null;
    const isEditing = !!existingPlayer;

    const [name, setName] = useState(existingPlayer?.display_name ?? '');
    const [username, setUsername] = useState(existingPlayer?.username ?? '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedYear, setSelectedYear] = useState<string | null>(
        existingPlayer ? String(existingPlayer.year_group) : null
    );
    const [selectedGender, setSelectedGender] = useState<string | null>(
        existingPlayer?.gender ?? null
    );
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
                last_active: new Date().toISOString().split('T')[0],
                is_active: true,
            });
            showToast('Spiller opprettet', 'success');
        }

        setIsLoading(false);
        navigation.goBack();
    };

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
                        />

                        <Input
                            label={t('admin.username')}
                            value={username}
                            onChangeText={(text) => { setUsername(text); setError(''); }}
                            placeholder="brukernavn"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label={t('admin.password')}
                            value={password}
                            onChangeText={(text) => { setPassword(text); setError(''); }}
                            placeholder={isEditing ? 'La tom for å beholde' : 'Passord'}
                            secureTextEntry
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
                            options={mockYearGroups}
                            selectedValue={selectedYear}
                            onValueChange={(value) => { setSelectedYear(value); setError(''); }}
                            placeholder="Velg årgang..."
                        />

                        <Dropdown
                            label={t('admin.gender')}
                            options={genderOptions}
                            selectedValue={selectedGender}
                            onValueChange={(value) => { setSelectedGender(value); setError(''); }}
                            placeholder="Velg kjønn..."
                        />

                        {error ? (
                            <Text style={[styles.error, { color: colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            title={isEditing ? t('common.save') : t('admin.addPlayer')}
                            onPress={handleSave}
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
