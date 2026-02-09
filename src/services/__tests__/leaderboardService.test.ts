import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import * as leaderboardService from '../leaderboardService';

describe('leaderboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
  });

  describe('getLeaderboard', () => {
    it('should return mock data when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await leaderboardService.getLeaderboard('c1');

      expect(Array.isArray(result)).toBe(true);
      expect(supabase.rpc).not.toHaveBeenCalled();
    });

    it('should call RPC with correct params', async () => {
      const mockData = [
        { rank: 1, user_id: 'u1', display_name: 'Emma', avatar_url: null, total_points: 100, exercises_completed: 10, current_streak: 5, is_current_user: false },
      ];
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockData, error: null });

      const result = await leaderboardService.getLeaderboard('c1', 'club', null, 'week', 'u2');

      expect(supabase.rpc).toHaveBeenCalledWith('get_leaderboard', {
        p_club_id: 'c1',
        p_scope: 'club',
        p_scope_id: null,
        p_period: 'week',
        p_current_user_id: 'u2',
        p_limit: 50,
      });
      expect(result).toHaveLength(1);
      expect(result[0].rank).toBe(1);
      expect(result[0].total_points).toBe(100);
    });

    it('should use defaults for optional params', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: [], error: null });

      await leaderboardService.getLeaderboard('c1');

      expect(supabase.rpc).toHaveBeenCalledWith('get_leaderboard', {
        p_club_id: 'c1',
        p_scope: 'club',
        p_scope_id: null,
        p_period: 'all_time',
        p_current_user_id: null,
        p_limit: 50,
      });
    });

    it('should return mock data on error', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: { message: 'fail' } });

      const result = await leaderboardService.getLeaderboard('c1');

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
