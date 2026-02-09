import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import * as adminService from '../adminService';

const mockFrom = (supabase as any)._mockFrom;
const mockChain = (supabase as any)._mockChain;

describe('adminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
    Object.keys(mockChain).forEach((key) => {
      if (key !== 'single' && key !== 'maybeSingle' && key !== 'then') {
        mockChain[key].mockReturnValue(mockChain);
      }
    });
  });

  describe('getPlayers', () => {
    it('should return mock data when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await adminService.getPlayers('club1');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('should query players for club', async () => {
      const mockData = [
        {
          id: 'p1',
          display_name: 'Test',
          username: 'test',
          total_points: 100,
          current_streak: 3,
          is_active: true,
          last_login: '2026-01-01',
          teams: { gender: 'boys', year_groups: { year: 2015 } },
        },
      ];
      mockChain.order.mockResolvedValue({ data: mockData, error: null });

      const result = await adminService.getPlayers('club1');

      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(result.length).toBe(1);
      expect(result[0].display_name).toBe('Test');
    });

    it('should apply team scoping', async () => {
      // .order() returns mockChain (default), then .in() is the terminal await
      mockChain.in.mockResolvedValueOnce({ data: [], error: null });

      await adminService.getPlayers('club1', undefined, ['team1', 'team2']);

      expect(mockChain.in).toHaveBeenCalledWith('team_id', ['team1', 'team2']);
    });

    it('should filter by year and gender', async () => {
      const mockData = [
        {
          id: 'p1', display_name: 'A', username: 'a', total_points: 0,
          current_streak: 0, is_active: true, last_login: null,
          teams: { gender: 'boys', year_groups: { year: 2015 } },
        },
        {
          id: 'p2', display_name: 'B', username: 'b', total_points: 0,
          current_streak: 0, is_active: true, last_login: null,
          teams: { gender: 'girls', year_groups: { year: 2014 } },
        },
      ];
      mockChain.order.mockResolvedValue({ data: mockData, error: null });

      const result = await adminService.getPlayers('club1', { yearGroup: 2015 });
      expect(result.length).toBe(1);
      expect(result[0].year_group).toBe(2015);
    });
  });

  describe('getDashboardMetrics', () => {
    it('should return mock metrics when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await adminService.getDashboardMetrics('club1');

      expect(result).toHaveProperty('totalPlayers');
      expect(result).toHaveProperty('engagementRate');
    });

    it('should call scoped RPC', async () => {
      const mockMetrics = [{
        total_players: 10,
        active_last_7_days: 8,
        total_completions: 50,
        engagement_rate: 80,
      }];
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockMetrics, error: null });

      const result = await adminService.getDashboardMetrics('club1', ['team1']);

      expect(supabase.rpc).toHaveBeenCalledWith('get_dashboard_metrics_scoped', {
        p_club_id: 'club1',
        p_team_ids: ['team1'],
      });
      expect(result.totalPlayers).toBe(10);
    });

    it('should fall back to non-scoped RPC on PGRST202', async () => {
      (supabase.rpc as jest.Mock)
        .mockResolvedValueOnce({ data: null, error: { code: 'PGRST202' } })
        .mockResolvedValueOnce({ data: [{ total_players: 5, active_last_7_days: 3, total_completions: 20, engagement_rate: 60 }], error: null });

      const result = await adminService.getDashboardMetrics('club1');

      expect(supabase.rpc).toHaveBeenCalledTimes(2);
      expect(result.totalPlayers).toBe(5);
    });
  });

  describe('getRecentActivity', () => {
    it('should return mock when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await adminService.getRecentActivity('club1');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('deletePlayer', () => {
    it('should return false when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      expect(await adminService.deletePlayer('p1')).toBe(false);
    });

    it('should set is_active to false', async () => {
      mockChain.eq.mockResolvedValue({ error: null });

      const result = await adminService.deletePlayer('p1');

      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockChain.update).toHaveBeenCalledWith({ is_active: false });
      expect(result).toBe(true);
    });
  });
});
