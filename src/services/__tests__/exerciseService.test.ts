import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import * as exerciseService from '../exerciseService';

const mockFrom = (supabase as any)._mockFrom;
const mockChain = (supabase as any)._mockChain;

describe('exerciseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isSupabaseConfigured as jest.Mock).mockReturnValue(true);
    // Reset chain methods to return the chain
    Object.keys(mockChain).forEach((key) => {
      if (key !== 'single' && key !== 'maybeSingle' && key !== 'then') {
        mockChain[key].mockReturnValue(mockChain);
      }
    });
  });

  describe('getExercises', () => {
    it('should return mock data when Supabase not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await exerciseService.getExercises('club1');

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('should query Supabase when configured', async () => {
      const mockExercises = [{ id: '1', title: 'Test' }];
      // Make chain return data as a resolved promise
      mockChain.order.mockResolvedValue({ data: mockExercises, error: null });

      const result = await exerciseService.getExercises('club1');

      expect(mockFrom).toHaveBeenCalledWith('exercises');
      expect(mockChain.select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockExercises);
    });

    it('should return mock data on error', async () => {
      mockChain.order.mockResolvedValue({ data: null, error: { message: 'fail' } });

      const result = await exerciseService.getExercises('club1');

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getExerciseById', () => {
    it('should return mock exercise when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await exerciseService.getExerciseById('1');
      // Returns from mock or null
      expect(result === null || typeof result === 'object').toBe(true);
    });

    it('should query by id', async () => {
      const mockExercise = { id: 'abc', title: 'Test Ex' };
      mockChain.single.mockResolvedValue({ data: mockExercise, error: null });

      const result = await exerciseService.getExerciseById('abc');

      expect(mockFrom).toHaveBeenCalledWith('exercises');
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'abc');
      expect(result).toEqual(mockExercise);
    });
  });

  describe('completeExercise', () => {
    it('should return null when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await exerciseService.completeExercise('u1', 'e1', 10);
      expect(result).toBeNull();
    });

    it('should insert completion', async () => {
      const mockCompletion = { id: 'c1', user_id: 'u1', exercise_id: 'e1', points_earned: 10 };
      mockChain.single.mockResolvedValue({ data: mockCompletion, error: null });

      const result = await exerciseService.completeExercise('u1', 'e1', 10);

      expect(mockFrom).toHaveBeenCalledWith('exercise_completions');
      expect(mockChain.insert).toHaveBeenCalledWith({
        user_id: 'u1',
        exercise_id: 'e1',
        points_earned: 10,
      });
      expect(result).toEqual(mockCompletion);
    });
  });

  describe('getCompletions', () => {
    it('should return empty array when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      const result = await exerciseService.getCompletions('u1');
      expect(result).toEqual([]);
    });

    it('should query completions for user', async () => {
      const mockData = [{ id: 'c1' }];
      mockChain.order.mockResolvedValue({ data: mockData, error: null });

      const result = await exerciseService.getCompletions('u1');

      expect(mockFrom).toHaveBeenCalledWith('exercise_completions');
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', 'u1');
      expect(result).toEqual(mockData);
    });
  });

  describe('getFavorites', () => {
    it('should return empty when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      const result = await exerciseService.getFavorites('u1');
      expect(result).toEqual([]);
    });
  });

  describe('toggleFavorite', () => {
    it('should delete when isFavorite is true', async () => {
      mockChain.delete.mockReturnValue(mockChain);
      mockChain.eq
        .mockReturnValueOnce(mockChain) // .eq('user_id', userId)
        .mockResolvedValueOnce({ error: null }); // .eq('exercise_id', exerciseId) — terminal

      await exerciseService.toggleFavorite('u1', 'e1', true);

      expect(mockFrom).toHaveBeenCalledWith('favorites');
      expect(mockChain.delete).toHaveBeenCalled();
    });

    it('should insert when isFavorite is false', async () => {
      mockChain.insert.mockResolvedValueOnce({ error: null });

      await exerciseService.toggleFavorite('u1', 'e1', false);

      expect(mockFrom).toHaveBeenCalledWith('favorites');
      expect(mockChain.insert).toHaveBeenCalledWith({ user_id: 'u1', exercise_id: 'e1' });
    });
  });

  describe('createExercise', () => {
    it('should return null when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      const result = await exerciseService.createExercise({} as any);
      expect(result).toBeNull();
    });

    it('should insert and return exercise', async () => {
      const mockEx = { id: 'new1', title: 'New' };
      mockChain.single.mockResolvedValue({ data: mockEx, error: null });

      const input = { title: 'New' } as any;
      const result = await exerciseService.createExercise(input);

      expect(mockFrom).toHaveBeenCalledWith('exercises');
      expect(mockChain.insert).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockEx);
    });
  });

  describe('updateExercise', () => {
    it('should update and return exercise', async () => {
      const mockEx = { id: 'e1', title: 'Updated' };
      mockChain.single.mockResolvedValue({ data: mockEx, error: null });

      const result = await exerciseService.updateExercise('e1', { title: 'Updated' });

      expect(mockFrom).toHaveBeenCalledWith('exercises');
      expect(mockChain.update).toHaveBeenCalledWith({ title: 'Updated' });
      expect(result).toEqual(mockEx);
    });
  });

  describe('deleteExercise', () => {
    it('should return false when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);
      const result = await exerciseService.deleteExercise('e1');
      expect(result).toBe(false);
    });

    it('should delete and return true', async () => {
      mockChain.eq.mockResolvedValue({ error: null });

      const result = await exerciseService.deleteExercise('e1');

      expect(mockFrom).toHaveBeenCalledWith('exercises');
      expect(result).toBe(true);
    });
  });
});
