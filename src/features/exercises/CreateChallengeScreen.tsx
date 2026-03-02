import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, useToast } from '../../components';
import { useTeammates, useCreateChallenge } from '../../hooks/useChallenges';
import { useFriends } from '../../hooks/useFriends';
import { useExercise } from '../../hooks/useExercises';
import { ExercisesStackParamList } from '../../types';

type NavProp = NativeStackNavigationProp<ExercisesStackParamList>;
type RoutePropType = RouteProp<ExercisesStackParamList, 'CreateChallenge'>;

export function CreateChallengeScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<NavProp>();
    const route = useRoute<RoutePropType>();
    const { exerciseId } = route.params;
    const { showToast } = useToast();
    const { data: teammates = [], isLoading: loadingTeammates } = useTeammates();
    const { data: friends = [], isLoading: loadingFriends } = useFriends();
    const { data: exercise } = useExercise(exerciseId);
    const createChallenge = useCreateChallenge();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Build sections: friends first, then remaining teammates
    const sections = useMemo(() => {
        const friendIds = new Set(friends.map((f) => f.friend_id));
        const friendItems = friends.map((f) => ({ id: f.friend_id, display_name: f.display_name }));
        const otherTeammates = teammates.filter((tm) => !friendIds.has(tm.id));
        const result: { title: string; data: { id: string; display_name: string }[] }[] = [];
        if (friendItems.length > 0) {
            result.push({ title: t('challenges.friends'), data: friendItems });
        }
        if (otherTeammates.length > 0) {
            result.push({ title: t('challenges.teammates'), data: otherTeammates });
        }
        return result;
    }, [friends, teammates]);

    const handleSend = () => {
        if (!selectedId || !exercise) return;
        const opponent = teammates.find((t) => t.id === selectedId)
            ?? friends.map((f) => ({ id: f.friend_id, display_name: f.display_name })).find((f) => f.id === selectedId);
        if (!opponent) return;

        createChallenge.mutate(
            {
                opponentId: opponent.id,
                opponentName: opponent.display_name,
                exerciseId: exercise.id,
                exerciseTitle: exercise.title,
            },
            {
                onSuccess: () => {
                    showToast(t('challenges.challengeSent'), 'success');
                    navigation.goBack();
                },
            },
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} testID="create-challenge-screen">
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} testID="create-challenge-back-button">
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>
                    {t('challenges.challengeFriend')}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Exercise info */}
            {exercise && (
                <Card style={styles.exerciseCard}>
                    <View style={styles.exerciseRow}>
                        <View style={[styles.exerciseIcon, { backgroundColor: colors.primary + '18' }]}>
                            <MaterialIcons name="fitness-center" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.exerciseInfo}>
                            <Text style={[styles.exerciseName, { color: colors.text }]}>
                                {exercise.title}
                            </Text>
                            <Text style={[styles.exerciseMeta, { color: colors.textSecondary }]}>
                                {t('challenges.winnerBonus', { points: '10' })}
                            </Text>
                        </View>
                    </View>
                </Card>
            )}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('challenges.selectOpponent')}
            </Text>

            {(loadingTeammates || loadingFriends) ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
                            {title}
                        </Text>
                    )}
                    renderItem={({ item }) => {
                        const isSelected = selectedId === item.id;
                        return (
                            <TouchableOpacity
                                onPress={() => setSelectedId(item.id)}
                                activeOpacity={0.7}
                                testID={`teammate-${item.id}`}
                            >
                                <Card style={isSelected
                                    ? { ...styles.teammateCard, borderColor: colors.primary, borderWidth: 2 }
                                    : styles.teammateCard
                                }>
                                    <View style={styles.teammateRow}>
                                        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                                            <Text style={[styles.avatarText, { color: colors.primary }]}>
                                                {item.display_name.charAt(0)}
                                            </Text>
                                        </View>
                                        <Text style={[styles.teammateName, { color: colors.text }]}>
                                            {item.display_name}
                                        </Text>
                                        {isSelected && (
                                            <MaterialIcons name="check-circle" size={24} color={colors.primary} />
                                        )}
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

            <View style={styles.footer}>
                <Button
                    title={t('challenges.createChallenge')}
                    onPress={handleSend}
                    disabled={!selectedId || createChallenge.isPending}
                    loading={createChallenge.isPending}
                    testID="send-challenge-button"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 20, fontWeight: '700' },
    exerciseCard: { marginHorizontal: 20, marginBottom: 20 },
    exerciseRow: { flexDirection: 'row', alignItems: 'center' },
    exerciseIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exerciseInfo: { flex: 1, marginLeft: 12 },
    exerciseName: { fontSize: 16, fontWeight: '600' },
    exerciseMeta: { fontSize: 13, marginTop: 2 },
    sectionTitle: { fontSize: 16, fontWeight: '600', paddingHorizontal: 20, marginBottom: 12 },
    sectionHeader: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 12 },
    list: { paddingHorizontal: 20, paddingBottom: 100 },
    teammateCard: { marginBottom: 8 },
    teammateRow: { flexDirection: 'row', alignItems: 'center' },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { fontSize: 16, fontWeight: '700' },
    teammateName: { flex: 1, fontSize: 15, fontWeight: '500', marginLeft: 12 },
    footer: { padding: 20, paddingBottom: 30 },
});
