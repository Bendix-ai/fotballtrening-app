# FotballTrening App — Complete Rebuild Prompt

> Use this document to rebuild the FotballTrening app from scratch with any AI tool or development team. It contains every detail needed: architecture, database schema, services, hooks, screens, components, navigation, styling, i18n, and gamification logic.

---

## 1. Overview

**FotballTrening** is a React Native (Expo) mobile app for Norwegian football (soccer) clubs to manage youth player training with gamification — points, streaks, achievements, and leaderboards. The primary UI language is **Norwegian** with English as a secondary language.

### Core Concept
- **Players** (kids) log into their club/team, browse exercises, complete timed training sessions, earn points, build streaks, unlock achievements, and compete on leaderboards.
- **Admins** (coaches/club managers) manage players, exercises, club structure, view reports, and download exercises from a shared store.

### User Roles

| Role | Login Method | Navigation | Scope |
|------|-------------|------------|-------|
| **Player** | Club/year/gender dropdown + username/password | Bottom tabs (4 tabs) | Own data only |
| **Team Admin** | Email/password | Drawer navigation | Assigned teams only |
| **Club Admin** | Email/password | Drawer navigation | Entire club |

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Native | 0.81.5 |
| Platform | Expo (managed workflow) | 54.0.33 |
| React | React | 19.1.0 |
| Language | TypeScript (strict mode) | 5.9.2 |
| Styling | NativeWind (Tailwind for RN) | 4.2.1 |
| Tailwind | tailwindcss | 3.4.19 |
| Navigation | React Navigation (native-stack, bottom-tabs, drawer) | 7.x |
| Client State | Zustand (persisted via AsyncStorage) | 5.0.11 |
| Server State | TanStack React Query | 5.90.20 |
| Backend | Supabase (PostgreSQL + Auth + RLS) | 2.95.2 |
| Animations | React Native Reanimated | 4.1.1 |
| Gestures | React Native Gesture Handler | 2.28 |
| Charts | react-native-chart-kit | 6.12.0 |
| Monitoring | Sentry | 7.2.0 |
| OTA Updates | expo-updates | 29.0.16 |
| Secure Storage | expo-secure-store | 15.0.8 |
| Icons | @expo/vector-icons (MaterialIcons, Ionicons) | 15.0.3 |
| Testing | Jest + @testing-library/react-native | 30.2.0 / 13.3.3 |
| E2E Testing | Maestro (YAML flows) | latest |

### Key Config
- New Architecture enabled (`newArchEnabled: true`)
- Bundle ID: `com.bendixen.fotballtrening`
- Deep link scheme: `fotballtrening://`
- Splash background: `#2E7D32` (primary green)

---

## 3. Project Structure

```
fotballtrening-app/
├── App.tsx                    — Root (providers → AppNavigator)
├── index.ts                   — Entry point
├── app.json                   — Expo config
├── eas.json                   — EAS Build profiles
├── tailwind.config.js         — NativeWind theme extensions
├── jest.config.js / jest.setup.js — Test config + mocks
├── e2e/                       — Maestro E2E YAML flows
├── supabase/                  — 11 SQL migration files
├── docs/                      — Legal, metadata, checklist
├── .github/workflows/         — CI (test.yml, build.yml)
└── src/
    ├── types/index.ts         — All TypeScript interfaces
    ├── lib/
    │   ├── supabase.ts        — Supabase client (expo-secure-store adapter)
    │   ├── theme.tsx           — ThemeProvider + useTheme() hook
    │   ├── design-tokens.ts   — Colors, spacing, typography, shadows
    │   ├── i18n/
    │   │   ├── index.ts       — t() function, setLanguage(), getCurrentLanguage()
    │   │   ├── no.ts          — Norwegian translations (~337 keys)
    │   │   └── en.ts          — English translations (parallel structure)
    │   ├── analytics.ts       — Event logging (console in dev)
    │   ├── sentry.ts          — Crash reporting
    │   └── queryKeys.ts       — React Query cache key factory
    ├── components/            — 15 shared UI components
    ├── services/              — 7 Supabase API service modules
    ├── hooks/                 — 6 React Query hook modules
    ├── stores/                — 4 Zustand stores
    ├── navigation/            — AppNavigator, stacks, drawer
    ├── features/              — All screen files grouped by feature
    │   ├── auth/              — Login, Register, ForgotPassword, ResetPassword
    │   ├── home/              — HomeScreen
    │   ├── exercises/         — List, Detail, Execution (timer), Complete (celebration)
    │   ├── leaderboard/       — LeaderboardScreen
    │   ├── profile/           — Profile, Settings, ChangePassword, Notifications, About
    │   ├── admin/             — Dashboard, Players, Exercises, Store, Structure, Reports, Settings
    │   └── onboarding/        — OnboardingScreen (first launch)
    └── data/mockData.ts       — Fallback data when Supabase unavailable
```

---

## 4. Root Component (App.tsx)

Provider hierarchy (outermost to innermost):
```
Sentry.wrap() →
  GestureHandlerRootView →
    QueryClientProvider (staleTime: 5min, retry: 2) →
      SafeAreaProvider →
        ThemeProvider →
          ToastProvider →
            ErrorBoundary →
              AppContent (StatusBar + AppNavigator)
```

`AppContent` calls `useAuthStore().initialize()` on mount to listen for Supabase auth state changes.

---

## 5. TypeScript Types

### User Types
```typescript
type UserRole = 'admin' | 'player';
type AdminType = 'club_admin' | 'team_admin';

interface User {
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
```

### Club Hierarchy
```typescript
interface Club {
  id: string;
  name: string;
  logo_url: string | null;
  created_by: string;
  created_at: string;
}

interface YearGroup {
  id: string;
  club_id: string;
  year: number;        // e.g. 2015
  created_at: string;
}

type Gender = 'boys' | 'girls' | 'mixed';

interface Team {
  id: string;
  year_group_id: string;
  gender: Gender;
  name: string;       // e.g. "2015 Gutter"
  created_at: string;
}

interface ClubYearGroup {
  year: number;
  boys_count: number;
  girls_count: number;
  total_count: number;
}
```

### Exercise Types
```typescript
type Difficulty = 'easy' | 'medium' | 'hard';
type ExerciseCategory = 'warmup' | 'strength' | 'agility' | 'skill' | 'cooldown';

interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string;       // Numbered steps separated by ". "
  image_url: string | null;
  video_url: string | null;
  duration_seconds: number;
  difficulty: Difficulty;
  category: ExerciseCategory;
  points: number;
  is_public: boolean;
  created_by_club_id: string | null;
  equipment: string;
  created_at: string;
}

interface ExerciseCompletion {
  id: string;
  user_id: string;
  exercise_id: string;
  points_earned: number;
  completed_at: string;
}
```

