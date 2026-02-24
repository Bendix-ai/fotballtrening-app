import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { AdminHeader, Card, Button, ConfirmationDialog } from '../../components';
import { useAuthStore, useAppStore } from '../../stores';
import { useDashboardMetrics } from '../../hooks/useAdmin';
import { getAppVersion } from '../../lib/version';

export function AdminSettingsScreen() {
    const { colors } = useTheme();
    const { user, club, logout } = useAuthStore();
    const { themeMode, setThemeMode, notificationPrefs, setNotificationPref } = useAppStore();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const { data: metrics } = useDashboardMetrics();

    const displayName = user?.display_name || 'Admin';

    const handleLogout = async () => {
        setShowLogoutDialog(false);
        await logout();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
            <AdminHeader title={t('admin.adminSettings')} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                        {t('admin.profileSection')}
                    </Text>
                    <Card style={styles.profileCard}>
                        <View style={styles.profileRow}>
                            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                <Text style={styles.avatarText}>
                                    {displayName.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={[styles.profileName, { color: colors.text }]}>
                                    {displayName}
                                </Text>
                                <Text style={[styles.profileRole, { color: colors.textSecondary }]}>
                                    {t('admin.administrator')}
                                </Text>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Club Settings */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                        {t('admin.clubSettings')}
                    </Text>
                    <Card style={styles.listCard}>
                        <View style={[styles.settingsRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                            <MaterialIcons name="sports-soccer" size={20} color={colors.textSecondary} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>
                                {t('admin.clubName')}
                            </Text>
                            <Text style={[styles.settingsValue, { color: colors.textSecondary }]}>
                                {club?.name ?? '-'}
                            </Text>
                        </View>
                        <View style={styles.settingsRow}>
                            <MaterialIcons name="people" size={20} color={colors.textSecondary} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>
                                {t('admin.totalPlayers')}
                            </Text>
                            <Text style={[styles.settingsValue, { color: colors.textSecondary }]}>
                                {metrics?.totalPlayers ?? '-'}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                        {t('settings.notifications')}
                    </Text>
                    <Card style={styles.listCard}>
                        <View style={[styles.toggleRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                            <MaterialIcons name="email" size={20} color={colors.textSecondary} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>
                                {t('admin.emailNotifications')}
                            </Text>
                            <Switch
                                value={notificationPrefs.emailNotifications}
                                onValueChange={(v) => setNotificationPref('emailNotifications', v)}
                                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                thumbColor={notificationPrefs.emailNotifications ? colors.primary : colors.textTertiary}
                            />
                        </View>
                        <View style={styles.toggleRow}>
                            <MaterialIcons name="notifications" size={20} color={colors.textSecondary} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>
                                {t('admin.pushNotifications')}
                            </Text>
                            <Switch
                                value={notificationPrefs.pushNotifications}
                                onValueChange={(v) => setNotificationPref('pushNotifications', v)}
                                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                thumbColor={notificationPrefs.pushNotifications ? colors.primary : colors.textTertiary}
                            />
                        </View>
                    </Card>
                </View>

                {/* Theme */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                        {t('settings.appearance')}
                    </Text>
                    <Card>
                        <View style={styles.themeButtons}>
                            {(['light', 'dark', 'system'] as const).map((mode) => (
                                <TouchableOpacity
                                    key={mode}
                                    onPress={() => setThemeMode(mode)}
                                    style={[
                                        styles.themeButton,
                                        {
                                            backgroundColor: themeMode === mode ? colors.primary : colors.surface,
                                            borderColor: themeMode === mode ? colors.primary : colors.border,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.themeButtonText,
                                            { color: themeMode === mode ? '#ffffff' : colors.textSecondary },
                                        ]}
                                    >
                                        {t(`settings.${mode}`)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                        {t('admin.support')}
                    </Text>
                    <Card style={styles.listCard}>
                        <TouchableOpacity
                            style={[styles.settingsRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                            onPress={() => Linking.openURL('mailto:support@fotballtrening.no')}
                        >
                            <MaterialIcons name="email" size={20} color={colors.textSecondary} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>
                                {t('admin.contactSupport')}
                            </Text>
                            <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />
                        </TouchableOpacity>
                        <View style={styles.settingsRow}>
                            <MaterialIcons name="info-outline" size={20} color={colors.textSecondary} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>
                                {t('settings.version')}
                            </Text>
                            <Text style={[styles.settingsValue, { color: colors.textTertiary }]}>
                                v{getAppVersion()}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Logout */}
                <View style={styles.section}>
                    <Button
                        title={t('settings.logout')}
                        onPress={() => setShowLogoutDialog(true)}
                        variant="outline"
                        fullWidth
                    />
                </View>
            </ScrollView>

            <ConfirmationDialog
                visible={showLogoutDialog}
                title={t('settings.logout')}
                message={t('settings.logoutConfirm')}
                confirmLabel={t('settings.logout')}
                cancelLabel={t('common.cancel')}
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutDialog(false)}
                destructive
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
    },
    profileCard: {},
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#ffffff',
    },
    profileInfo: {
        marginLeft: 14,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
    },
    profileRole: {
        fontSize: 14,
        marginTop: 2,
    },
    listCard: {
        padding: 0,
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        gap: 12,
    },
    settingsLabel: {
        flex: 1,
        fontSize: 16,
    },
    settingsValue: {
        fontSize: 14,
    },
    themeButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    themeButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
    },
    themeButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
