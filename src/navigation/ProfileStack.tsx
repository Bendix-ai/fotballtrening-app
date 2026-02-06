import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { SettingsScreen } from '../features/profile/SettingsScreen';
import { ChangePasswordScreen } from '../features/profile/ChangePasswordScreen';
import { NotificationsScreen } from '../features/profile/NotificationsScreen';
import { AboutScreen } from '../features/profile/AboutScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
    );
}
