import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTheme } from '../lib/theme';

interface AdminHeaderProps {
    title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={styles.menuButton}
            >
                <MaterialIcons name="menu" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <View style={{ width: 40 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    menuButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
});