### Leaderboard Types
```typescript
type LeaderboardScope = 'club' | 'year_group' | 'team';
type LeaderboardPeriod = 'week' | 'month' | 'all_time';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  total_points: number;
  exercises_completed: number;
  current_streak: number;
  is_current_user: boolean;
}
```

### Achievement Types
```typescript
type AchievementType =
  | 'first_exercise' | 'streak_7' | 'streak_30'
  | 'points_100' | 'points_500' | 'points_1000'
  | 'exercises_10' | 'exercises_50' | 'all_categories';

interface Achievement {
  id: string;
  user_id: string;
  type: AchievementType;
  earned_at: string;
}
```

### Admin Types
```typescript
interface AdminPlayer {
  id: string;
  display_name: string;
  username: string;
  year_group: number;
  gender: Gender;
  total_points: number;
  exercises_completed: number;
  current_streak: number;
  last_active: string;
  is_active: boolean;
}

interface AdminActivity {
  id: string;
  player_name: string;
  action: string;
  timestamp: string;
  points?: number;
}

interface DashboardMetrics {
  totalPlayers: number;
  activeLast7Days: number;
  totalCompletions: number;
  engagementRate: number;
}
```

### Store Types
```typescript
interface StoreExercise {
  id: string;
  title: string;
  description: string;
  instructions: string;
  category: ExerciseCategory;
  difficulty: Difficulty;
  duration_seconds: number;
  points: number;
  rating: number;          // 0.0 - 5.0
  downloads: number;
  author: string;
  is_featured: boolean;
  image_url: string | null;
  video_url: string | null;
  equipment: string;
}

interface StoreReview {
  id: string;
  exercise_id: string;
  club_name: string;
  rating: number;          // 1-5
  comment: string;
  created_at: string;
}
```

### Navigation Param Lists
```typescript
type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  MainTabs: undefined;
  AdminMain: undefined;
};

type MainTabParamList = {
  Home: undefined;
  ExercisesTab: undefined;
  Leaderboard: undefined;
  ProfileTab: undefined;
};

type ExercisesStackParamList = {
  ExercisesList: undefined;
  ExerciseDetail: { exerciseId: string };
  ExerciseExecution: { exerciseId: string };
  ExerciseComplete: { exerciseId: string; pointsEarned: number };
};

type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  Notifications: undefined;
  About: undefined;
};

type AdminDrawerParamList = {
  Dashboard: undefined;
  Players: undefined;
  ClubStructure: undefined;
  Exercises: undefined;
  ExerciseStore: undefined;
  Reports: undefined;
  AdminSettings: undefined;
};
```

---

## 6. Complete Database Schema (Supabase PostgreSQL)

### 6.1 Core Tables

```sql
-- CLUBS
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- YEAR GROUPS
CREATE TABLE public.year_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2030),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(club_id, year)
);
CREATE INDEX idx_year_groups_club_id ON year_groups(club_id);

-- TEAMS
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_group_id UUID NOT NULL REFERENCES public.year_groups(id) ON DELETE CASCADE,
  gender TEXT NOT NULL CHECK (gender IN ('boys', 'girls', 'mixed')),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(year_group_id, gender)
);
CREATE INDEX idx_teams_year_group_id ON teams(year_group_id);

-- PROFILES (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('admin', 'player')),
  admin_type TEXT CHECK (admin_type IN ('club_admin', 'team_admin')),
  club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  total_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  UNIQUE(username, club_id)
);
CREATE INDEX idx_profiles_club_id ON profiles(club_id);
CREATE INDEX idx_profiles_team_id ON profiles(team_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ADMIN-TEAM JUNCTION (for team_admin scoping)
CREATE TABLE public.admin_team_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(admin_id, team_id)
);
CREATE INDEX idx_admin_team_assignments_admin_id ON admin_team_assignments(admin_id);
CREATE INDEX idx_admin_team_assignments_team_id ON admin_team_assignments(team_id);
```

### 6.2 Exercise Tables

```sql
-- EXERCISES (club-owned or public)
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  instructions TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  video_url TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 120,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT NOT NULL CHECK (category IN ('warmup', 'strength', 'agility', 'skill', 'cooldown')),
  points INTEGER NOT NULL DEFAULT 10,
  equipment TEXT NOT NULL DEFAULT '',
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_by_club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_exercises_club_id ON exercises(created_by_club_id);
CREATE INDEX idx_exercises_public ON exercises(is_public);

-- EXERCISE COMPLETIONS
CREATE TABLE public.exercise_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_exercise_completions_user_id ON exercise_completions(user_id);
CREATE INDEX idx_exercise_completions_exercise_id ON exercise_completions(exercise_id);
CREATE INDEX idx_exercise_completions_completed_at ON exercise_completions(completed_at);

-- FAVORITES
CREATE TABLE public.favorites (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, exercise_id)
);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
```

### 6.3 Achievements

```sql
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'first_exercise', 'streak_7', 'streak_30',
    'points_100', 'points_500', 'points_1000',
    'exercises_10', 'exercises_50', 'all_categories'
  )),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, type)
);
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
```

### 6.4 Exercise Store Tables

```sql
-- STORE EXERCISES (curated library)
CREATE TABLE public.store_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL CHECK (category IN ('warmup', 'strength', 'agility', 'skill', 'cooldown')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  duration_seconds INTEGER NOT NULL DEFAULT 120,
  points INTEGER NOT NULL DEFAULT 10,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  author TEXT NOT NULL DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  instructions TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  video_url TEXT,
  equipment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- STORE REVIEWS
CREATE TABLE public.store_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES public.store_exercises(id) ON DELETE CASCADE,
  club_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_store_reviews_exercise_id ON store_reviews(exercise_id);

-- STORE DOWNLOADS (audit trail)
CREATE TABLE public.store_downloads (
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  store_exercise_id UUID NOT NULL REFERENCES public.store_exercises(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (club_id, store_exercise_id)
);
```

---

## 7. Database Triggers & Functions

### 7.1 Auto-Create Profile on Signup: `handle_new_user()`

**Trigger:** AFTER INSERT ON `auth.users`

When a new user signs up via Supabase Auth, this trigger:
1. Reads `raw_user_meta_data` from the auth user (role, username, club_id, team_id, display_name, admin_type, managed_team_ids)
2. Inserts a row into `profiles` with those values
3. If `team_admin`: loops through `managed_team_ids` and inserts into `admin_team_assignments`
4. If first admin in club: sets `clubs.created_by`
5. Auto-confirms email: sets `auth.users.email_confirmed_at = NOW()`

### 7.2 Update Points: `update_user_points()`

