import { create } from 'zustand';
import { User, Club, Team } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import * as authService from '../services/authService';

interface AuthState {
    user: User | null;
    club: Club | null;
    team: Team | null;
    managedTeamIds: string[];
    isLoading: boolean;
    isAuthenticated: boolean;

    // Derived helpers
    isClubAdmin: () => boolean;
    isTeamAdmin: () => boolean;
    getEffectiveTeamIds: () => string[] | null;

    // Actions
    setUser: (user: User | null) => void;
    setClub: (club: Club | null) => void;
    setTeam: (team: Team | null) => void;
    setManagedTeamIds: (ids: string[]) => void;
    setLoading: (loading: boolean) => void;
    initialize: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    club: null,
    team: null,
    managedTeamIds: [],
    isLoading: true,
    isAuthenticated: false,

    isClubAdmin: () => {
        const { user } = get();
        return user?.role === 'admin' && user?.admin_type === 'club_admin';
    },

    isTeamAdmin: () => {
        const { user } = get();
        return user?.role === 'admin' && user?.admin_type === 'team_admin';
    },

    getEffectiveTeamIds: () => {
        const { user, managedTeamIds } = get();
        if (!user || user.role !== 'admin') return null;
        if (user.admin_type === 'club_admin') return null; // null = no filter, see all
        return managedTeamIds; // team_admin: return specific team IDs
    },

    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
        isLoading: false
    }),

    setClub: (club) => set({ club }),

    setTeam: (team) => set({ team }),

    setManagedTeamIds: (managedTeamIds) => set({ managedTeamIds }),

    setLoading: (isLoading) => set({ isLoading }),

    initialize: async () => {
        if (!isSupabaseConfigured()) {
            set({ isLoading: false });
            return;
        }

        try {
            const session = await authService.getSession();
            if (session?.user) {
                const profile = await authService.getProfile(session.user.id);
                if (profile) {
                    set({
                        user: profile.user,
                        club: profile.club,
                        team: profile.team,
                        managedTeamIds: profile.managedTeamIds,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return;
                }
            }
        } catch (error) {
            console.error('Auth initialize error:', error);
        }

        set({ isLoading: false });

        // Listen for auth state changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                set({
                    user: null,
                    club: null,
                    team: null,
                    managedTeamIds: [],
                    isAuthenticated: false,
                });
            } else if (event === 'SIGNED_IN' && session?.user) {
                const profile = await authService.getProfile(session.user.id);
                if (profile) {
                    set({
                        user: profile.user,
                        club: profile.club,
                        team: profile.team,
                        managedTeamIds: profile.managedTeamIds,
                        isAuthenticated: true,
                    });
                }
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                // Re-fetch profile on token refresh to get latest data
                const { user: currentUser } = get();
                if (!currentUser) {
                    const profile = await authService.getProfile(session.user.id);
                    if (profile) {
                        set({
                            user: profile.user,
                            club: profile.club,
                            team: profile.team,
                            managedTeamIds: profile.managedTeamIds,
                            isAuthenticated: true,
                        });
                    }
                }
            }
        });
    },

    logout: async () => {
        try {
            if (isSupabaseConfigured()) {
                await authService.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
        set({
            user: null,
            club: null,
            team: null,
            managedTeamIds: [],
            isAuthenticated: false,
            isLoading: false,
        });
    },
}));
