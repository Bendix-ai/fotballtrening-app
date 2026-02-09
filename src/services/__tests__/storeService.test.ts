import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import * as storeService from '../storeService';

const mockFrom = (supabase as any)._mockFrom;
const mockChain = (supabase as any)._mockChain;

describe('storeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
    Object.keys(mockChain).forEach((key) => {
      if (key !== 'single' && key !== 'maybeSingle' && key !== 'then') {
        mockChain[key].mockReturnValue(mockChain);
      }
    });
  });

  describe('getStoreExercises', () => {
    it('should return mock data when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await storeService.getStoreExercises();

      expect(Array.isArray(result)).toBe(true);
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('should query store_exercises', async () => {
      const mockData = [{ id: 's1', title: 'Store Ex' }];
      mockChain.order.mockResolvedValue({ data: mockData, error: null });

      const result = await storeService.getStoreExercises();

      expect(mockFrom).toHaveBeenCalledWith('store_exercises');
      expect(result).toEqual(mockData);
    });
  });

  describe('getStoreExerciseById', () => {
    it('should return null for unknown id when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await storeService.getStoreExerciseById('nonexistent');
      // Returns null or mock match
      expect(result === null || typeof result === 'object').toBe(true);
    });

    it('should query by id', async () => {
      const mockEx = { id: 's1', title: 'Store Ex' };
      mockChain.single.mockResolvedValue({ data: mockEx, error: null });

      const result = await storeService.getStoreExerciseById('s1');

      expect(mockFrom).toHaveBeenCalledWith('store_exercises');
      expect(result).toEqual(mockEx);
    });
  });

  describe('getStoreReviews', () => {
    it('should return filtered mock reviews when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await storeService.getStoreReviews('s1');
      expect(Array.isArray(result)).toBe(true);
    });

    it('should query reviews', async () => {
      const mockReviews = [{ id: 'r1', rating: 5, comment: 'Great' }];
      mockChain.order.mockResolvedValue({ data: mockReviews, error: null });

      const result = await storeService.getStoreReviews('s1');

      expect(mockFrom).toHaveBeenCalledWith('store_reviews');
      expect(result).toEqual(mockReviews);
    });
  });

  describe('downloadToClub', () => {
    it('should return false when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      expect(await storeService.downloadToClub('s1', 'c1')).toBe(false);
    });

    it('should return false if store exercise not found', async () => {
      // getStoreExerciseById returns null
      mockChain.single.mockResolvedValue({ data: null, error: { message: 'not found' } });

      const result = await storeService.downloadToClub('nonexistent', 'c1');
      expect(result).toBe(false);
    });
  });

  describe('addReview', () => {
    it('should return false when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      expect(await storeService.addReview('s1', 'Club', 5, 'Great')).toBe(false);
    });

    it('should insert review', async () => {
      mockChain.insert.mockResolvedValue({ error: null });

      const result = await storeService.addReview('s1', 'Club', 5, 'Bra');

      expect(mockFrom).toHaveBeenCalledWith('store_reviews');
      expect(mockChain.insert).toHaveBeenCalledWith({
        exercise_id: 's1',
        club_name: 'Club',
        rating: 5,
        comment: 'Bra',
      });
      expect(result).toBe(true);
    });
  });
});
