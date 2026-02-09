import { useAuthStore } from '../authStore';
import * as authService from '../../services/authService';
import { isSupabaseConfigured } from '../../lib/supabase';

jest.mock('../../services/authService');

const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store to initial state
    useAuthStore.setState({
      user: null,
      club: null,
      team: null,
      managedTeamIds: [],
      isLoading: true,
      isAuthenticated: false,
    });
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.club).toBeNull();
      expect(state.team).toBeNull();
      expect(state.managedTeamIds).toEqual([]);
      expect(state.isLoading).toBe(true);
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should set user and isAuthenticated', () => {
      const user = { id: 'u1', username: 'test', role: 'player' as const } as any;
      useAuthStore.getState().setUser(user);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should clear auth when user is null', () => {
      useAuthStore.getState().setUser({ id: 'u1' } as any);
      useAuthStore.getState().setUser(null);

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setClub', () => {
    it('should set club', () => {
      const club = { id: 'c1', name: 'Test FK' } as any;
      useAuthStore.getState().setClub(club);
      expect(useAuthStore.getState().club).toEqual(club);
    });
  });

  describe('setTeam', () => {
    it('should set team', () => {
      const team = { id: 't1', name: 'Gutter 2015' } as any;
      useAuthStore.getState().setTeam(team);
      expect(useAuthStore.getState().team).toEqual(team);
    });
  });

  describe('setManagedTeamIds', () => {
    it('should set managed team IDs', () => {
      useAuthStore.getState().setManagedTeamIds(['t1', 't2']);
      expect(useAuthStore.getState().managedTeamIds).toEqual(['t1', 't2']);
    });
  });

  describe('isClubAdmin', () => {
    it('should return true for club admin', () => {
      useAuthStore.setState({
        user: { id: 'u1', role: 'admin', admin_type: 'club_admin' } as any,
      });
      expect(useAuthStore.getState().isClubAdmin()).toBe(true);
    });

    it('should return false for team admin', () => {
      useAuthStore.setState({
        user: { id: 'u1', role: 'admin', admin_type: 'team_admin' } as any,
      });
      expect(useAuthStore.getState().isClubAdmin()).toBe(false);
    });

    it('should return false for player', () => {
      useAuthStore.setState({
        user: { id: 'u1', role: 'player' } as any,
      });
      expect(useAuthStore.getState().isClubAdmin()).toBe(false);
    });
  });

  describe('isTeamAdmin', () => {
    it('should return true for team admin', () => {
      useAuthStore.setState({
        user: { id: 'u1', role: 'admin', admin_type: 'team_admin' } as any,
      });
      expect(useAuthStore.getState().isTeamAdmin()).toBe(true);
    });

    it('should return false for club admin', () => {
      useAuthStore.setState({
        user: { id: 'u1', role: 'admin', admin_type: 'club_admin' } as any,
      });
      expect(useAuthStore.getState().isTeamAdmin()).toBe(false);
    });
  });

  describe('getEffectiveTeamIds', () => {
    it('should return null for club admin (no filter)', () => {
      useAuthStore.setState({
        user: { id: 'u1', role: 'admin', admin_type: 'club_admin' } as any,
        managedTeamIds: ['t1', 't2'],
      });
      expect(useAuthStore.getState().getEffectiveTeamIds()).toBeNull();
    });

    it('should return managedTeamIds for team admin', () => {
      useAuthStore.setState({
        user: { id: 'u1', role: 'admin', admin_type: 'team_admin' } as any,
        managedTeamIds: ['t1', 't2'],
      });
      expect(useAuthStore.getState().getEffectiveTeamIds()).toEqual(['t1', 't2']);
    });

    it('should return null for non-admin', () => {
      useAuthStore.setState({
        user: { id: 'u1', role: 'player' } as any,
      });
      expect(useAuthStore.getState().getEffectiveTeamIds()).toBeNull();
    });

    it('should return null when no user', () => {
      expect(useAuthStore.getState().getEffectiveTeamIds()).toBeNull();
    });
  });

  describe('initialize', () => {
    it('should set loading false when Supabase not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      await useAuthStore.getState().initialize();

      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should restore session and profile', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
      const mockSession = { user: { id: 'u1' } };
      const mockProfile = {
        user: { id: 'u1', role: 'player', username: 'test' },
        club: { id: 'c1', name: 'Test FK' },
        team: { id: 't1' },
        managedTeamIds: [],
      };
      mockAuthService.getSession.mockResolvedValue(mockSession as any);
      mockAuthService.getProfile.mockResolvedValue(mockProfile as any);

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockProfile.user);
      expect(state.club).toEqual(mockProfile.club);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should set loading false when no session', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
      mockAuthService.getSession.mockResolvedValue(null);

      await useAuthStore.getState().initialize();

      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
      mockAuthService.getSession.mockRejectedValue(new Error('fail'));

      await useAuthStore.getState().initialize();

      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear all auth state', async () => {
      useAuthStore.setState({
        user: { id: 'u1' } as any,
        club: { id: 'c1' } as any,
        team: { id: 't1' } as any,
        managedTeamIds: ['t1'],
        isAuthenticated: true,
      });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.club).toBeNull();
      expect(state.team).toBeNull();
      expect(state.managedTeamIds).toEqual([]);
      expect(state.isAuthenticated).toBe(false);
    });

    it('should call authService.logout when configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
      mockAuthService.logout.mockResolvedValue(undefined);

      await useAuthStore.getState().logout();

      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('should handle logout errors gracefully', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
      mockAuthService.logout.mockRejectedValue(new Error('fail'));

      await useAuthStore.getState().logout();

      // State should still be cleared
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
