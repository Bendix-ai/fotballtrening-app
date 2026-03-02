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

interface PendingCompletion {
    userId: string;
    exerciseId: string;
    pointsEarned: number;
    timestamp: string;
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

    // Remembered login (returning player)
    lastLoginYear: string | null;
    lastLoginGender: string | null;
    setLastLoginYear: (year: string | null) => void;
    setLastLoginGender: (gender: string | null) => void;

    // Daily goal
    dailyGoal: number;
    setDailyGoal: (goal: number) => void;

    // Notification preferences
    notificationPrefs: NotificationPreferences;
    setNotificationPref: (key: keyof NotificationPreferences, value: boolean) => void;

    // Sound
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;

    // Streak shield
    streakShieldAvailable: boolean;
    streakShieldUsedDate: string | null;
    useStreakShield: () => void;

    // Login bonus
    lastLoginBonusDate: string | null;
    loginStreak: number;
    awardLoginBonus: () => void;

    // Offline sync queue
    pendingCompletions: PendingCompletion[];
    addPendingCompletion: (completion: PendingCompletion) => void;
    removePendingCompletion: (timestamp: string) => void;
    clearPendingCompletions: () => void;
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

            // Remembered login
            lastLoginYear: null,
            lastLoginGender: null,
            setLastLoginYear: (lastLoginYear) => set({ lastLoginYear }),
            setLastLoginGender: (lastLoginGender) => set({ lastLoginGender }),

            // Daily goal
            dailyGoal: 5,
            setDailyGoal: (dailyGoal) => set({ dailyGoal }),

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

            // Sound
            soundEnabled: true,
            setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

            // Streak shield
            streakShieldAvailable: true,
            streakShieldUsedDate: null,
            useStreakShield: () =>
                set({
                    streakShieldAvailable: false,
                    streakShieldUsedDate: new Date().toISOString().split('T')[0],
                }),

            // Login bonus
            lastLoginBonusDate: null,
            loginStreak: 0,
            awardLoginBonus: () =>
                set((state) => {
                    const today = new Date().toISOString().split('T')[0];
                    if (state.lastLoginBonusDate === today) return {};

                    // DST-safe: use date arithmetic instead of 86400000ms
                    const yesterdayDate = new Date();
                    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const yesterday = yesterdayDate.toISOString().split('T')[0];
                    const isConsecutive = state.lastLoginBonusDate === yesterday;

                    return {
                        lastLoginBonusDate: today,
                        loginStreak: isConsecutive ? state.loginStreak + 1 : 1,
                    };
                }),

            // Offline sync queue
            pendingCompletions: [],
            addPendingCompletion: (completion) =>
                set((state) => ({
                    pendingCompletions: [...state.pendingCompletions, completion],
                })),
            removePendingCompletion: (timestamp) =>
                set((state) => ({
                    pendingCompletions: state.pendingCompletions.filter((c) => c.timestamp !== timestamp),
                })),
            clearPendingCompletions: () => set({ pendingCompletions: [] }),
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
