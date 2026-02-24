import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import * as clubService from '../clubService';

const mockFrom = (supabase as any)._mockFrom;
const mockChain = (supabase as any)._mockChain;

describe('clubService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
    Object.keys(mockChain).forEach((key) => {
      if (key !== 'single' && key !== 'maybeSingle' && key !== 'then') {
        mockChain[key].mockReturnValue(mockChain);
      }
    });
  });

  describe('getClubs', () => {
    it('should return mock clubs when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      const result = await clubService.getClubs();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should query clubs', async () => {
      const mockClubs = [{ id: 'c1', name: 'Test FK' }];
      mockChain.order.mockResolvedValue({ data: mockClubs, error: null });

      const result = await clubService.getClubs();

      expect(mockFrom).toHaveBeenCalledWith('clubs');
      expect(result).toEqual(mockClubs);
    });
  });

  describe('getYearGroups', () => {
    it('should return mock data when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      const result = await clubService.getYearGroups('c1');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return formatted year groups', async () => {
      const mockData = [{ id: 'yg1', year: 2015 }, { id: 'yg2', year: 2014 }];
      mockChain.order.mockResolvedValue({ data: mockData, error: null });

      const result = await clubService.getYearGroups('c1');

      expect(result).toEqual([
        { value: 'yg1', label: '2015' },
        { value: 'yg2', label: '2014' },
      ]);
    });
  });

  describe('getTeams', () => {
    it('should return mock genders when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      const result = await clubService.getTeams('yg1');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return formatted teams with labels', async () => {
      const mockData = [
        { id: 't1', gender: 'boys', name: 'Gutter 2015' },
        { id: 't2', gender: 'girls', name: 'Jenter 2015' },
      ];
      mockChain.order.mockResolvedValue({ data: mockData, error: null });

      const result = await clubService.getTeams('yg1');

      expect(result).toEqual([
        { value: 'boys', label: 'Gutter', teamId: 't1' },
        { value: 'girls', label: 'Jenter', teamId: 't2' },
      ]);
    });
  });

  describe('getClubStructure', () => {
    it('should return mock when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      const result = await clubService.getClubStructure('c1');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should call RPC', async () => {
      const mockStructure = [{ year: 2015, teams: [] }];
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockStructure, error: null });

      const result = await clubService.getClubStructure('c1');

      expect(supabase.rpc).toHaveBeenCalledWith('get_club_structure', { p_club_id: 'c1' });
      expect(result).toEqual(mockStructure);
    });
  });

  describe('getAllTeamsForClub', () => {
    it('should return empty when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      const result = await clubService.getAllTeamsForClub('c1');
      expect(result).toEqual([]);
    });
  });

  describe('addYearGroup', () => {
    it('should throw when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      await expect(clubService.addYearGroup('c1', 2015)).rejects.toThrow('Supabase not configured');
    });

    it('should insert year group and auto-create teams', async () => {
      const mockYg = { id: 'yg-new' };
      mockChain.single.mockResolvedValue({ data: mockYg, error: null });
      // Second call for teams insert
      mockChain.insert.mockReturnValue(mockChain);
      mockChain.select.mockReturnValue(mockChain);

      // Mock the second from() call for teams
      mockFrom
        .mockReturnValueOnce(mockChain) // year_groups insert
        .mockReturnValueOnce({ ...mockChain, insert: jest.fn().mockResolvedValue({ error: null }) }); // teams insert

      const result = await clubService.addYearGroup('c1', 2015);

      expect(mockFrom).toHaveBeenCalledWith('year_groups');
      expect(result).toBe(true);
    });
  });
});
