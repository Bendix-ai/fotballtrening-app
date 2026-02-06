import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useTheme } from '../lib/theme';
import { t } from '../lib/i18n';
import { useAuthStore } from '../stores';
import { ConfirmationDialog } from '../components';

interface DrawerItem {
    name: string;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
}

const drawerItems: DrawerItem[] = [
    { name: 'Dashboard', label: 'admin.dashboard', icon: 'dashboard' },
    { name: 'Players', label: 'admin.players', icon: 'people' },
    { name: 'ClubStructure', label: 'admin.clubStructure', icon: 'account-tree' },
    { name: 'Exercises', label: 'admin.exercises', icon: 'fitness-center' },
    { name: 'ExerciseStore', label: 'admin.exerciseStore', icon: 'store' },
    { name: 'Reports', label: 'admin.reports', icon: 'bar-chart' },
    { name: 'AdminSettings', label: 'admin.adminSettings', icon: 'settings' },
];

export function AdminDrawerContent(props: DrawerContentComponentProps) {
    const { colors } = useTheme();
    const { user, logout } = useAuthStore();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const activeRoute = props.state.routes[props.state.index]?.name;

    const handleLogout = () => {
        setShowLogoutDialog(false);
        logout();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.card }]}>
            {/* Profile Header */}
            <View style={[styles.profileHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.avatarText}>
                        {(user?.display_name || 'A').charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={[styles.name, { color: colors.text }]}>
                    {user?.display_name || 'Admin'}
                </Text>
                <Text style={[styles.role, { color: colors.textSecondary }]}>
                    Administrator
                </Text>
                <Text style={[styles.club, { color: colors.textTertiary }]}>
                    Våganes IL
                </Text>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.menuList}>
                {drawerItems.map((item) => {
                    const isActive = activeRoute === item.name;
                    return (
                        <TouchableOpacity
                            key={item.name}
                            onPress={() => props.navigation.navigate(item.name)}
                            style={[
                                styles.menuItem,
                                {
                                    backgroundColor: isActive ? colors.primaryLight : 'transparent',
                                },
                            ]}
                        >
                            <MaterialIcons
                                name={item.icon}
                                size={22}
                                color={isActive ? colors.primary : colors.textSecondary}
                            />
                            <Text
                                style={[
                                    styles.menuLabel,
                                    {
                                        color: isActive ? colors.primary : colors.text,
                                        fontWeight: isActive ? '700' : '500',
                                    },
                                ]}
                            >
                                {t(item.label)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Logout */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                    onPress={() => setShowLogoutDialog(true)}
                    style={styles.logoutButton}
                >
                    <MaterialIcons name="logout" size={22} color={colors.error} />
                    <Text style={[styles.logoutText, { color: colors.error }]}>
                        {t('settings.logout')}
                    </Text>
                </TouchableOpacity>
            </View>

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
    profileHeader: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#ffffff',
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
    },
    role: {
        fontSize: 13,
        marginTop: 2,
    },
    club: {
        fontSize: 12,
        marginTop: 2,
    },
    menuList: {
        flex: 1,
        paddingTop: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginHorizontal: 8,
        borderRadius: 12,
        gap: 14,
    },
    menuLabel: {
        fontSize: 15,
    },
    footer: {
        borderTopWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
