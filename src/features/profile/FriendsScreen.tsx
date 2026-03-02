import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { SearchBar, Card, Button, ConfirmationDialog, useToast } from '../../components';
import { useFriends, useAddFriend, useRemoveFriend, useSearchUsers } from '../../hooks/useFriends';
import type { Friend } from '../../services/friendService';

export function FriendsScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { showToast } = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [removingFriend, setRemovingFriend] = useState<Friend | null>(null);

    const { data: friends = [], isLoading: friendsLoading } = useFriends();
    const { data: searchResults = [] } = useSearchUsers(searchQuery);
    const addFriendMutation = useAddFriend();
    const removeFriendMutation = useRemoveFriend();

    // Filter out users who are already friends
    const friendIds = new Set(friends.map((f) => f.friend_id));
    const filteredSearchResults = searchResults.filter((u) => !friendIds.has(u.id));

    const handleAddFriend = useCallback((username: string) => {
        addFriendMutation.mutate(username, {
            onSuccess: (result) => {
                if (result.success) {
                    showToast(t('profile.friendAdded'), 'success');
                    setSearchQuery('');
                } else if (result.error === 'Already friends') {
                    showToast(t('profile.alreadyFriends'), 'info');
                } else if (result.error === 'User not found') {
                    showToast(t('profile.userNotFound'), 'error');
                } else {
                    showToast(result.error ?? t('common.error'), 'error');
                }
            },
        });
    }, [addFriendMutation, showToast]);

    const handleConfirmRemove = useCallback(() => {
        if (!removingFriend) return;
        removeFriendMutation.mutate(removingFriend.id, {
            onSuccess: () => {
                showToast(t('profile.friendRemoved'), 'success');
                setRemovingFriend(null);
            },
        });
    }, [removingFriend, removeFriendMutation, showToast]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} testID="friends-screen">
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        accessibilityRole="button"
                        accessibilityLabel={t('common.back')}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('profile.friends')}
                    </Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Search */}
                <View style={styles.searchSection}>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder={t('profile.searchFriends')}
                        testID="friends-search-input"
                    />
                </View>

                {/* Search Results */}
                {searchQuery.length >= 2 && filteredSearchResults.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                            {t('common.search')}
                        </Text>
                        {filteredSearchResults.map((user) => (
                            <Card key={user.id} style={styles.userCard}>
                                <View style={styles.userRow}>
                                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.avatarText}>
                                            {(user.display_name || user.username).charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={styles.userInfo}>
                                        <Text style={[styles.userName, { color: colors.text }]}>
                                            {user.display_name || user.username}
                                        </Text>
                                        <Text style={[styles.userSubtext, { color: colors.textTertiary }]}>
                                            @{user.username}
                                        </Text>
                                    </View>
                                    <Button
                                        title={t('profile.addFriend')}
                                        onPress={() => handleAddFriend(user.username)}
                                        variant="outline"
                                        size="small"
                                        loading={addFriendMutation.isPending}
                                        testID="friends-add-button"
                                    />
                                </View>
                            </Card>
                        ))}
                    </View>
                )}

                {/* Friends List */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        {t('profile.friends')} ({friends.length})
                    </Text>

                    {friendsLoading && (
                        <ActivityIndicator color={colors.primary} style={styles.loader} />
                    )}

                    {!friendsLoading && friends.length === 0 && (
                        <Card style={styles.emptyCard}>
                            <View style={styles.emptyContent}>
                                <MaterialIcons name="people-outline" size={48} color={colors.textTertiary} />
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    {t('profile.noFriends')}
                                </Text>
                            </View>
                        </Card>
                    )}

                    {friends.map((friend) => (
                        <Card key={friend.id} style={styles.friendCard}>
                            <View style={styles.friendRow}>
                                <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                                    <Text style={styles.avatarText}>
                                        {friend.display_name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.friendInfo}>
                                    <Text style={[styles.friendName, { color: colors.text }]}>
                                        {friend.display_name}
                                    </Text>
                                    <View style={styles.friendStats}>
                                        <MaterialIcons name="star" size={14} color={colors.secondary} />
                                        <Text style={[styles.friendStatText, { color: colors.textSecondary }]}>
                                            {friend.total_points}
                                        </Text>
                                        <MaterialIcons name="local-fire-department" size={14} color={colors.streak} />
                                        <Text style={[styles.friendStatText, { color: colors.textSecondary }]}>
                                            {friend.current_streak}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setRemovingFriend(friend)}
                                    accessibilityRole="button"
                                    accessibilityLabel={t('profile.removeFriend')}
                                    testID="friend-remove-button"
                                >
                                    <MaterialIcons name="person-remove" size={22} color={colors.error} />
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>
            </ScrollView>

            <ConfirmationDialog
                visible={!!removingFriend}
                title={t('profile.removeFriend')}
                message={removingFriend?.display_name ?? ''}
                confirmLabel={t('common.confirm')}
                onConfirm={handleConfirmRemove}
                onCancel={() => setRemovingFriend(null)}
                destructive
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 24,
    },
    searchSection: {
        marginBottom: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    userCard: {
        marginBottom: 8,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 15,
        fontWeight: '600',
    },
    userSubtext: {
        fontSize: 12,
        marginTop: 2,
    },
    friendCard: {
        marginBottom: 8,
    },
    friendRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    friendInfo: {
        flex: 1,
        marginLeft: 12,
    },
    friendName: {
        fontSize: 15,
        fontWeight: '600',
    },
    friendStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    friendStatText: {
        fontSize: 13,
        marginRight: 8,
    },
    emptyCard: {
        padding: 24,
    },
    emptyContent: {
        alignItems: 'center',
        gap: 12,
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
    },
    loader: {
        marginTop: 24,
    },
});
