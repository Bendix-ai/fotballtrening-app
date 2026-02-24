import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../lib/theme';
import { t } from '../lib/i18n';
import { useAuthStore, useAppStore } from '../stores';
import { RootStackParamList, MainTabParamList } from '../types';

// Screens
import { LoginScreen } from '../features/auth/LoginScreen';
import { RegisterScreen } from '../features/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../features/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../features/auth/ResetPasswordScreen';
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
    const { colors, isDark } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    borderTopColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 88,
                    paddingTop: 8,
                    paddingBottom: 28,
                },
                tabBarBackground: () => (
                    <BlurView
                        tint={isDark ? 'dark' : 'light'}
                        intensity={80}
                        style={StyleSheet.absoluteFill}
                    />
                ),
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                tabBarIcon: ({ color, size }) => (
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
                options={{ tabBarLabel: t('tabs.home'), tabBarButtonTestID: 'tab-home' }}
            />
            <Tab.Screen
                name="ExercisesTab"
                component={ExercisesStack}
                options={{ tabBarLabel: t('tabs.exercises'), tabBarButtonTestID: 'tab-exercises' }}
            />
            <Tab.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{ tabBarLabel: t('tabs.leaderboard'), tabBarButtonTestID: 'tab-leaderboard' }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{ tabBarLabel: t('tabs.profile'), tabBarButtonTestID: 'tab-profile' }}
            />
        </Tab.Navigator>
    );
}

export function AppNavigator() {
    const { colors, isDark } = useTheme();
    const { isAuthenticated, isLoading, user, isPasswordRecovery } = useAuthStore();
    const { hasCompletedOnboarding } = useAppStore();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Image source={require('../../assets/Fotballtrening_icon.png')} style={{ width: 64, height: 64, borderRadius: 16 }} />
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
                ) : isAuthenticated && isPasswordRecovery ? (
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                ) : isAuthenticated ? (
                    user?.role === 'admin' ? (
                        <Stack.Screen name="AdminMain" component={AdminStack} />
                    ) : (
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                    )
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    </>
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
