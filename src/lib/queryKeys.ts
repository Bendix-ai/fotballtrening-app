export const queryKeys = {
    exercises: {
        all: (clubId: string) => ['exercises', clubId] as const,
        detail: (id: string) => ['exercises', 'detail', id] as const,
        completions: (userId: string) => ['exercises', 'completions', userId] as const,
        todayCompletions: (userId: string) => ['exercises', 'today', userId] as const,
        favorites: (userId: string) => ['exercises', 'favorites', userId] as const,
    },
    leaderboard: (clubId: string, scope: string, scopeId: string | null, period: string) =>
        ['leaderboard', clubId, scope, scopeId, period] as const,
    achievements: (userId: string) => ['achievements', userId] as const,
    clubs: {
        all: () => ['clubs'] as const,
        yearGroups: (clubId: string) => ['clubs', clubId, 'yearGroups'] as const,
        teams: (yearGroupId: string) => ['teams', yearGroupId] as const,
        structure: (clubId: string) => ['clubs', clubId, 'structure'] as const,
    },
    admin: {
        players: (clubId: string) => ['admin', 'players', clubId] as const,
        metrics: (clubId: string) => ['admin', 'metrics', clubId] as const,
        activity: (clubId: string) => ['admin', 'activity', clubId] as const,
        reports: (clubId: string) => ['admin', 'reports', clubId] as const,
    },
    store: {
        exercises: () => ['store', 'exercises'] as const,
        detail: (id: string) => ['store', 'detail', id] as const,
        reviews: (exerciseId: string) => ['store', 'reviews', exerciseId] as const,
    },
    announcements: {
        all: (clubId: string) => ['announcements', clubId] as const,
    },
    activityFeed: {
        all: (clubId: string) => ['activityFeed', clubId] as const,
        team: (clubId: string, teamId: string) => ['activityFeed', clubId, teamId] as const,
        friends: (userId: string) => ['activityFeed', 'friends', userId] as const,
    },
    highfives: {
        count: (activityId: string) => ['highfives', 'count', activityId] as const,
    },
    challenges: {
        all: (userId: string) => ['challenges', userId] as const,
        active: (userId: string) => ['challenges', 'active', userId] as const,
    },
    trainingPlans: {
        active: (clubId: string, teamId?: string | null) =>
            ['trainingPlans', 'active', clubId, teamId ?? 'all'] as const,
        detail: (planId: string) => ['trainingPlans', 'detail', planId] as const,
    },
};
