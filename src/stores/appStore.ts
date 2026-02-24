import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, setLanguage } from '../lib/i18n';

type ThemeMode = 'light' | 'dark' | 'system';

interface NotificationPreferences {
    dailyReminder: boolean;
    newExercises: boolean;
    leaderboardUpdates: boolean;
    streakReminder: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

interface AppState {
    // Theme
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;

    // Language
    language: Language;
    setAppLanguage: (lang: Language) => void;

    // Onboarding
    hasCompletedOnboarding: boolean;
    setOnboardingComplete: (complete: boolean) => void;

    // Selected club (before login)
    selectedClubId: string | null;
    setSelectedClubId: (clubId: string | null) => void;

    // Notification preferences
    notificationPrefs: NotificationPreferences;
    setNotificationPref: (key: keyof NotificationPreferences, value: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Theme
            themeMode: 'system',
            setThemeMode: (themeMode) => set({ themeMode }),

            // Language
            language: 'no',
            setAppLanguage: (language) => {
                setLanguage(language);
                set({ language });
            },

            // Onboarding
            hasCompletedOnboarding: false,
            setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),

            // Selected club
            selectedClubId: null,
            setSelectedClubId: (selectedClubId) => set({ selectedClubId }),

            // Notification preferences
            notificationPrefs: {
                dailyReminder: true,
                newExercises: true,
                leaderboardUpdates: false,
                streakReminder: true,
                emailNotifications: true,
                pushNotifications: true,
            },
            setNotificationPref: (key, value) =>
                set((state) => ({
                    notificationPrefs: { ...state.notificationPrefs, [key]: value },
                })),
        }),
        {
            name: 'fotballtrening-app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                // Sync i18n module with persisted language on app start
                if (state?.language) {
                    setLanguage(state.language);
                }
            },
        }
    )
);
