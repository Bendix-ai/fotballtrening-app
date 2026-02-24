/**
 * Player level system based on total points.
 * 10 levels with 3 tiers: Bronze (1-3), Silver (4-6), Gold (7-10).
 */

export type Tier = 'bronze' | 'silver' | 'gold';

export interface LevelInfo {
    level: number;
    tier: Tier;
    currentPoints: number;
    pointsForCurrentLevel: number;
    pointsForNextLevel: number;
    progressToNext: number; // 0-1
    tierIcon: string; // MaterialIcons name
    tierColor: string;
}

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500, Infinity];

export function getLevelInfo(totalPoints: number): LevelInfo {
    let level = 1;
    for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
        if (totalPoints >= LEVEL_THRESHOLDS[i]) {
            level = i + 1;
        } else {
            break;
        }
    }
    level = Math.min(level, 10);

    const pointsForCurrentLevel = LEVEL_THRESHOLDS[level - 1];
    const pointsForNextLevel = level < 10 ? LEVEL_THRESHOLDS[level] : LEVEL_THRESHOLDS[9];
    const range = pointsForNextLevel - pointsForCurrentLevel;
    const progressToNext = level >= 10 ? 1 : Math.min((totalPoints - pointsForCurrentLevel) / range, 1);

    const tier = getTier(level);
    const tierIcon = getTierIcon(tier);
    const tierColor = getTierColor(tier);

    return {
        level,
        tier,
        currentPoints: totalPoints,
        pointsForCurrentLevel,
        pointsForNextLevel,
        progressToNext,
        tierIcon,
        tierColor,
    };
}

export function getTier(level: number): Tier {
    if (level <= 3) return 'bronze';
    if (level <= 6) return 'silver';
    return 'gold';
}

export function getTierIcon(tier: Tier): string {
    switch (tier) {
        case 'bronze': return 'shield';
        case 'silver': return 'verified';
        case 'gold': return 'military-tech';
    }
}

export function getTierColor(tier: Tier): string {
    switch (tier) {
        case 'bronze': return '#CD7F32';
        case 'silver': return '#C0C0C0';
        case 'gold': return '#FFD700';
    }
}

export function getPointsToNextLevel(totalPoints: number): number {
    const info = getLevelInfo(totalPoints);
    if (info.level >= 10) return 0;
    return info.pointsForNextLevel - totalPoints;
}
