import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { MaterialIcons } from '@expo/vector-icons';
import { AdminHeader, Card, Button, Input, FAB, EmptyState, useToast } from '../../components';
import { useAnnouncements, useCreateAnnouncement } from '../../hooks/useAnnouncements';
import { Announcement } from '../../types';

function formatRelativeDate(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) return 'Nå';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}t`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' });
}

export function AnnouncementsScreen() {
    const { colors } = useTheme();
    const { showToast } = useToast();
    const { data: announcements = [], isLoading } = useAnnouncements();
    const createMutation = useCreateAnnouncement();

    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) return;

        try {
            await createMutation.mutateAsync({ title: title.trim(), message: message.trim() });
            showToast(t('admin.announcementSent'), 'success');
            setTitle('');
            setMessage('');
            setModalVisible(false);
        } catch {
            showToast(t('common.error'), 'error');
        }
    };

    const renderAnnouncement = ({ item }: { item: Announcement }) => (
        <Card style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
                <View style={[styles.announcementIcon, { backgroundColor: colors.primary + '18' }]}>
                    <MaterialIcons name="campaign" size={20} color={colors.primary} />
                </View>
                <View style={styles.announcementHeaderText}>
                    <Text style={[styles.announcementTitle, { color: colors.text }]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={[styles.announcementMeta, { color: colors.textTertiary }]}>
                        {item.author_name ? `${item.author_name} · ` : ''}{formatRelativeDate(item.created_at)}
                    </Text>
                </View>
            </View>
            <Text style={[styles.announcementMessage, { color: colors.textSecondary }]} numberOfLines={3}>
                {item.message}
            </Text>
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
            <AdminHeader title={t('admin.announcements')} />

            <FlatList
                data={announcements}
                keyExtractor={(item) => item.id}
                renderItem={renderAnnouncement}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    !isLoading ? (
                        <EmptyState
                            icon="campaign"
                            title={t('admin.noAnnouncements')}
                            description=""
                        />
                    ) : null
                }
            />

            <FAB
                onPress={() => setModalVisible(true)}
                testID="add-announcement-fab"
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={[styles.modalContainer, { backgroundColor: colors.background }]}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            {t('admin.newAnnouncement')}
                        </Text>
                        <Button
                            title={t('common.cancel')}
                            variant="ghost"
                            size="small"
                            onPress={() => setModalVisible(false)}
                        />
                    </View>

                    <View style={styles.modalContent}>
                        <Input
                            label={t('admin.announcementTitle')}
                            value={title}
                            onChangeText={setTitle}
                            placeholder={t('admin.announcementTitle')}
                            required
                            testID="announcement-title-input"
                        />
                        <Input
                            label={t('admin.announcementMessage')}
                            value={message}
                            onChangeText={setMessage}
                            placeholder={t('admin.announcementMessage')}
                            multiline
                            numberOfLines={4}
                            style={styles.messageInput}
                            required
                            testID="announcement-message-input"
                        />
                        <Button
                            title={t('admin.sendAnnouncement')}
                            onPress={handleSend}
                            fullWidth
                            size="large"
                            loading={createMutation.isPending}
                            disabled={!title.trim() || !message.trim()}
                            testID="send-announcement-button"
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    announcementCard: {
        marginBottom: 12,
    },
    announcementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    announcementIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    announcementHeaderText: {
        flex: 1,
        marginLeft: 12,
    },
    announcementTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    announcementMeta: {
        fontSize: 12,
        marginTop: 2,
    },
    announcementMessage: {
        fontSize: 14,
        lineHeight: 20,
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    messageInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
});
