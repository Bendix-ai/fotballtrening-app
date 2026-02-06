import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, ConfirmationDialog } from '../../components';
import { useAuthStore, useAppStore } from '../../stores';
import { ProfileStackParamList } from '../../types';

type SettingsNavProp = NativeStackNavigationProp<ProfileStackParamList, 'Settings'>;

export function SettingsScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<SettingsNavProp>();
    const { logout } = useAuthStore();
    const { themeMode, setThemeMode } = useAppStore();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLogout = () => {
        setShowLogoutDialog(false);
        logout();
    };

    const settingsItems = [
        {
            icon: 'lock' as const,
            label: 'Endre passord',
            onPress: () => navigation.navigate('ChangePassword'),
        },
        {
            icon: 'notifications' as const,
            label: t('settings.notifications'),
            onPress: () => navigation.navigate('Notifications'),
            trailing: <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />,
        },
        {
            icon: 'info-outline' as const,
            label: t('settings.about'),
            onPress: () => navigation.navigate('About'),
            trailing: (
                <Text style={[styles.versionText, { color: colors.textTertiary }]}>
                    v1.0.0
                </Text>
            ),
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('settings.title')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Theme setting */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                        {t('settings.appearance')}
                    </Text>
                    <Card>
                        <Text style={[styles.settingLabel, { color: colors.text }]}>
                            {t('settings.theme')}
                        </Text>
                        <View style={styles.themeButtons}>
                            {(['light', 'dark', 'system'] as const).map((mode) => (
                                <TouchableOpacity
                                    key={mode}
                                    onPress={() => setThemeMode(mode)}
                                    style={[
                                        styles.themeButton,
                                        {
                                            backgroundColor: themeMode === mode
                                                ? colors.primary
                                                : colors.surface,
                                            borderColor: themeMode === mode
                                                ? colors.primary
                                                : colors.border,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.themeButtonText,
                                            {
                                                color: themeMode === mode
                                                    ? '#ffffff'
                                                    : colors.textSecondary,
                                            },
                                        ]}
                                    >
                                        {t(`settings.${mode}`)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card>
                </View>

                {/* Other settings */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                        Generelt
                    </Text>
                    <Card style={styles.settingsListCard}>
                        {settingsItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={item.onPress}
                                style={[
                                    styles.settingsRow,
                                    index < settingsItems.length - 1 && {
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border,
                                    },
                                ]}
                            >
                                <MaterialIcons name={item.icon} size={22} color={colors.textSecondary} />
                                <Text style={[styles.settingsRowLabel, { color: colors.text }]}>
                                    {item.label}
                                </Text>
                                {item.trailing || (
                                    <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />
                                )}
                            </TouchableOpacity>
                        ))}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
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
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
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
    settingsListCard: {
        padding: 0,
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
    },
    settingsRowLabel: {
        flex: 1,
        fontSize: 16,
    },
    versionText: {
        fontSize: 14,
    },
});
