import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import * as achievementService from '../achievementService';

const mockFrom = (supabase as any)._mockFrom;
const mockChain = (supabase as any)._mockChain;

describe('achievementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
    Object.keys(mockChain).forEach((key) => {
      if (key !== 'single' && key !== 'maybeSingle' && key !== 'then') {
        mockChain[key].mockReturnValue(mockChain);
      }
    });
  });

  describe('getAchievements', () => {
    it('should return mock data when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await achievementService.getAchievements('u1');

      expect(Array.isArray(result)).toBe(true);
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('should return all achievement types with unlock status', async () => {
      const mockData = [{ type: 'first_exercise' }, { type: 'points_100' }];
      mockChain.eq.mockResolvedValue({ data: mockData, error: null });

      const result = await achievementService.getAchievements('u1');

      expect(mockFrom).toHaveBeenCalledWith('achievements');
      expect(result.length).toBe(9); // 9 achievement types total
      expect(result.find(a => a.type === 'first_exercise')?.unlocked).toBe(true);
      expect(result.find(a => a.type === 'points_100')?.unlocked).toBe(true);
      expect(result.find(a => a.type === 'streak_7')?.unlocked).toBe(false);
    });

    it('should mark all as unlocked when all earned', async () => {
      const allTypes = [
        'first_exercise', 'streak_7', 'streak_30',
        'points_100', 'points_500', 'points_1000',
        'exercises_10', 'exercises_50', 'all_categories',
      ];
      const mockData = allTypes.map(type => ({ type }));
      mockChain.eq.mockResolvedValue({ data: mockData, error: null });

      const result = await achievementService.getAchievements('u1');

      expect(result.every(a => a.unlocked)).toBe(true);
    });

    it('should return mock data on error', async () => {
      mockChain.eq.mockResolvedValue({ data: null, error: { message: 'fail' } });

      const result = await achievementService.getAchievements('u1');

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
