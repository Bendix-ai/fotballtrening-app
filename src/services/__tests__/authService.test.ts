import { supabase } from '../../lib/supabase';
import * as authService from '../authService';

// Access the mock chain
const mockAuth = supabase.auth as jest.Mocked<typeof supabase.auth>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUpPlayer', () => {
    it('should sign up a player with synthetic email', async () => {
      const mockData = { user: { id: '123' }, session: null };
      (mockAuth.signUp as jest.Mock).mockResolvedValue({ data: mockData, error: null });

      const result = await authService.signUpPlayer('emma', 'pass123', 'club1', 'team1', 'Emma');

      expect(mockAuth.signUp).toHaveBeenCalledWith({
        email: expect.stringContaining('@fotballtrening.app'),
        password: 'pass123',
        options: {
          data: {
            username: 'emma',
            role: 'player',
            club_id: 'club1',
            team_id: 'team1',
            display_name: 'Emma',
          },
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should throw on error', async () => {
      (mockAuth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Signup failed' },
      });

      await expect(authService.signUpPlayer('emma', 'p', 'c', 't', 'E')).rejects.toEqual({
        message: 'Signup failed',
      });
    });
  });

  describe('signUpClubAdmin', () => {
    it('should sign up a club admin', async () => {
      const mockData = { user: { id: '456' }, session: null };
      (mockAuth.signUp as jest.Mock).mockResolvedValue({ data: mockData, error: null });

      const result = await authService.signUpClubAdmin('admin@test.no', 'pass', 'club1', 'Admin');

      expect(mockAuth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'admin@test.no',
          options: expect.objectContaining({
            data: expect.objectContaining({ role: 'admin', admin_type: 'club_admin' }),
          }),
        }),
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('signUpTeamAdmin', () => {
    it('should sign up a team admin with managed team IDs', async () => {
      const mockData = { user: { id: '789' }, session: null };
      (mockAuth.signUp as jest.Mock).mockResolvedValue({ data: mockData, error: null });

      await authService.signUpTeamAdmin('ta@test.no', 'pass', 'club1', 'TA', ['team1', 'team2']);

      expect(mockAuth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            data: expect.objectContaining({
              admin_type: 'team_admin',
              managed_team_ids: ['team1', 'team2'],
            }),
          }),
        }),
      );
    });
  });

  describe('createClub', () => {
    it('should call rpc to create a club', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: 'new-club-id', error: null });

      const result = await authService.createClub('Test FK');

      expect(supabase.rpc).toHaveBeenCalledWith('create_club', { p_club_name: 'Test FK' });
      expect(result).toBe('new-club-id');
    });

    it('should throw on error', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: { message: 'RPC error' } });

      await expect(authService.createClub('Test')).rejects.toEqual({ message: 'RPC error' });
    });
  });

  describe('loginPlayer', () => {
    it('should login with synthetic email', async () => {
      const mockData = { user: { id: '123' }, session: { access_token: 'tok' } };
      (mockAuth.signInWithPassword as jest.Mock).mockResolvedValue({ data: mockData, error: null });

      const result = await authService.loginPlayer('emma', 'pass', 'team1');

      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: expect.stringContaining('@fotballtrening.app'),
        password: 'pass',
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('loginAdmin', () => {
    it('should login with email', async () => {
      const mockData = { user: { id: '456' }, session: { access_token: 'tok' } };
      (mockAuth.signInWithPassword as jest.Mock).mockResolvedValue({ data: mockData, error: null });

      const result = await authService.loginAdmin('admin@test.no', 'pass');

      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'admin@test.no',
        password: 'pass',
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('logout', () => {
    it('should sign out', async () => {
      (mockAuth.signOut as jest.Mock).mockResolvedValue({ error: null });

      await authService.logout();

      expect(mockAuth.signOut).toHaveBeenCalled();
    });

    it('should throw on error', async () => {
      (mockAuth.signOut as jest.Mock).mockResolvedValue({ error: { message: 'fail' } });

      await expect(authService.logout()).rejects.toEqual({ message: 'fail' });
    });
  });

  describe('getSession', () => {
    it('should return session', async () => {
      const mockSession = { access_token: 'tok', user: { id: '1' } };
      (mockAuth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await authService.getSession();
      expect(result).toEqual(mockSession);
    });

    it('should return null when no session', async () => {
      (mockAuth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await authService.getSession();
      expect(result).toBeNull();
    });
  });
});