**Trigger:** AFTER INSERT ON `exercise_completions`

```sql
UPDATE profiles
SET total_points = total_points + NEW.points_earned
WHERE id = NEW.user_id;
```

### 7.3 Update Streak: `update_streak()`

**Trigger:** AFTER INSERT ON `exercise_completions`

Logic:
1. Find date of last completion before today for this user
2. If last completion was yesterday → `current_streak += 1`
3. If last completion was today → no change (already counted)
4. Otherwise → `current_streak = 1` (streak broken)
5. If `current_streak > longest_streak` → update `longest_streak`
6. Always update `last_login = NOW()`

### 7.4 Check Achievements: `check_achievements()`

**Trigger:** AFTER INSERT ON `exercise_completions`

Checks and auto-awards these achievements (INSERT with ON CONFLICT DO NOTHING):
- `first_exercise` — total completions == 1
- `exercises_10` — total completions >= 10
- `exercises_50` — total completions >= 50
- `points_100` — total points >= 100
- `points_500` — total points >= 500
- `points_1000` — total points >= 1000
- `streak_7` — current streak >= 7
- `streak_30` — current streak >= 30
- `all_categories` — completed exercises from all 5 distinct categories

### 7.5 Trigger Execution Order

When `completeExercise()` inserts a completion row:
1. `update_user_points()` — increments total_points
2. `update_streak()` — updates streak + last_login
3. `check_achievements()` — awards any new achievements

---

## 8. Database RPCs (Remote Procedure Calls)

### `get_leaderboard(p_club_id, p_scope, p_scope_id, p_period, p_current_user_id, p_limit)`

Returns top 50 players ranked by points earned within the given period:
- `p_scope`: 'club' (all club players), 'year_group' (specific year), 'team' (specific team)
- `p_period`: 'week' (current week), 'month' (current month), 'all_time'
- Returns: rank, user_id, display_name, avatar_url, total_points, exercises_completed, current_streak, is_current_user

### `get_dashboard_metrics_scoped(p_club_id, p_team_ids)`

Returns: totalPlayers, activeLast7Days, totalCompletions, engagementRate
- If `p_team_ids` is NULL → returns all club data (for club admins)
- If `p_team_ids` has values → scoped to those teams (for team admins)

### `get_club_structure(p_club_id)`

Returns year groups with player counts: year, boys_count, girls_count, total_count

### `create_club(p_club_name)`

Creates a new club. Validates name length >= 2, checks uniqueness. SECURITY DEFINER.

### `reset_player_password(p_player_id, p_new_password)`

Admin-only RPC. Verifies caller is admin in same club as target player. Updates `auth.users.encrypted_password`.

### RLS Helper Functions (SECURITY DEFINER)

```sql
get_my_club_id() → SELECT club_id FROM profiles WHERE id = auth.uid()
get_my_role()    → SELECT role FROM profiles WHERE id = auth.uid()
```

Used in RLS policies to avoid infinite recursion on the profiles table.

---

## 9. Row Level Security (RLS) Policies

All tables have RLS enabled. Key patterns:

| Table | Operation | Who | Condition |
|-------|-----------|-----|-----------|
| clubs | SELECT | Everyone | `true` |
| clubs | UPDATE | Admins | `club_id = get_my_club_id() AND get_my_role() = 'admin'` |
| year_groups | SELECT | Everyone | `true` |
| year_groups | INSERT | Admins | `club_id = get_my_club_id() AND get_my_role() = 'admin'` |
| teams | SELECT | Everyone | `true` |
| teams | INSERT | Admins | via year_group join to club |
| profiles | SELECT | Club members | `club_id = get_my_club_id()` |
| profiles | UPDATE | Self | `id = auth.uid()` |
| profiles | UPDATE | Admins | `club_id = get_my_club_id() AND get_my_role() = 'admin'` |
| exercises | SELECT | Anyone (public) | `is_public = TRUE` |
| exercises | SELECT | Club members | `created_by_club_id = get_my_club_id()` |
| exercises | INSERT/UPDATE/DELETE | Admins | `created_by_club_id = get_my_club_id() AND get_my_role() = 'admin'` |
| exercise_completions | SELECT | Self | `user_id = auth.uid()` |
| exercise_completions | SELECT | Admins | user in same club |
| exercise_completions | INSERT | Self | `user_id = auth.uid()` |
| favorites | ALL | Self | `user_id = auth.uid()` |
| achievements | SELECT | Self | `user_id = auth.uid()` |
| store_exercises | SELECT | Everyone | `true` |
| store_reviews | SELECT | Everyone | `true` |
| store_reviews | INSERT | Authenticated | `auth.uid() IS NOT NULL` |
| store_downloads | SELECT | Club members | `club_id = get_my_club_id()` |
| store_downloads | INSERT | Admins | `club_id = get_my_club_id() AND get_my_role() = 'admin'` |
| admin_team_assignments | SELECT | Self | `admin_id = auth.uid()` |
| admin_team_assignments | SELECT | Club admins | admin is in same club |
| admin_team_assignments | INSERT/DELETE | Club admins | caller is club_admin |

---

## 10. Design System

### 10.1 Color Tokens

```typescript
// Primary (green - football field)
primary: '#2E7D32'       // Main
primaryLight: '#4CAF50'
primaryDark: '#1B5E20'

// Secondary (orange - energy)
secondary: '#FF9800'
secondaryLight: '#FFB74D'
secondaryDark: '#F57C00'

// Accent (blue)
accent: '#1976D2'

// Semantic
success: '#4CAF50'
warning: '#FF9800'
error: '#F44336'

// Gamification
streak: '#FF6B35'
leaderboard.gold: '#FFD700'
leaderboard.silver: '#C0C0C0'
leaderboard.bronze: '#CD7F32'

// Text (light mode)
text.primary: '#212121'
text.secondary: '#757575'
text.tertiary: '#9E9E9E'
text.disabled: '#BDBDBD'

// Text (dark mode)
text.primary: '#FFFFFF'
text.secondary: '#B0B0B0'
text.tertiary: '#808080'
text.disabled: '#606060'
```

### 10.2 Spacing

```typescript
xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48
```

### 10.3 Border Radius

```typescript
small: 4, medium: 8, large: 12, xlarge: 16, round: 9999
```

### 10.4 Typography

```
h1: fontSize 32, fontWeight 700
h2: fontSize 24, fontWeight 700
h3: fontSize 20, fontWeight 600
h4: fontSize 18, fontWeight 600
bodyLarge: fontSize 18, fontWeight 400
body: fontSize 16, fontWeight 400
bodySmall: fontSize 14, fontWeight 400
caption: fontSize 12, fontWeight 400
button: fontSize 16, fontWeight 600
label: fontSize 14, fontWeight 500
```

