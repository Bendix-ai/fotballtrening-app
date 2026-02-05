// User types
export type UserRole = 'admin' | 'player';

export interface User {
    id: string;
    username: string;
    role: UserRole;
    club_id: string;
    team_id: string | null;
    display_name: string;
    avatar_url: string | null;
    total_points: number;
    current_streak: number;
    longest_streak: number;
    created_at: string;
    last_login: string | null;
}

// Club hierarchy types
export interface Club {
    id: string;
    name: string;
    logo_url: string | null;
    created_by: string;
    created_at: string;
}

export interface YearGroup {
    id: string;
    club_id: string;
    year: number; // e.g., 2015
    created_at: string;
}

export type Gender = 'boys' | 'girls' | 'mixed';

export interface Team {
    id: string;
    year_group_id: string;
    gender: Gender;
    name: string; // e.g., "Gutter 2015" 
    created_at: string;
}

// Exercise types
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ExerciseCategory = 'warmup' | 'strength' | 'agility' | 'skill' | 'cooldown';

export interface Exercise {
    id: string;
    title: string;
    description: string;
    instructions: string;
    image_url: string | null;
    video_url: string | null;
    duration_seconds: number;
    difficulty: Difficulty;
    category: ExerciseCategory;
    points: number;
    is_public: boolean;
    created_by_club_id: string | null;
    created_at: string;
}

export interface ExerciseCompletion {
    id: string;
    user_id: string;
    exercise_id: string;
    points_earned: number;
    completed_at: string;
}

// Leaderboard types
export interface LeaderboardEntry {
    rank: number;
    user_id: string;
    display_name: string;
    avatar_url: string | null;
    total_points: number;
    exercises_completed: number;
    current_streak: number;
    is_current_user: boolean;
}

export type LeaderboardScope = 'club' | 'year_group' | 'team';
export type LeaderboardPeriod = 'week' | 'month' | 'all_time';

// Achievement types
export type AchievementType =
    | 'first_exercise'
    | 'streak_7'
    | 'streak_30'
    | 'points_100'
    | 'points_500'
    | 'points_1000'
    | 'exercises_10'
    | 'exercises_50'
    | 'all_categories';

export interface Achievement {
    id: string;
    user_id: string;
    type: AchievementType;
    earned_at: string;
}

export interface AchievementDefinition {
    type: AchievementType;
    title: string;
    description: string;
    icon: string;
    points_bonus: number;
}

// Navigation types
export type RootStackParamList = {
    Onboarding: undefined;
    ClubSelect: undefined;
    Login: undefined;
    MainTabs: undefined;
    ExerciseDetail: { exerciseId: string };
    ExerciseComplete: { exerciseId: string; pointsEarned: number };
    Achievements: undefined;
    Settings: undefined;
    AdminDashboard: undefined;
    PlayerManagement: undefined;
    ExerciseManagement: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Exercises: undefined;
    Leaderboard: undefined;
    Profile: undefined;
};
