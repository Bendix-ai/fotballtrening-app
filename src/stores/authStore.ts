import { create } from 'zustand';
import { User, Club, Team } from '../types';

interface AuthState {
    user: User | null;
    club: Club | null;
    team: Team | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setClub: (club: Club | null) => void;
    setTeam: (team: Team | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    club: null,
    team: null,
    isLoading: true,
    isAuthenticated: false,

    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false
    }),

    setClub: (club) => set({ club }),

    setTeam: (team) => set({ team }),

    setLoading: (isLoading) => set({ isLoading }),

    logout: () => set({
        user: null,
        club: null,
        team: null,
        isAuthenticated: false,
        isLoading: false
    }),
}));
