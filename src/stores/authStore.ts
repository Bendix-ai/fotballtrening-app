import { create } from 'zustand';
import { User, Club, Team } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import * as authService from '../services/authService';
import { setUserId, logLogin, logLogout } from '../lib/analytics';

interface AuthState {
    user: User | null;
    club: Club | null;
    team: Team | null;
    managedTeamIds: string[];
    isLoading: boolean;
    isAuthenticated: boolean;
    isPasswordRecovery: boolean;

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
    clearPasswordRecovery: () => void;
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
    isPasswordRecovery: false,

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

    clearPasswordRecovery: () => set({ isPasswordRecovery: false }),

    initialize: async () => {
        if (!isSupabaseConfigured()) {
            set({ isLoading: false });
            return;
        }

        // Track whether initial load is complete to avoid duplicate profile fetch
        let initialLoadDone = false;

        // Listen for auth state changes — handles subsequent changes after init
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                set({
                    user: null,
                    club: null,
                    team: null,
                    managedTeamIds: [],
                    isAuthenticated: false,
                    isPasswordRecovery: false,
                    isLoading: false,
                });
            } else if (event === 'PASSWORD_RECOVERY' && session?.user) {
                set({
                    isAuthenticated: true,
                    isPasswordRecovery: true,
                    isLoading: false,
                });
            } else if (event === 'SIGNED_IN' && session?.user) {
                // Skip during initial load — session check handles it
                if (!initialLoadDone) return;
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
                }
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
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
                            isLoading: false,
                        });
                    }
                }
            }
        });

        try {
            // Timeout covers the ENTIRE session + profile fetch to prevent infinite loading
            const timeoutMs = 5000;
            let timeoutId: ReturnType<typeof setTimeout>;

            const initPromise = (async () => {
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
                        setUserId(profile.user.id);
                        logLogin(profile.user.role === 'admin' ? 'admin' : 'player');
                        return;
                    }
                }
                set({ isLoading: false });
            })();

            const timeoutPromise = new Promise<void>((_, reject) => {
                timeoutId = setTimeout(() => reject(new Error('Auth init timeout')), timeoutMs);
            });

            await Promise.race([initPromise, timeoutPromise]).finally(() => {
                clearTimeout(timeoutId!);
            });
        } catch (error) {
            console.error('Auth initialize error:', error);
            set({ isLoading: false });
        } finally {
            initialLoadDone = true;
        }
    },

    logout: async () => {
        try {
            if (isSupabaseConfigured()) {
                await authService.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
        logLogout();
        set({
            user: null,
            club: null,
            team: null,
            managedTeamIds: [],
            isAuthenticated: false,
            isPasswordRecovery: false,
            isLoading: false,
        });
    },
}));
