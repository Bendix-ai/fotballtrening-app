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

export function AdminSettingsScreen() {
    const { colors } = useTheme();
    const { user, logout } = useAuthStore();
    const { themeMode, setThemeMode } = useAppStore();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    const displayName = user?.display_name || 'Admin';

    const handleLogout = () => {
        setShowLogoutDialog(false);
        logout();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
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
                                    Administrator
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
                                Våganes IL
                            </Text>
                        </View>
                        <View style={styles.settingsRow}>
                            <MaterialIcons name="people" size={20} color={colors.textSecondary} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>
                                {t('admin.totalPlayers')}
                            </Text>
                            <Text style={[styles.settingsValue, { color: colors.textSecondary }]}>
                                12
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
                                E-postvarsler
                            </Text>
                            <Switch
                                value={emailNotifications}
                                onValueChange={setEmailNotifications}
                                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                thumbColor={emailNotifications ? colors.primary : colors.textTertiary}
                            />
                        </View>
                        <View style={styles.toggleRow}>
                            <MaterialIcons name="notifications" size={20} color={colors.textSecondary} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>
                                Push-varsler
                            </Text>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                                thumbColor={pushNotifications ? colors.primary : colors.textTertiary}
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
                        <TouchableOpacity
                            style={[styles.settingsRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}
                            onPress={() => Linking.openURL('https://fotballtrening.no/help')}
                        >
                            <MaterialIcons name="help-outline" size={20} color={colors.textSecondary} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>
                                {t('admin.helpCenter')}
                            </Text>
                            <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />
                        </TouchableOpacity>
                        <View style={styles.settingsRow}>
                            <MaterialIcons name="info-outline" size={20} color={colors.textSecondary} />
                            <Text style={[styles.settingsLabel, { color: colors.text }]}>
                                {t('settings.version')}
                            </Text>
                            <Text style={[styles.settingsValue, { color: colors.textTertiary }]}>
                                v1.0.0
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