### 10.5 Shadows

```
small: { elevation: 2, shadowOffset: {0,1}, shadowOpacity: 0.18, shadowRadius: 1 }
medium: { elevation: 4, shadowOffset: {0,2}, shadowOpacity: 0.22, shadowRadius: 2.62 }
large: { elevation: 8, shadowOffset: {0,4}, shadowOpacity: 0.3, shadowRadius: 4.65 }
```

### 10.6 Tailwind Config Extensions

```javascript
colors: {
  primary: { 50-900 green scale },
  secondary: { 50-900 orange scale },
  accent: { 50-900 blue scale },
  success, warning, error, info, streak,
  leaderboard: { gold, silver, bronze }
}
```

---

## 11. Theme System

`ThemeProvider` reads `useAppStore().themeMode` ('light' | 'dark' | 'system').

`useTheme()` hook returns: `{ theme, colors, isDark }`

All components use `useTheme()` for colors — no hardcoded color values. Both light and dark palettes are defined.

---

## 12. Internationalization (i18n)

### Setup
- Default language: Norwegian (`no`)
- Secondary: English (`en`)
- Function: `t('keyPath')` with param interpolation: `t('home.greeting', { name: 'Ola' })`
- Helpers: `getCurrentLanguage()`, `setLanguage('en')`, `getSupportedLanguages()`

### Translation Key Structure (~337 keys)

```typescript
{
  common: { loading, error, retry, cancel, save, delete, edit, back, next },
  onboarding: { welcome, subtitle, selectClub, selectTeam, getStarted, skip },
  auth: {
    login, logout, username, password, email, displayName, confirmPassword,
    forgotPassword, loginButton, loginError, createAccount, playerLogin, adminLogin,
    noAccount, haveAccount, registrationSuccess, forgotPasswordTitle, forgotPasswordDescription,
    sendResetLink, emailSent, emailSentDescription, backToLogin, resetPassword,
    newPassword, confirmNewPassword, passwordResetSuccess, adminResetPassword,
    adminResetPasswordConfirm, passwordResetError, year, gender, boys, girls, mixed,
    selectClub, selectYear, selectGender, clubAdmin, teamAdmin, player, selectTeams, createNewClub,
    clubNamePlaceholder
  },
  tabs: { home, exercises, leaderboard, profile },
  home: { greeting, todayProgress, currentStreak, quickStart, viewAll, keepGoing, startTraining, todayChallenge },
  exercises: {
    title, all, warmup, strength, agility, skill, cooldown,
    difficulty, easy, medium, hard, duration, seconds, minutes, points,
    start, complete, instructions, completed, pointsEarned, greatJob,
    continueTraining, backToExercises, search, favorites, equipment
  },
  leaderboard: { title, club, yearGroup, team, thisWeek, thisMonth, allTime, rank, player, points, you, noData },
  profile: { title, totalPoints, exercisesCompleted, currentStreak, longestStreak, achievements, viewAll, settings, days },
  achievements: { title, locked, unlocked, + descriptions for each of 9 achievement types },
  settings: { title, appearance, theme, light, dark, system, notifications, enableNotifications, about, version, logout, logoutConfirm },
  notifications: { dailyReminder, dailyReminderDesc, newExercises, newExercisesDesc, leaderboard, leaderboardDesc, streakReminder, streakReminderDesc, note },
  about: { title, version, description, developer, privacy, copyright },
  admin: {
    dashboard: { title, totalPlayers, activeLast7Days, totalCompletions, engagementRate, recentActivity, topPerformers },
    players: { title, search, addPlayer, editPlayer, ... },
    exercises: { title, addExercise, editExercise, ... },
    clubStructure: { title, addYearGroup, ... },
    exerciseStore: { title, featured, popular, ... },
    reports: { title, weeklyActivity, monthlyPoints, ... },
    settings: { title, clubSettings, ... }
  },
  streak: { title, keepItUp, broken, newRecord },
  validation: { required, minLength, passwordMismatch, invalidEmail }
}
```

All UI text displayed to users goes through `t()`. Maestro E2E tests assert against Norwegian text (default).

---

## 13. Zustand Stores

### 13.1 authStore (not persisted)

```typescript
State:
  user: User | null
  club: Club | null
  team: Team | null
  managedTeamIds: string[]    // For team admins
  isLoading: boolean
  isAuthenticated: boolean
  isPasswordRecovery: boolean

Computed:
  isClubAdmin()        → user.role === 'admin' && user.admin_type === 'club_admin'
  isTeamAdmin()        → user.role === 'admin' && user.admin_type === 'team_admin'
  getEffectiveTeamIds() → null (club admin) or managedTeamIds (team admin)

Actions:
  setUser(user), setClub(club), setTeam(team), setManagedTeamIds(ids)
  setLoading(bool), clearPasswordRecovery()
  initialize()  → Subscribes to supabase.auth.onAuthStateChange()
                   Handles: SIGNED_OUT, PASSWORD_RECOVERY, SIGNED_IN, TOKEN_REFRESHED
                   On SIGNED_IN: fetches profile via authService.getProfile()
  logout()      → supabase.auth.signOut()
```

### 13.2 appStore (persisted via AsyncStorage, key: 'fotballtrening-app-storage')

```typescript
State:
  themeMode: 'light' | 'dark' | 'system'  (default: 'system')
  language: 'no' | 'en'                    (default: 'no')
  hasCompletedOnboarding: boolean           (default: false)
  selectedClubId: string | null             (default: null)

Actions:
  setThemeMode(mode)
  setAppLanguage(lang)       → also syncs i18n module
  setOnboardingComplete(bool)
  setSelectedClubId(clubId)

OnRehydrate: syncs persisted language with i18n module
```

### 13.3 exerciseStore (persisted via AsyncStorage, key: 'fotballtrening-exercise-storage')

```typescript
State:
  completions: ExerciseCompletion[]
  totalPoints: number
  favorites: string[]            // exercise IDs

Actions:
  addCompletion(completion)     → push to array, add points
  toggleFavorite(exerciseId)
  isFavorite(exerciseId): boolean
  getTodayCompletions()          → filter by today's date
  getTodayPoints()               → sum today's points_earned
  getTodayExerciseCount()        → count today's completions
```

### 13.4 adminStore (not persisted, in-memory only)

```typescript
State:
  players: AdminPlayer[]
  clubExercises: Exercise[]
  playerYearFilter: number | null
  playerGenderFilter: Gender | null
  exerciseCategoryFilter: ExerciseCategory | null

Actions:
  addPlayer(player), updatePlayer(id, data), deletePlayer(id)
  addExercise(exercise), updateExercise(id, data), deleteExercise(id)
  setPlayerYearFilter(year), setPlayerGenderFilter(gender), setExerciseCategoryFilter(category)
  getFilteredPlayers(), getFilteredExercises()
```

