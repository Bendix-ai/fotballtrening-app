import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useAppStore } from '../stores';

type Theme = 'light' | 'dark';

interface ThemeColors {
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    primary: string;
    primaryLight: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    streak: string;
}

interface ThemeContextType {
    theme: Theme;
    colors: ThemeColors;
    isDark: boolean;
}

const lightColors: ThemeColors = {
    background: '#f8fafc',
    surface: '#ffffff',
    card: '#ffffff',
    text: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',
    border: '#e2e8f0',
    primary: '#4caf50',
    primaryLight: '#e8f5e9',
    accent: '#2196f3',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    streak: '#f97316',
};

const darkColors: ThemeColors = {
    background: '#0f172a',
    surface: '#1e293b',
    card: '#334155',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',
    border: '#334155',
    primary: '#66bb6a',
    primaryLight: '#1b5e20',
    accent: '#64b5f6',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    streak: '#fb923c',
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
