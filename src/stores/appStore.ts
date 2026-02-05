import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
    // Theme
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;

    // Onboarding
    hasCompletedOnboarding: boolean;
    setOnboardingComplete: (complete: boolean) => void;

    // Selected club (before login)
    selectedClubId: string | null;
    setSelectedClubId: (clubId: string | null) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Theme
            themeMode: 'system',
            setThemeMode: (themeMode) => set({ themeMode }),

            // Onboarding
            hasCompletedOnboarding: false,
            setOnboardingComplete: (hasCompletedOnboarding) => set({ hasCompletedOnboarding }),

            // Selected club
            selectedClubId: null,
            setSelectedClubId: (selectedClubId) => set({ selectedClubId }),
        }),
        {
            name: 'fotballtrening-app-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