---

## 14. Services Layer

### 14.1 authService

| Function | Description |
|----------|-------------|
| `buildSyntheticEmail(username, teamId)` | Creates `{username}.{shortTeamId}@fotballtrening.app` |
| `signUpPlayer(username, password, clubId, teamId, displayName)` | Supabase signup with synthetic email + metadata |
| `signUpClubAdmin(email, password, clubId, displayName)` | Admin signup with admin_type='club_admin' |
| `signUpTeamAdmin(email, password, clubId, displayName, managedTeamIds)` | Admin signup with team assignments |
| `createClub(clubName)` | RPC `create_club()` |
| `loginPlayer(username, password, teamId)` | Login via synthetic email |
| `loginAdmin(email, password)` | Direct email/password login |
| `logout()` | `supabase.auth.signOut()` |
| `getSession()` | Returns current session |
| `sendPasswordResetEmail(email)` | Reset email with `fotballtrening://reset-password` redirect |
| `updatePassword(newPassword)` | Update authenticated user's password |
| `adminResetPlayerPassword(playerId, newPassword)` | RPC `reset_player_password()` |
| `getProfile(userId)` | Fetches profile + club + team + managedTeamIds |

### 14.2 exerciseService

| Function | Description |
|----------|-------------|
| `getExercises(clubId)` | Public + club exercises. Falls back to mock data |
| `getExerciseById(id)` | Single exercise |
| `completeExercise(userId, exerciseId, pointsEarned)` | INSERT completion (triggers fire) |
| `getCompletions(userId)` | All user completions |
| `getTodayCompletions(userId)` | Today's completions only |
| `getFavorites(userId)` | Array of favorited exercise IDs |
| `toggleFavorite(userId, exerciseId, isFavorite)` | INSERT or DELETE favorite |
| `createExercise(exercise)` | Admin: create exercise |
| `updateExercise(id, updates)` | Admin: update exercise |
| `deleteExercise(id)` | Admin: delete exercise |

### 14.3 leaderboardService

| Function | Description |
|----------|-------------|
| `getLeaderboard(clubId, scope, scopeId, period, currentUserId, limit)` | RPC `get_leaderboard()`, returns top 50 |

### 14.4 achievementService

| Function | Description |
|----------|-------------|
| `getAchievements(userId)` | Returns 9 achievement objects with `unlocked: boolean` |

### 14.5 adminService

| Function | Description |
|----------|-------------|
| `getPlayers(clubId, filters?, teamIds?)` | Players with year/gender filter and team scoping |
| `getDashboardMetrics(clubId, teamIds?)` | RPC `get_dashboard_metrics_scoped()` |
| `getRecentActivity(clubId, teamIds?)` | Recent 15 completion activities |
| `deletePlayer(userId)` | Soft delete (`is_active = false`) |

### 14.6 clubService

| Function | Description |
|----------|-------------|
| `getClubs()` | All clubs ordered by name |
| `getYearGroups(clubId)` | Year groups as dropdown options |
| `getTeams(yearGroupId)` | Teams with Norwegian gender labels |
| `getClubStructure(clubId)` | RPC `get_club_structure()` |
| `getAllTeamsForClub(clubId)` | All teams with year + gender |
| `addYearGroup(clubId, year)` | Creates year group + auto-creates boys + girls teams |

### 14.7 storeService

| Function | Description |
|----------|-------------|
| `getStoreExercises()` | All store exercises ordered by downloads |
| `getStoreExerciseById(id)` | Single store exercise |
| `getStoreReviews(exerciseId)` | Reviews for store exercise |
| `downloadToClub(storeExerciseId, clubId)` | Copy to club exercises + track download |
| `addReview(exerciseId, clubName, rating, comment)` | Add review |

### Fallback Pattern

All services check `isSupabaseConfigured()`. If false, they return mock data from `src/data/mockData.ts`. This allows the app to run without a Supabase backend during development.

---

## 15. React Query Hooks

### Query Key Factory (`src/lib/queryKeys.ts`)
```typescript
exercises: { all(clubId), detail(id), completions(userId), todayCompletions(userId), favorites(userId) }
leaderboard: (clubId, scope, period)
achievements: (userId)
clubs: { all(), yearGroups(clubId), teams(yearGroupId), structure(clubId) }
admin: { players(clubId), metrics(clubId), activity(clubId) }
store: { exercises(), detail(id), reviews(exerciseId) }
```

### useExercises.ts
- `useExercises(clubId?)` — all exercises
- `useExercise(exerciseId)` — single exercise
- `useCompleteExercise()` — mutation, invalidates todayCompletions + completions + achievements
- `useCompletions(userId?)` — all completions
- `useTodayCompletions(userId?)` — today's completions
- `useFavorites(userId?)` — favorite exercise IDs
- `useToggleFavorite()` — mutation, invalidates favorites
- `useCreateExercise()` — mutation, invalidates exercises.all
- `useUpdateExercise()` — mutation, invalidates exercises.all
- `useDeleteExercise()` — mutation, invalidates exercises.all

### useLeaderboard.ts
- `useLeaderboard(scope, scopeId, period)` — leaderboard entries

### useAchievements.ts
- `useAchievements(userId?)` — 9 achievements with unlocked status

### useAdmin.ts
- `usePlayers(filters?)` — admin player list (scoped by team admin)
- `useDashboardMetrics()` — dashboard stats
- `useRecentActivity()` — recent completions
- `useDeletePlayer()` — soft delete mutation

### useClub.ts
- `useClubs()` — all clubs
- `useYearGroups(clubId?)` — year groups
- `useTeams(yearGroupId)` — teams
- `useClubStructure(clubId?)` — year group stats
- `useAddYearGroup()` — mutation

### useStore.ts
- `useStoreExercises()` — store listing
- `useStoreExercise(id)` — store detail
- `useStoreReviews(exerciseId)` — reviews
- `useDownloadExercise()` — download to club mutation

---

## 16. Shared Components

### Button
- **Props:** title, onPress, variant (primary|secondary|outline|ghost), size (small|medium|large), disabled, loading, icon, fullWidth, testID
- **Behavior:** Spring scale animation on press, ActivityIndicator when loading
- **Styling:** borderRadius 12, flexible padding

### Card
- **Props:** children, title?, subtitle?, padding (none|small|medium|large)
- **Styling:** borderRadius 16, elevation 2 shadow

### Input
- **Props:** label?, error?, icon?, secureTextEntry, testID + TextInputProps
- **Features:** Password visibility toggle (eye icon), error state red border
- **Styling:** borderRadius 12

