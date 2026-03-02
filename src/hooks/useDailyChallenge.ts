import { useMemo } from 'react';
import { useExercises } from './useExercises';
import { Exercise } from '../types';

function getDayOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / 86400000);
}

interface DailyChallengeResult {
    /** The daily challenge exercise, or null if exercises haven't loaded */
    dailyChallenge: Exercise | null;
    /** Whether a given exercise ID is today's daily challenge */
    isDailyChallenge: (exerciseId: string) => boolean;
    /** Whether exercises are still loading */
    isLoading: boolean;
}

export function useDailyChallenge(): DailyChallengeResult {
    const { data: exercises = [], isLoading } = useExercises();

    const dailyChallenge = useMemo(() => {
        if (exercises.length === 0) return null;
        const dayOfYear = getDayOfYear();
        return exercises[dayOfYear % exercises.length];
    }, [exercises]);

    const isDailyChallenge = useMemo(() => {
        return (exerciseId: string): boolean => {
            if (!dailyChallenge) return false;
            return dailyChallenge.id === exerciseId;
        };
    }, [dailyChallenge]);

    return { dailyChallenge, isDailyChallenge, isLoading };
}

// Exported for testing
export { getDayOfYear };
