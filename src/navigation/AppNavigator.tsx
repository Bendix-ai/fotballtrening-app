import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../lib/theme';
import { t } from '../lib/i18n';
import { useAuthStore } from '../stores';
import { RootStackParamList, MainTabParamList } from '../types';

// Screens
import { LoginScreen } from '../features/auth/LoginScreen';
import { HomeScreen } from '../features/home/HomeScreen';
import { ExercisesScreen } from '../features/exercises/ExercisesScreen';
import { LeaderboardScreen } from '../features/leaderboard/LeaderboardScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab bar icons using text/emoji for now
const TabIcon = ({ name, focused, color }: { name: string; focused: boolean; color: string }) => {
    const getIcon = () => {
        switch (name) {
            case 'Home':
                return '🏠';
            case 'Exercises':
                return '⚽';
            case 'Leaderboard':
                return '🏆';
            case 'Profile':
                return '👤';
            default:
                return '•';
        }
    };

    return (
        <View style={styles.tabIconContainer}>
            <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}>
                {getIcon()}
            </Text>
        </View>
    );
};

function MainTabs() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.surface,
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
                tabBarIcon: ({ focused, color }) => (
                    <TabIcon name={route.name} focused={focused} color={color} />
                ),
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarLabel: t('tabs.home') }}
            />
            <Tab.Screen
                name="Exercises"
                component={ExercisesScreen}
                options={{ tabBarLabel: t('tabs.exercises') }}
            />
            <Tab.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{ tabBarLabel: t('tabs.leaderboard') }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarLabel: t('tabs.profile') }}
            />
        </Tab.Navigator>
    );
}

export function AppNavigator() {
    const { colors, isDark } = useTheme();
    const { isAuthenticated, isLoading } = useAuthStore();

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.loadingEmoji}>⚽</Text>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                    {t('common.loading')}
                </Text>
            </View>
        );
    }

    // Create custom theme based on our colors, properly extending base themes
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
                {isAuthenticated ? (
                    <Stack.Screen name="MainTabs" component={MainTabs} />
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
    },
    loadingEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 16,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 24,
    },
});