### Dropdown
- **Props:** label?, options[], selectedValue, onValueChange, placeholder, error?, testID
- **Features:** Modal picker overlay, checkmark on selected item, accessibility
- **Styling:** borderRadius 12, max-height 400px modal

### Badge
- **Props:** label, variant (easy|medium|hard|category|points|custom), size (small|medium)
- **Colors:** easy=green, medium=orange, hard=red, category=blue, points=yellow

### FAB (Floating Action Button)
- **Props:** onPress, icon?, size (small|medium|large), testID
- **Styling:** Absolute position (bottom 24, right 24), circular

### Toast (Provider + Hook)
- **Provider:** ToastProvider wraps app
- **Hook:** `useToast()` → `showToast(message, type)`
- **Types:** success (green), error (red), info (blue)
- **Behavior:** Auto-dismiss after 3s, animated in/out, positioned 90px above bottom

### SearchBar
- **Props:** value, onChangeText, placeholder?
- **Features:** Search icon left, clear (X) button when value.length > 0

### ErrorBoundary
- **Class component:** catches errors, shows "Noe gikk galt" with retry button
- **Integration:** Calls `captureError()` for Sentry reporting

### AdminHeader
- **Props:** title
- **Layout:** Hamburger menu button (toggles drawer) | title | spacer

### ConfirmationDialog
- **Props:** visible, title, message, confirmLabel?, cancelLabel?, onConfirm, onCancel, destructive?
- **Features:** Modal overlay, destructive mode uses error color

### EmptyState
- **Props:** icon (MaterialIcons key), title, description, actionLabel?, onAction?
- **Features:** Large circular icon container (96x96), centered text, optional action button

### LoadingSkeleton
- **Props:** width?, height?, borderRadius?
- **Features:** Shimmer animation (opacity 0.3→0.7, 800ms loop)
- **Variant:** SkeletonCard for card-shaped loading placeholders

### ProgressBar
- **Props:** progress (0-1), color?, backgroundColor?, height?
- **Features:** Smooth animated width transition

### Streak
- **Components:** StreakBadge (compact: flame + days), StreakCard (full: current + longest streaks)
- **Behavior:** Returns null if days === 0

---

## 17. Navigation Architecture

### Unauthenticated Flow
```
[First launch] → OnboardingScreen (3 swipeable pages)
                → LoginScreen ↔ RegisterScreen
                  LoginScreen → ForgotPasswordScreen
                  [deep link] → ResetPasswordScreen
```

### Player Flow (Bottom Tabs)
```
Home tab        → HomeScreen
Exercises tab   → ExercisesList → ExerciseDetail → ExerciseExecution → ExerciseComplete
Leaderboard tab → LeaderboardScreen
Profile tab     → ProfileScreen → Settings → ChangePassword / Notifications / About
```

Tab styling: custom colors from theme, tab bar height 88px.

### Admin Flow (Drawer Navigation)
```
Dashboard       → DashboardScreen
Players         → PlayersManagementScreen ←→ AddEditPlayerScreen (modal)
Club Structure  → ClubStructureScreen ←→ AddYearGroupScreen (modal)     [club_admin only]
Exercises       → ExercisesManagementScreen ←→ AddEditExerciseScreen (modal)
Exercise Store  → ExerciseStoreScreen → ExerciseStoreDetailScreen
Reports         → ReportsScreen
Settings        → AdminSettingsScreen
```

Drawer content: profile header (avatar + name + role), menu items with icons, logout at bottom. Club Structure only visible for club_admin.

---

## 18. Screen Details

### 18.1 OnboardingScreen (first launch only)
- 3 horizontal pages in FlatList with paging
- Page 1: Soccer icon + "Velkommen til FotballTrening!" + description
- Page 2: Fitness icon + "Slik fungerer det" + description
- Page 3: Trophy icon + "Konkurrer og vinn" + description
- Skip button (top-right, hidden on last page), Next/Get Started button
- 3 animated page indicator dots (active expands to width 24)
- Sets `appStore.setOnboardingComplete(true)` when finished

### 18.2 LoginScreen
- **Two tabs:** Player login | Admin login
- **Player mode:** Cascading dropdowns (Club → Year Group → Gender/Team) + username + password
- **Admin mode:** Email + password, forgot password link
- Register link at bottom
- Mock fallback when Supabase unavailable
- testIDs: login-club-dropdown, login-year-dropdown, login-gender-dropdown, login-username, login-password, login-button

### 18.3 RegisterScreen
- **Three tabs:** Player | Team Admin | Club Admin
- **Player:** club + year + gender + username + displayName + password + confirmPassword
- **Team Admin:** club + multi-select teams (checkboxes) + email + displayName + password
- **Club Admin:** club (with "create new club" option) + email + displayName + password
- testIDs: register-club-dropdown, register-year-dropdown, register-gender-dropdown, register-username-input, register-displayname-input, register-password-input, register-confirm-password-input, register-button

### 18.4 ForgotPasswordScreen
- Email input, send reset link button
- Two-state UI: form → success message with checkmark icon
- testIDs: forgot-email-input, forgot-send-button

### 18.5 ResetPasswordScreen
- Accessed via deep link from password reset email
- New password + confirm password
- After reset: logs out, redirects to login

### 18.6 HomeScreen (Player Dashboard)
- Greeting: "Hei, {displayName}!"
- Today's Progress card (2 columns: exercise count | points earned)
- StreakCard (current + longest streaks)
- Today's Challenge (deterministic daily: dayOfYear % exercises.length)
- Quick Start button → navigates to Exercises tab
- Recent Exercises (3 most recent, cards with title + category + points)
- Pull-to-refresh

### 18.7 ExercisesScreen (List)
- Search bar with filtering on title + description
- Horizontal category filter chips: All, Warmup, Strength, Agility, Skill, Cooldown
- Exercise cards: icon placeholder, title, description, difficulty badge (color-coded), duration with timer icon, favorite heart toggle, points badge
- FlatList with performance optimizations (maxToRenderPerBatch 10, windowSize 5)

### 18.8 ExerciseDetailScreen
- Hero section with large category icon
- Title + badges (difficulty, duration, points)
- Equipment row (if present)
- Description card
- Numbered instructions (split by ". ")
- Related exercises from same category (3 items)
- Start button → ExerciseExecution
- Favorite toggle (heart icon in header)

### 18.9 ExerciseExecutionScreen (Full-screen modal)
- Close button (top-left) with exit confirmation dialog
- Progress bar + elapsed/remaining time display
- Large circular timer (120px border) showing MM:SS countdown
- Current instruction step (updates based on progress)
- Pause/Resume button
- Complete button (disabled until timer finishes)
- Proper interval cleanup on unmount

