import { getLevelInfo, getTier, getTierIcon, getTierColor, getPointsToNextLevel } from '../levelUtils';

describe('levelUtils', () => {
    describe('getLevelInfo', () => {
        it('should return level 1 for 0 points', () => {
            const info = getLevelInfo(0);
            expect(info.level).toBe(1);
            expect(info.tier).toBe('bronze');
            expect(info.progressToNext).toBe(0);
        });

        it('should return level 1 for 25 points (midway)', () => {
            const info = getLevelInfo(25);
            expect(info.level).toBe(1);
            expect(info.progressToNext).toBe(0.5);
        });

        it('should return level 2 for exactly 50 points', () => {
            const info = getLevelInfo(50);
            expect(info.level).toBe(2);
            expect(info.tier).toBe('bronze');
        });

        it('should return level 4 (silver) for 500 points', () => {
            const info = getLevelInfo(500);
            expect(info.level).toBe(5);
            expect(info.tier).toBe('silver');
        });

        it('should return level 10 (gold) for 3500+ points', () => {
            const info = getLevelInfo(3500);
            expect(info.level).toBe(10);
            expect(info.tier).toBe('gold');
            expect(info.progressToNext).toBe(1);
        });

        it('should cap at level 10 for very high points', () => {
            const info = getLevelInfo(99999);
            expect(info.level).toBe(10);
        });

        it('should return correct tier colors', () => {
            expect(getLevelInfo(0).tierColor).toBe('#CD7F32');
            expect(getLevelInfo(500).tierColor).toBe('#C0C0C0');
            expect(getLevelInfo(3500).tierColor).toBe('#FFD700');
        });

        it('should return correct tier icons', () => {
            expect(getLevelInfo(0).tierIcon).toBe('shield');
            expect(getLevelInfo(500).tierIcon).toBe('verified');
            expect(getLevelInfo(3500).tierIcon).toBe('military-tech');
        });
    });

    describe('getTier', () => {
        it('should return bronze for levels 1-3', () => {
            expect(getTier(1)).toBe('bronze');
            expect(getTier(2)).toBe('bronze');
            expect(getTier(3)).toBe('bronze');
        });

        it('should return silver for levels 4-6', () => {
            expect(getTier(4)).toBe('silver');
            expect(getTier(5)).toBe('silver');
            expect(getTier(6)).toBe('silver');
        });

        it('should return gold for levels 7-10', () => {
            expect(getTier(7)).toBe('gold');
            expect(getTier(8)).toBe('gold');
            expect(getTier(9)).toBe('gold');
            expect(getTier(10)).toBe('gold');
        });
    });

    describe('getTierIcon', () => {
        it('should return correct icons for each tier', () => {
            expect(getTierIcon('bronze')).toBe('shield');
            expect(getTierIcon('silver')).toBe('verified');
            expect(getTierIcon('gold')).toBe('military-tech');
        });
    });

    describe('getTierColor', () => {
        it('should return correct colors for each tier', () => {
            expect(getTierColor('bronze')).toBe('#CD7F32');
            expect(getTierColor('silver')).toBe('#C0C0C0');
            expect(getTierColor('gold')).toBe('#FFD700');
        });
    });

    describe('getPointsToNextLevel', () => {
        it('should return 50 for 0 points (need 50 for level 2)', () => {
            expect(getPointsToNextLevel(0)).toBe(50);
        });

        it('should return 25 for 25 points', () => {
            expect(getPointsToNextLevel(25)).toBe(25);
        });

        it('should return 0 for max level', () => {
            expect(getPointsToNextLevel(3500)).toBe(0);
            expect(getPointsToNextLevel(99999)).toBe(0);
        });

        it('should return correct points for mid-level', () => {
            // Level 3 starts at 150, level 4 at 300
            expect(getPointsToNextLevel(200)).toBe(100);
        });
    });
});
