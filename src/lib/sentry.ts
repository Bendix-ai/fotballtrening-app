import * as Sentry from '@sentry/react-native';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

export function initSentry() {
    if (!SENTRY_DSN || __DEV__) {
        return;
    }

    Sentry.init({
        dsn: SENTRY_DSN,
        debug: false,
        tracesSampleRate: 0.2,
    });
}

export function captureError(error: Error, context?: Record<string, unknown>) {
    if (__DEV__) {
        console.error('Sentry would capture:', error, context);
        return;
    }

    if (context) {
        Sentry.withScope((scope) => {
            Object.entries(context).forEach(([key, value]) => {
                scope.setExtra(key, value);
            });
            Sentry.captureException(error);
        });
    } else {
        Sentry.captureException(error);
    }
}

export function setUser(userId: string, role?: string) {
    Sentry.setUser({ id: userId, ...(role ? { role } : {}) });
}

export function clearUser() {
    Sentry.setUser(null);
}

export { Sentry };