### 18.10 ExerciseCompleteScreen (Celebration)
- Animated checkmark (scale from 0 with spring animation)
- 12 particle emojis burst outward with stagger (50ms between each)
- "Flott jobbet!" heading
- Points earned display
- Achievement unlocked message (if applicable)
- Streak bonus (if applicable)
- Continue button → back to exercises list
- Completion recorded via useCompleteExercise hook immediately

### 18.11 LeaderboardScreen
- Period selector chips: This Week, This Month, All Time
- Scope selector chips: Club, Year Group, Team
- Animated podium (top 3): Medal icons, avatars, points, rank bars
  - Layout: 2nd (left, h=80), 1st (center, h=110), 3rd (right, h=60)
  - Staggered entrance animation
- Rest of list: rank number, avatar initial, name, points
- Current user highlighted (primaryLight background)
- Pull-to-refresh

### 18.12 ProfileScreen
- Avatar circle with initial, display name, club name
- Stats grid: Total Points | Exercises Completed (2 columns)
- StreakCard
- Activity history (5 recent completions with date + points)
- Achievements section (grid of locked/unlocked badges)
- Settings icon in header → SettingsScreen

### 18.13 SettingsScreen
- Theme selector: 3 buttons (Light | Dark | System)
- Language selector: 2 buttons (Norsk | English)
- Settings list items with chevrons: Change Password, Notifications, About
- Logout button (destructive, with confirmation dialog)

### 18.14 Admin DashboardScreen
- 4 metric cards in 2x2 grid:
  - Total Players (people icon, primary color)
  - Active Last 7 Days (trending-up icon, success color)
  - Total Completions (check-circle icon, accent color)
  - Engagement Rate (speed icon, secondary color)
- Recent Activity list (8 items: player name, action, points)
- Top Performers section (top 5: avatar, name, exercises, points)

### 18.15 PlayersManagementScreen
- Search bar + year filter chips + gender filter chips
- Player cards: avatar, name, username, year, gender, points, active status dot
- Tap card → AddEditPlayerScreen
- FAB → Add new player

### 18.16 AddEditPlayerScreen (Modal)
- Form: Display Name, Username, Year Group (dropdown), Gender (dropdown), Password + Confirm (new only)
- Edit mode: password change triggers admin reset confirmation
- Full-width save button

### 18.17 ExercisesManagementScreen
- Search bar + category filter chips
- Exercise cards: title, category + difficulty badges, duration, points, delete icon
- Delete → confirmation alert → useDeleteExercise
- FAB → Add new exercise

### 18.18 AddEditExerciseScreen (Modal)
- Form: Title, Description (multiline), Category (dropdown), Difficulty (dropdown), Duration (numeric), Equipment, Instructions (multiline)
- Auto-calculated points: easy=10, medium=20, hard=30
- Full-width save button

### 18.19 ExerciseStoreScreen
- Search bar
- Featured section (horizontal scroll)
- Popular section (horizontal scroll, top 5 by downloads)
- All exercises section (grid, searchable)
- Store cards: icon, title, description, star rating, download count, "Add to club" button

### 18.20 ClubStructureScreen (club_admin only)
- Club info card (icon + name + year group count)
- Year group cards: year, boys count, girls count, total count
- FAB → AddYearGroupScreen

### 18.21 AddYearGroupScreen (Modal)
- Year input
- Auto-creates boys + girls teams when year group is added

### 18.22 ReportsScreen
- Date range selector: 7d | 30d | 90d
- Charts (wrapped in error boundaries):
  - Weekly Activity (LineChart)
  - Monthly Points (BarChart)
  - Category Distribution (PieChart)
  - Difficulty Distribution (BarChart)
- Export buttons: CSV, PDF
- Metric display: total completions, engagement rate

### 18.23 AdminSettingsScreen
- Profile section: avatar + name + admin role badge
- Club settings: club name (read-only), total players (read-only)
- Notification toggles (email + push)
- Theme selector: 3 buttons (Light | Dark | System)
- Logout button with confirmation

---

## 19. Authentication Flow Detail

### Player Signup
1. Player selects Club → Year → Gender (cascading dropdowns)
2. Enters username, display name, password
3. System generates synthetic email: `{username}.{shortTeamId}@fotballtrening.app`
4. `supabase.auth.signUp()` with metadata: `{ username, role: 'player', club_id, team_id, display_name }`
5. Trigger `handle_new_user()` creates profile row, auto-confirms email
6. Player is logged in

### Admin Signup
1. Admin chooses role: Club Admin or Team Admin
2. Club Admin: selects club (or creates new one), enters email + password
3. Team Admin: selects club, multi-selects teams (checkboxes), enters email + password
4. `supabase.auth.signUp()` with metadata: `{ role: 'admin', admin_type, club_id, display_name, managed_team_ids }`
5. Trigger creates profile + admin_team_assignments rows

### Login
- Player: Club/Year/Gender selection → username/password → synthetic email login
- Admin: email/password direct login
- On success: `authStore.initialize()` listener catches `SIGNED_IN`, calls `getProfile()`, populates store

### Password Reset (Admin only)
1. Admin clicks "Forgot Password" on login screen
2. Enters email → `sendPasswordResetEmail()` sends email with `fotballtrening://` deep link
3. User clicks link → app opens ResetPasswordScreen via deep link
4. Enters new password → `updatePassword()` → auto-logout → redirect to login

### Admin Reset Player Password
1. Admin navigates to player in PlayersManagementScreen
2. Opens edit form → enters new password
3. Confirmation dialog → calls `adminResetPlayerPassword()` RPC

---

## 20. Gamification System

### Points
- Each exercise has a base `points` value (easy=10, medium=20, hard=30)
- When player completes exercise → `exercise_completions` row inserted → trigger increments `profiles.total_points`

### Streaks
- Tracked daily (not per-completion)
- Consecutive days of at least 1 exercise completion
- If yesterday had completions and today has one → streak increments
- If gap > 1 day → streak resets to 1
- Longest streak tracked separately

### Achievements (9 types, auto-awarded by trigger)
| Type | Condition | Norwegian Name |
|------|-----------|---------------|
| first_exercise | 1 completion | Første øvelse |
| exercises_10 | 10 completions | 10 øvelser |
| exercises_50 | 50 completions | 50 øvelser |
| points_100 | 100 total points | 100 poeng |
| points_500 | 500 total points | 500 poeng |
| points_1000 | 1000 total points | 1000 poeng |
| streak_7 | 7-day streak | 7-dagers streak |
| streak_30 | 30-day streak | 30-dagers streak |
| all_categories | All 5 categories completed | Alle kategorier |

