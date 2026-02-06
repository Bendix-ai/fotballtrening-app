import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { AdminHeader, SearchBar, Card } from '../../components';
import { useAdminStore } from '../../stores';
import { AdminPlayer, AdminStackParamList, Gender } from '../../types';

type PlayersNavProp = NativeStackNavigationProp<AdminStackParamList>;

const yearFilters = [null, 2013, 2014, 2015, 2016];
const genderFilters: (Gender | null)[] = [null, 'boys', 'girls'];

const getGenderLabel = (g: Gender | null): string => {
    if (!g) return t('admin.allGenders');
    return t(`admin.${g}`);
};

export function PlayersManagementScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<PlayersNavProp>();
    const { getFilteredPlayers, playerYearFilter, playerGenderFilter, setPlayerYearFilter, setPlayerGenderFilter } = useAdminStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const allPlayers = getFilteredPlayers();
    const filteredPlayers = searchQuery.length > 0
        ? allPlayers.filter(
              (p) =>
                  p.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.username.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : allPlayers;

    const renderPlayer = ({ item }: { item: AdminPlayer }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AddEditPlayer', { playerId: item.id })}
        >
            <Card style={styles.playerCard}>
                <View style={styles.playerRow}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>
                            {item.display_name.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.playerInfo}>
                        <Text style={[styles.playerName, { color: colors.text }]}>
                            {item.display_name}
                        </Text>
                        <Text style={[styles.playerMeta, { color: colors.textSecondary }]}>
                            @{item.username} · {item.year_group} · {t(`admin.${item.gender}`)}
                        </Text>
                    </View>
                    <View style={styles.playerStats}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>
                            {item.total_points}
                        </Text>
                        <View
                            style={[
                                styles.statusDot,
                                { backgroundColor: item.is_active ? colors.success : colors.textTertiary },
                            ]}
                        />
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <AdminHeader title={t('admin.players')} />

            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={`${t('exercises.search')}`}
                />
            </View>

            {/* Year filter chips */}
            <View style={styles.filterRow}>
                {yearFilters.map((year) => (
                    <TouchableOpacity
                        key={year ?? 'all'}
                        onPress={() => setPlayerYearFilter(year)}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor: playerYearFilter === year ? colors.primary : colors.surface,
                                borderColor: playerYearFilter === year ? colors.primary : colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                { color: playerYearFilter === year ? '#ffffff' : colors.textSecondary },
                            ]}
                        >
                            {year ?? t('admin.allYears')}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Gender filter chips */}
            <View style={styles.filterRow}>
                {genderFilters.map((g) => (
                    <TouchableOpacity
                        key={g ?? 'all'}
                        onPress={() => setPlayerGenderFilter(g)}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor: playerGenderFilter === g ? colors.primary : colors.surface,
                                borderColor: playerGenderFilter === g ? colors.primary : colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                { color: playerGenderFilter === g ? '#ffffff' : colors.textSecondary },
                            ]}
                        >
                            {getGenderLabel(g)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Player count */}
            <View style={styles.countRow}>
                <Text style={[styles.countText, { color: colors.textSecondary }]}>
                    {filteredPlayers.length} {t('admin.players').toLowerCase()}
                </Text>
            </View>

            <FlatList
                data={filteredPlayers}
                keyExtractor={(item) => item.id}
                renderItem={renderPlayer}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="person-search" size={48} color={colors.textTertiary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            {t('admin.noPlayersFound')}
                        </Text>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity
                onPress={() => navigation.navigate('AddEditPlayer', {})}
                style={[styles.fab, { backgroundColor: colors.primary }]}
            >
                <MaterialIcons name="add" size={28} color="#ffffff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 8,
        marginTop: 8,
        flexWrap: 'wrap',
    },
    filterChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '500',
    },
    countRow: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 4,
    },
    countText: {
        fontSize: 13,
    },
    list: {
        padding: 20,
        paddingBottom: 100,
    },
    playerCard: {
        marginBottom: 10,
    },
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },
    playerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    playerName: {
        fontSize: 15,
        fontWeight: '600',
    },
    playerMeta: {
        fontSize: 12,
        marginTop: 2,
    },
    playerStats: {
        alignItems: 'flex-end',
        gap: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
    },
});
