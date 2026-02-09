/**
 * Analytics abstraction layer.
 *
 * In development, events are logged to the console.
 * When a production analytics backend is configured (Firebase, PostHog, etc.),
 * swap out the implementation here without changing any feature code.
 */

type EventParams = Record<string, string | number | boolean>;

const PREFIX = '[Analytics]';

function log(event: string, params?: EventParams) {
    if (__DEV__) {
        console.log(PREFIX, event, params ?? '');
    }
}

// ─── Generic ────────────────────────────────────────────────────
export function logEvent(name: string, params?: EventParams) {
    log(name, params);
    // TODO: Replace with real analytics backend
    // e.g. analytics().logEvent(name, params);
}

export function logScreenView(screenName: string) {
    log('screen_view', { screen_name: screenName });
}

export function setUserId(userId: string) {
    log('set_user_id', { user_id: userId });
}

// ─── Domain-specific helpers ────────────────────────────────────
export function logLogin(method: 'player' | 'admin') {
    logEvent('login', { method });
}

export function logLogout() {
    logEvent('logout');
}

export function logExerciseComplete(exerciseId: string, points: number) {
    logEvent('exercise_complete', { exercise_id: exerciseId, points });
}

export function logExerciseStart(exerciseId: string) {
    logEvent('exercise_start', { exercise_id: exerciseId });
}

export function logAchievementUnlocked(achievementType: string) {
    logEvent('achievement_unlocked', { achievement_type: achievementType });
}

export function logStoreDownload(exerciseId: string) {
    logEvent('store_download', { exercise_id: exerciseId });
}

export function logPlayerAdded() {
    logEvent('player_added');
}
