import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useAppStore } from '../stores';
import { colors as tokens } from './design-tokens';

type Theme = 'light' | 'dark';

interface ThemeColors {
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    textDisabled: string;
    border: string;
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    accent: string;
    info: string;
    success: string;
    warning: string;
    error: string;
    streak: string;
    leaderboardGold: string;
    leaderboardSilver: string;
    leaderboardBronze: string;
}

interface ThemeContextType {
    theme: Theme;
    colors: ThemeColors;
    isDark: boolean;
}

const lightColors: ThemeColors = {
    background: tokens.background.primary,
    surface: tokens.background.secondary,
    card: tokens.background.primary,
    text: tokens.text.primary,
    textSecondary: tokens.text.secondary,
    textTertiary: tokens.text.tertiary,
    textDisabled: tokens.text.disabled,
    border: tokens.border.default,
    primary: tokens.primary.main,
    primaryLight: '#E8F5E9',
    primaryDark: tokens.primary.dark,
    secondary: tokens.secondary.main,
    secondaryLight: '#FFF3E0',
    accent: tokens.info,
    info: tokens.info,
    success: tokens.success,
    warning: tokens.warning,
    error: tokens.error,
    streak: tokens.secondary.main,
    leaderboardGold: tokens.leaderboard.gold,
    leaderboardSilver: tokens.leaderboard.silver,
    leaderboardBronze: tokens.leaderboard.bronze,
};

const darkColors: ThemeColors = {
    background: tokens.dark.background.primary,
    surface: tokens.dark.background.secondary,
    card: tokens.dark.background.tertiary,
    text: tokens.dark.text.primary,
    textSecondary: tokens.dark.text.secondary,
    textTertiary: tokens.dark.text.tertiary,
    textDisabled: tokens.dark.text.disabled,
    border: tokens.dark.border.default,
    primary: tokens.primary.light,
    primaryLight: tokens.primary.dark,
    primaryDark: tokens.primary.main,
    secondary: tokens.secondary.main,
    secondaryLight: tokens.secondary.dark,
    accent: '#64B5F6',
    info: '#64B5F6',
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
    streak: tokens.secondary.light,
    leaderboardGold: tokens.leaderboard.gold,
    leaderboardSilver: tokens.leaderboard.silver,
    leaderboardBronze: tokens.leaderboard.bronze,
};

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    colors: lightColors,
    isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const { themeMode } = useAppStore();
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        if (themeMode === 'system') {
            setTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
        } else {
            setTheme(themeMode as Theme);
        }
    }, [themeMode, systemColorScheme]);

    const colors = theme === 'dark' ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, colors, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export { lightColors, darkColors };
export type { Theme, ThemeColors };
