// User types
export type UserRole = 'admin' | 'player';
export type AdminType = 'club_admin' | 'team_admin';

export interface User {
    id: string;
    username: string;
    role: UserRole;
    admin_type: AdminType | null;
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
    equipment: string;
    assigned_team_ids?: string[] | null;
    created_at: string;
}

export interface ExerciseCompletion {
    id: string;
    user_id: string;
    exercise_id: string;
    points_earned: number;
    is_daily_challenge?: boolean;
    completed_at: string;
}

export interface PlayerCompletion {
    exercise_title: string;
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
    rank_change?: number;
}

export type LeaderboardScope = 'club' | 'year_group' | 'team' | 'friends';
export type LeaderboardPeriod = 'week' | 'month' | 'all_time';

// Achievement types
export type AchievementType =
    | 'first_exercise'
    | 'streak_3'
    | 'streak_7'
    | 'streak_30'
    | 'points_10'
    | 'points_100'
    | 'points_500'
    | 'points_1000'
    | 'exercises_5'
    | 'exercises_10'
    | 'exercises_50'
    | 'first_favorite'
    | 'tried_2_categories'
    | 'first_challenge'
    | 'first_highfive'
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

// Admin types
export interface AdminPlayer {
    id: string;
    display_name: string;
    username: string;
    year_group: number;
    year_group_id?: string;
    gender: Gender;
    total_points: number;
    exercises_completed: number;
    current_streak: number;
    longest_streak: number;
    last_active: string;
    is_active: boolean;
    created_at?: string;
}

export interface AdminActivity {
    id: string;
    player_name: string;
    action: string;
    timestamp: string;
    points?: number;
}

export interface DashboardMetrics {
    totalPlayers: number;
    activeLast7Days: number;
    totalCompletions: number;
    engagementRate: number;
}

export interface StoreExercise {
    id: string;
    title: string;
    description: string;
    instructions: string;
    category: ExerciseCategory;
    difficulty: Difficulty;
    duration_seconds: number;
    points: number;
    rating: number;
    downloads: number;
    author: string;
    is_featured: boolean;
    image_url: string | null;
    video_url: string | null;
    equipment: string;
}

export interface StoreReview {
    id: string;
    exercise_id: string;
    club_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

export interface ClubYearGroup {
    year: number;
    boys_count: number;
    girls_count: number;
    total_count: number;
}

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface ReportData {
    weeklyActivity: ChartDataPoint[];
    monthlyPoints: ChartDataPoint[];
    categoryDistribution: ChartDataPoint[];
    difficultyDistribution: ChartDataPoint[];
}

// Announcement types
export interface Announcement {
    id: string;
    club_id: string;
    team_id?: string | null;
    created_by: string;
    title: string;
    message: string;
    created_at: string;
    author_name?: string;
}

// Training Plan types
export interface TrainingPlan {
    id: string;
    club_id: string;
    team_id?: string | null;
    week_start: string; // ISO date of Monday
    created_by: string;
    created_at: string;
}

export interface TrainingPlanDay {
    id: string;
    plan_id: string;
    day_of_week: number; // 0=Monday, 6=Sunday
    exercise_ids: string[];
}

// Activity feed types
export interface ActivityFeedItem {
    id: string;
    user_id: string;
    display_name: string;
    avatar_url: string | null;
    type: 'exercise_completed' | 'achievement_unlocked' | 'streak_milestone';
    title: string;
    points?: number;
    highfive_count?: number;
    created_at: string;
}

// Challenge types
export type ChallengeStatus = 'pending' | 'accepted' | 'completed' | 'expired';

export interface Challenge {
    id: string;
    exercise_id: string;
    exercise_title: string;
    challenger_id: string;
    challenger_name: string;
    opponent_id: string;
    opponent_name: string;
    status: ChallengeStatus;
    challenger_completed: boolean;
    opponent_completed: boolean;
    bonus_points: number;
    created_at: string;
    expires_at: string;
}

// Mascot types
export type MascotState = 'happy' | 'impressed' | 'cheering' | 'thinking' | 'training' | 'worried';

// Navigation types
export type RootStackParamList = {
    Onboarding: undefined;
    ClubSelect: undefined;
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    ResetPassword: undefined;
    MainTabs: undefined;
    AdminMain: undefined;
    Achievements: undefined;
    Settings: undefined;
    AdminDashboard: undefined;
    PlayerManagement: undefined;
    ExerciseManagement: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    ExercisesTab: undefined;
    Leaderboard: undefined;
    ProfileTab: undefined;
};

export type ExercisesStackParamList = {
    ExercisesList: undefined;
    ExerciseDetail: { exerciseId: string };
    ExerciseExecution: { exerciseId: string };
    ExerciseComplete: { exerciseId: string; pointsEarned: number; isDailyChallenge?: boolean };
    Challenges: undefined;
    CreateChallenge: { exerciseId: string };
};

export type ProfileStackParamList = {
    ProfileMain: undefined;
    Achievements: undefined;
    Friends: undefined;
    Settings: undefined;
    ChangePassword: undefined;
    Notifications: undefined;
    About: undefined;
};

export type AdminDrawerParamList = {
    Dashboard: undefined;
    Players: undefined;
    ClubStructure: undefined;
    Exercises: undefined;
    ExerciseStore: undefined;
    Announcements: undefined;
    TrainingPlans: undefined;
    Reports: undefined;
    AdminSettings: undefined;
};

export type AdminStackParamList = {
    AdminDrawer: undefined;
    AddEditPlayer: { playerId?: string };
    AddEditExercise: { exerciseId?: string };
    ExercisePreview: { exerciseId: string };
    ExerciseStoreDetail: { exerciseId: string };
    AddYearGroup: undefined;
    PlayerDetail: { playerId: string };
    HelpCenter: undefined;
};
