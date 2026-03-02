import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import * as highfiveService from '../highfiveService';

const mockFrom = (supabase as any)._mockFrom;
const mockChain = (supabase as any)._mockChain;

describe('highfiveService', () => {
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

    describe('sendHighFive', () => {
        it('should return false when Supabase not configured', async () => {
            (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

            const result = await highfiveService.sendHighFive('from1', 'to1', 'act1');

            expect(result).toBe(false);
            expect(mockFrom).not.toHaveBeenCalled();
        });

        it('should insert high five and return true', async () => {
            mockChain.insert.mockResolvedValue({ error: null });

            const result = await highfiveService.sendHighFive('from1', 'to1', 'act1');

            expect(mockFrom).toHaveBeenCalledWith('highfives');
            expect(mockChain.insert).toHaveBeenCalledWith({
                from_user_id: 'from1',
                to_user_id: 'to1',
                activity_id: 'act1',
            });
            expect(result).toBe(true);
        });

        it('should return false on error', async () => {
            mockChain.insert.mockResolvedValue({ error: { message: 'duplicate' } });

            const result = await highfiveService.sendHighFive('from1', 'to1', 'act1');

            expect(result).toBe(false);
        });
    });

    describe('getHighFiveCount', () => {
        it('should return 0 when Supabase not configured', async () => {
            (isSupabaseConfigured as jest.Mock).mockReturnValue(false);

            const result = await highfiveService.getHighFiveCount('act1');

            expect(result).toBe(0);
            expect(mockFrom).not.toHaveBeenCalled();
        });

        it('should return count of high fives', async () => {
            const mockData = [{ id: 'h1' }, { id: 'h2' }, { id: 'h3' }];
            mockChain.eq.mockResolvedValue({ data: mockData, error: null });

            const result = await highfiveService.getHighFiveCount('act1');

            expect(mockFrom).toHaveBeenCalledWith('highfives');
            expect(mockChain.select).toHaveBeenCalledWith('id');
            expect(mockChain.eq).toHaveBeenCalledWith('activity_id', 'act1');
            expect(result).toBe(3);
        });

        it('should return 0 on error', async () => {
            mockChain.eq.mockResolvedValue({ data: null, error: { message: 'fail' } });

            const result = await highfiveService.getHighFiveCount('act1');

            expect(result).toBe(0);
        });

        it('should return 0 when data is null', async () => {
            mockChain.eq.mockResolvedValue({ data: null, error: null });

            const result = await highfiveService.getHighFiveCount('act1');

            expect(result).toBe(0);
        });
    });
});
