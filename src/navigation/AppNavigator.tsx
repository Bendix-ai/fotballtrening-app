import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';
import { t } from '../lib/i18n';
import { useAuthStore, useAppStore } from '../stores';
import { RootStackParamList, MainTabParamList } from '../types';

// Screens
import { LoginScreen } from '../features/auth/LoginScreen';
import { OnboardingScreen } from '../features/onboarding/OnboardingScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { LeaderboardScreen } from '../features/leaderboard/LeaderboardScreen';

// Nested stacks
import { ExercisesStack } from './ExercisesStack';
import { ProfileStack } from './ProfileStack';
import { AdminStack } from './AdminStack';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
    Home: 'home',
    ExercisesTab: 'fitness-center',
    Leaderboard: 'leaderboard',
    ProfileTab: 'person',
};

function MainTabs() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 88,
                    paddingTop: 8,
                    paddingBottom: 28,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                tabBarIcon: ({ focused, color, size }) => (
                    <MaterialIcons
                        name={TAB_ICONS[route.name] || 'circle'}
                        size={size}
                        color={color}
                    />
                ),
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarLabel: t('tabs.home') }}
            />
            <Tab.Screen
                name="ExercisesTab"
                component={ExercisesStack}
                options={{ tabBarLabel: t('tabs.exercises') }}
            />
            <Tab.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{ tabBarLabel: t('tabs.leaderboard') }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{ tabBarLabel: t('tabs.profile') }}
            />
        </Tab.Navigator>
    );
}

export function AppNavigator() {
    const { colors, isDark } = useTheme();
    const { isAuthenticated, isLoading, user } = useAuthStore();
    const { hasCompletedOnboarding } = useAppStore();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <MaterialIcons name="sports-soccer" size={48} color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    {t('common.loading')}
                </Text>
            </View>
        );
    }

    // Create custom theme based on our colors
    const navigationTheme = {
        ...(isDark ? DarkTheme : DefaultTheme),
        colors: {
            ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
            primary: colors.primary,
            background: colors.background,
            card: colors.card,
            text: colors.text,
            border: colors.border,
            notification: colors.error,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!hasCompletedOnboarding ? (
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                ) : isAuthenticated ? (
                    user?.role === 'admin' ? (
                        <Stack.Screen name="AdminMain" component={AdminStack} />
                    ) : (
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                    )
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    loadingText: {
        fontSize: 16,
    },
});