### Leaderboard
- 3 scopes: Club (all players), Year Group, Team
- 3 periods: This Week, This Month, All Time
- RPC calculates points earned within period
- Top 3 shown in animated podium, rest in scrollable list
- Current user highlighted

---

## 21. Mock Data Fallback

When Supabase is not configured (`isSupabaseConfigured()` returns false), all services return mock data:

- **mockClubs:** 4 clubs (Vaganes IL, Stavanger IF, Rosenborg BK Ungdom, Vålerenga IF)
- **mockYearGroups:** 2011-2016
- **mockGenders:** boys/girls/mixed with Norwegian labels (Gutter/Jenter/Blandet)
- **mockExercises:** 5+ exercises covering all categories
- **mockAdminPlayers, mockLeaderboardEntries, mockAchievements, mockStoreExercises, mockDashboardMetrics**

This enables full app development and testing without a Supabase backend.

---

## 22. Store Seed Data (35 Exercises)

The store comes pre-seeded with 35 Norwegian football training exercises:

| Category | Count | Examples |
|----------|-------|---------|
| Warmup | 7 | Dynamisk oppvarming, Oppvarming med ball, Rondo (griseboks), Pasning i bevegelse |
| Strength | 7 | Knebøy med varianter, Utfall, Planken, Ettbeins styrke, Eksplosive hopp |
| Agility | 7 | Stige-øvelser, Kjegle-sprint, T-test hurtighetsdrill, Reaksjonsøvelser |
| Skill | 9 | Dribling, Pasningstrening, Skuddtrening, Jonglering, Finter og vendinger, 1-mot-1 |
| Cooldown | 5 | Uttøying, Yoga-inspirert nedtrapping, Pustøvelser, Aktiv restitusjon |

Each has full Norwegian title, description, instructions, difficulty, duration, points, equipment, author, and rating.

---

## 23. testID Conventions

**Pattern:** `{feature}-{element}-{type}` — lowercase, hyphen-separated.

```
# Auth
login-club-dropdown, login-year-dropdown, login-gender-dropdown
login-username, login-password, login-button
register-club-dropdown, register-username-input, register-button
forgot-email-input, forgot-send-button

# Tabs
tab-home, tab-exercises, tab-leaderboard, tab-profile

# Exercises
exercise-card, exercise-start-button, exercise-timer
exercise-complete-button, exercise-back-button, exercise-favorite-button

# Admin
drawer-dashboard, drawer-players, drawer-exercises, drawer-store, drawer-reports, drawer-settings
add-player-fab, add-exercise-fab, add-yeargroup-fab
player-name-input, player-username-input, save-player-button

# Onboarding
onboarding-skip-button, onboarding-action-button

# General
{screen}-screen (e.g., home-screen, profile-screen)
{feature}-{action}-button (e.g., profile-edit-button)
{feature}-{field}-input (e.g., register-email-input)
```

---

## 24. Key Architectural Patterns

### Service Pattern
All services: check `isSupabaseConfigured()` → if false, return mock data → if true, call Supabase → on error, log and return mock data.

### Multi-Level Admin Scoping
- Club Admin: `getEffectiveTeamIds()` returns `null` → no filtering → sees all club data
- Team Admin: `getEffectiveTeamIds()` returns assigned team IDs → all queries scoped to those teams
- Every admin query (players, metrics, activity) passes teamIds parameter

### React Query + Zustand Integration
- Server state (exercises, leaderboard, achievements) → React Query
- Client state (auth, theme, favorites, filters) → Zustand
- Mutations invalidate relevant query keys for automatic refetch

### Theme-Aware Components
Every component uses `useTheme()` hook for colors. No hardcoded colors. Full dark mode support.

### Accessibility
All interactive elements have: `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `accessibilityHint`

---

## 25. Expo Configuration

```json
{
  "expo": {
    "name": "FotballTrening",
    "slug": "fotballtrening-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "scheme": "fotballtrening",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "backgroundColor": "#2E7D32"
    },
    "ios": {
      "bundleIdentifier": "com.bendixen.fotballtrening",
      "buildNumber": "3",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "package": "com.bendixen.fotballtrening",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2E7D32"
      }
    },
    "plugins": ["expo-secure-store", "expo-font", "@sentry/react-native/expo"],
    "updates": {
      "url": "https://u.expo.dev/..."
    }
  }
}
```

---

## 26. Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=<your-supabase-url>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
EXPO_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
```

---

## 27. Migration Sequence

| # | File | Purpose |
|---|------|---------|
| 001 | schema.sql | Core tables (clubs, year_groups, teams, profiles, exercises, achievements, store) |
| 002 | functions.sql | Triggers (points, streak, achievements) + RPCs (leaderboard, metrics, club_structure) |
| 003 | rls.sql | RLS policies on all tables |
| 004 | seed.sql | 4 clubs, year groups, teams, 7 public exercises, 10 store exercises + reviews |
| 005 | multi_level_admin.sql | admin_type column, admin_team_assignments, create_club RPC, scoped metrics |
| 006 | auto_confirm_email.sql | Auto-confirm email in handle_new_user(), fix existing users |
| 007 | fix_profiles_rls_recursion.sql | SECURITY DEFINER helpers to avoid infinite recursion |
| 008 | fix_exercises_rls_and_points.sql | Updated RLS with helpers, recalculate total_points |
| 009 | store_exercises_equipment.sql | Add equipment column to store_exercises and exercises |
| 010 | seed_store_exercises.sql | Reseed with 35 real Norwegian exercises |
| 011 | admin_reset_player_password.sql | RPC for admin password reset |

---

## 28. Summary of What to Build

1. **Supabase backend** with the complete schema, triggers, RPCs, and RLS policies described above
2. **Expo React Native app** with TypeScript strict mode and NativeWind styling
3. **15 shared components** (Button, Card, Input, Dropdown, Badge, FAB, Toast, SearchBar, ErrorBoundary, AdminHeader, ConfirmationDialog, EmptyState, LoadingSkeleton, ProgressBar, Streak)
4. **26 screens** across auth, player, admin, and onboarding flows
5. **4 Zustand stores** (auth, app, exercise, admin) with appropriate persistence
6. **7 service modules** with Supabase queries and mock data fallback
7. **6 React Query hook modules** with proper cache key management and mutation invalidation
8. **Full i18n** in Norwegian (primary) and English with ~337 translation keys
9. **Complete navigation** with bottom tabs (player), drawer (admin), and modal screens
10. **Gamification** with points, streaks, 9 achievements, and 3-scope × 3-period leaderboard
11. **Dark mode** with system/light/dark toggle
12. **Exercise store** with 35 pre-seeded Norwegian football exercises
13. **Role-based access** for players, team admins, and club admins with database-level RLS
