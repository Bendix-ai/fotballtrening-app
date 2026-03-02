import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import * as friendService from '../friendService';

const mockFrom = (supabase as any)._mockFrom;
const mockChain = (supabase as any)._mockChain;

describe('friendService', () => {
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

  describe('getFriends', () => {
    it('should return empty array when Supabase not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await friendService.getFriends('u1');

      expect(result).toEqual([]);
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('should query friendships and map results', async () => {
      const mockData = [
        {
          id: 'f1',
          friend_id: 'u2',
          created_at: '2024-01-01',
          friend: {
            display_name: 'Player Two',
            avatar_url: null,
            total_points: 100,
            current_streak: 3,
          },
        },
      ];
      mockChain.eq.mockResolvedValue({ data: mockData, error: null });

      const result = await friendService.getFriends('u1');

      expect(mockFrom).toHaveBeenCalledWith('friendships');
      expect(mockChain.select).toHaveBeenCalledWith(
        'id, friend_id, created_at, friend:profiles!friend_id(display_name, avatar_url, total_points, current_streak)'
      );
      expect(mockChain.eq).toHaveBeenCalledWith('user_id', 'u1');
      expect(result).toEqual([
        {
          id: 'f1',
          friend_id: 'u2',
          display_name: 'Player Two',
          avatar_url: null,
          total_points: 100,
          current_streak: 3,
          created_at: '2024-01-01',
        },
      ]);
    });

    it('should return empty array on error', async () => {
      mockChain.eq.mockResolvedValue({ data: null, error: { message: 'fail' } });

      const result = await friendService.getFriends('u1');

      expect(result).toEqual([]);
    });

    it('should handle null friend data gracefully', async () => {
      const mockData = [
        {
          id: 'f1',
          friend_id: 'u2',
          created_at: '2024-01-01',
          friend: null,
        },
      ];
      mockChain.eq.mockResolvedValue({ data: mockData, error: null });

      const result = await friendService.getFriends('u1');

      expect(result[0].display_name).toBe('');
      expect(result[0].total_points).toBe(0);
    });
  });

  describe('addFriend', () => {
    it('should return error when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await friendService.addFriend('u1', 'testuser');

      expect(result).toEqual({ success: false, error: 'Not configured' });
    });

    it('should return error when user not found', async () => {
      mockChain.single.mockResolvedValue({ data: null, error: { message: 'not found' } });

      const result = await friendService.addFriend('u1', 'nonexistent');

      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(result).toEqual({ success: false, error: 'User not found' });
    });

    it('should insert friendship and return success', async () => {
      // First call: lookup profile
      mockChain.single.mockResolvedValueOnce({ data: { id: 'u2', club_id: 'c1' }, error: null });
      // Second call: insert friendship
      mockChain.insert.mockResolvedValueOnce({ error: null });

      const result = await friendService.addFriend('u1', 'testuser');

      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockFrom).toHaveBeenCalledWith('friendships');
      expect(result).toEqual({ success: true });
    });

    it('should return already friends on duplicate key', async () => {
      mockChain.single.mockResolvedValueOnce({ data: { id: 'u2', club_id: 'c1' }, error: null });
      mockChain.insert.mockResolvedValueOnce({ error: { code: '23505', message: 'duplicate' } });

      const result = await friendService.addFriend('u1', 'testuser');

      expect(result).toEqual({ success: false, error: 'Already friends' });
    });

    it('should return error message on other insert errors', async () => {
      mockChain.single.mockResolvedValueOnce({ data: { id: 'u2', club_id: 'c1' }, error: null });
      mockChain.insert.mockResolvedValueOnce({ error: { code: '42501', message: 'permission denied' } });

      const result = await friendService.addFriend('u1', 'testuser');

      expect(result).toEqual({ success: false, error: 'permission denied' });
    });
  });

  describe('removeFriend', () => {
    it('should return false when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await friendService.removeFriend('f1');

      expect(result).toBe(false);
    });

    it('should delete friendship and return true', async () => {
      mockChain.eq.mockResolvedValue({ error: null });

      const result = await friendService.removeFriend('f1');

      expect(mockFrom).toHaveBeenCalledWith('friendships');
      expect(mockChain.delete).toHaveBeenCalled();
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'f1');
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      mockChain.eq.mockResolvedValue({ error: { message: 'fail' } });

      const result = await friendService.removeFriend('f1');

      expect(result).toBe(false);
    });
  });

  describe('searchUsers', () => {
    it('should return empty array when not configured', async () => {
      (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

      const result = await friendService.searchUsers('test', 'c1', 'u1');

      expect(result).toEqual([]);
    });

    it('should return empty array when query is too short', async () => {
      const result = await friendService.searchUsers('a', 'c1', 'u1');

      expect(result).toEqual([]);
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it('should search profiles and return results', async () => {
      const mockData = [
        { id: 'u2', username: 'testuser', display_name: 'Test User', avatar_url: null },
      ];
      mockChain.limit.mockResolvedValue({ data: mockData, error: null });

      const result = await friendService.searchUsers('test', 'c1', 'u1');

      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockChain.select).toHaveBeenCalledWith('id, username, display_name, avatar_url');
      expect(mockChain.eq).toHaveBeenCalledWith('club_id', 'c1');
      expect(mockChain.neq).toHaveBeenCalledWith('id', 'u1');
      expect(result).toEqual(mockData);
    });

    it('should return empty array on error', async () => {
      mockChain.limit.mockResolvedValue({ data: null, error: { message: 'fail' } });

      const result = await friendService.searchUsers('test', 'c1', 'u1');

      expect(result).toEqual([]);
    });
  });
});
