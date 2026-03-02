import { useRef, useMemo } from 'react';
import { useAuthStore } from '../stores';
import { useTodayCompletions } from './useExercises';
import { t } from '../lib/i18n';
import { MascotState } from '../types';

interface MascotMessage {
    message: string;
    state: MascotState;
}

type MessageKey = string;

interface MessageVariant {
    key: MessageKey;
    state: MascotState;
    params?: Record<string, string | number>;
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 24) return 'evening';
    return 'night';
}

function isEvening(): boolean {
    const hour = new Date().getHours();
    return hour >= 18 && hour < 24;
}

/** Pick a random element from array that hasn't been shown yet (tracked via ref) */
function pickUnshown(
    variants: MessageVariant[],
    shownRef: React.MutableRefObject<Set<string>>
): MessageVariant {
    const unshown = variants.filter((v) => !shownRef.current.has(v.key));
    const pool = unshown.length > 0 ? unshown : variants;
    // If all shown, reset tracker
    if (unshown.length === 0) {
        shownRef.current.clear();
    }
    const picked = pool[Math.floor(Math.random() * pool.length)];
    shownRef.current.add(picked.key);
    return picked;
}

export function useMascotMessage(): MascotMessage {
    const { user } = useAuthStore();
    const { data: todayCompletions } = useTodayCompletions();
    const shownMessages = useRef<Set<string>>(new Set());

    return useMemo(() => {
        const streak = user?.current_streak ?? 0;
        const totalPoints = user?.total_points ?? 0;
        const completedToday = (todayCompletions?.length ?? 0) > 0;
        const timeOfDay = getTimeOfDay();

        // Priority 1: New user
        if (totalPoints === 0) {
            return {
                message: t('mascot.ready'),
                state: 'happy' as MascotState,
            };
        }

        // Priority 2: Impressive streak
        if (streak > 7) {
            const variants: MessageVariant[] = [
                { key: 'impressiveStreak', state: 'impressed', params: { days: streak } },
                { key: 'champion', state: 'impressed' },
                { key: 'superStar', state: 'impressed' },
            ];
            const picked = pickUnshown(variants, shownMessages);
            return {
                message: t(`mascot.${picked.key}`, picked.params),
                state: picked.state,
            };
        }

        // Priority 3: Completed exercise today
        if (completedToday) {
            const variants: MessageVariant[] = [
                { key: 'greatJob', state: 'cheering' },
                { key: 'keepGoing', state: 'cheering' },
                { key: 'proud', state: 'cheering' },
                { key: 'almostThere', state: 'cheering' },
                { key: 'coolDown', state: 'cheering' },
            ];
            const picked = pickUnshown(variants, shownMessages);
            return {
                message: t(`mascot.${picked.key}`),
                state: picked.state,
            };
        }

        // Priority 5: Streak at risk (evening, no exercise)
        if (isEvening() && !completedToday && streak > 0) {
            return {
                message: t('mascot.streakInDanger'),
                state: 'worried' as MascotState,
            };
        }

        // Priority 4: No exercise today
        if (!completedToday) {
            const noExerciseVariants: MessageVariant[] = [
                { key: 'howAboutTraining', state: 'thinking' },
                { key: 'letsTrain', state: 'thinking' },
                { key: 'newDay', state: 'thinking' },
                { key: 'neverGiveUp', state: 'thinking' },
                { key: 'teamPlayer', state: 'thinking' },
                { key: 'warmUp', state: 'thinking' },
            ];

            // Add time-of-day variants
            const timeVariants: MessageVariant[] = [];
            switch (timeOfDay) {
                case 'morning':
                    timeVariants.push({ key: 'goodMorning', state: 'happy' });
                    break;
                case 'afternoon':
                    timeVariants.push({ key: 'goodAfternoon', state: 'training' });
                    break;
                case 'evening':
                    timeVariants.push({ key: 'goodEvening', state: 'thinking' });
                    break;
                case 'night':
                    timeVariants.push({ key: 'lateNight', state: 'thinking' });
                    break;
            }

            const allVariants = [...noExerciseVariants, ...timeVariants];
            const picked = pickUnshown(allVariants, shownMessages);
            return {
                message: t(`mascot.${picked.key}`),
                state: picked.state,
            };
        }

        // Priority 6: Default time-of-day greeting
        switch (timeOfDay) {
            case 'morning':
                return { message: t('mascot.goodMorning'), state: 'happy' as MascotState };
            case 'afternoon':
                return { message: t('mascot.goodAfternoon'), state: 'training' as MascotState };
            case 'evening':
                return { message: t('mascot.goodEvening'), state: 'thinking' as MascotState };
            case 'night':
            default:
                return { message: t('mascot.lateNight'), state: 'thinking' as MascotState };
        }
    }, [user?.total_points, user?.current_streak, todayCompletions]);
}
