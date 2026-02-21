# CLAUDE.md — FotballTrening App

## Overview

FotballTrening is a React Native (Expo) mobile app for Norwegian football clubs to manage player training with gamification (points, streaks, achievements, leaderboards). The primary UI language is Norwegian. English is a secondary supported language.

---

## 1. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React Native | 0.81.5 |
| **Platform** | Expo (managed workflow) | 54.0.33 |
| **React** | React | 19.1.0 |
| **Language** | TypeScript (strict mode) | 5.9.2 |
| **Styling** | NativeWind (Tailwind for RN) | 4.2.1 |
| **Tailwind** | tailwindcss | 3.4.19 |
| **Navigation** | React Navigation (native-stack, bottom-tabs, drawer) | 7.x |
| **Client State** | Zustand (persisted via AsyncStorage) | 5.0.11 |
| **Server State** | TanStack React Query | 5.90.20 |
| **Backend** | Supabase (PostgreSQL + Auth + RLS) | 2.95.2 |
| **Animations** | React Native Reanimated | 4.1.1 |
| **Gestures** | React Native Gesture Handler | 2.28 |
| **Charts** | react-native-chart-kit | 6.12.0 |
| **Monitoring** | Sentry | 7.2.0 |
| **OTA Updates** | expo-updates | 29.0.16 |
| **Secure Storage** | expo-secure-store | 15.0.8 |
| **Icons** | @expo/vector-icons (MaterialIcons, Ionicons) | 15.0.3 |
| **Unit Testing** | Jest + jest-expo | 30.2.0 / 54.0.17 |
| **Component Testing** | @testing-library/react-native + jest-native | 13.3.3 / 5.4.3 |
| **E2E Testing** | Maestro (YAML flow files in `e2e/`) | latest |
| **Linting** | ESLint + Prettier | 8.57.1 / 3.8.1 |
| **CI/CD** | GitHub Actions + EAS Build/Submit | — |

### Key Config
- `tsconfig.json`: extends `expo/tsconfig.base`, strict mode
- `jest.config.js`: preset `react-native`, setup file `jest.setup.js` (228 lines of mocks)
- New Architecture enabled (`newArchEnabled: true`)
- Bundle ID: `com.bendixen.fotballtrening` (iOS + Android)

---

## 2. Project Structure

```
fotballtrening-app/
├── App.tsx                  — Root component (providers, AppNavigator)
├── index.ts                 — Entry point
├── app.json                 — Expo config
├── eas.json                 — EAS Build/Submit profiles (dev/preview/production)
├── jest.config.js           — Jest configuration
├── jest.setup.js            — Mocks for Supabase, navigation, reanimated, etc.
├── e2e/                     — Maestro E2E test flows (5 YAML files)
├── supabase/                — 11 SQL migration files (001–011)
├── docs/                    — Pre-launch checklist, app store metadata, legal docs
├── .github/workflows/       — test.yml (CI), build.yml (iOS production)
├── tasks/                   — todo.md and lessons.md (created as needed)
└── src/
    ├── components/          — 15+ shared UI components + __tests__/
    ├── features/            — Screen files grouped by feature
    │   ├── auth/            — Login, Register, ForgotPassword, ResetPassword
    │   ├── home/            — HomeScreen (player dashboard)
    │   ├── exercises/       — ExercisesScreen, Detail, Execution (timer), Complete
    │   ├── leaderboard/     — LeaderboardScreen
    │   ├── profile/         — Profile, Settings, ChangePassword, Notifications, About
    │   ├── admin/           — Dashboard, Players, Exercises, ClubStructure, Store, Reports, Settings
    │   └── onboarding/      — OnboardingScreen
    ├── hooks/               — Custom React Query hooks + __tests__/
    ├── services/            — API service modules + __tests__/
    ├── stores/              — Zustand stores + __tests__/
    ├── navigation/          — AppNavigator, AdminStack, ExercisesStack, ProfileStack
    ├── lib/                 — i18n (no/en), theme, supabase client, analytics
    ├── types/               — index.ts (all TypeScript interfaces)
    └── data/                — mockData.ts (fallback when Supabase unavailable)
```

---

## 3. App Screens & User Flows

### User Roles

| Role | Login Method | Navigation | Scope |
|------|-------------|------------|-------|
| **Player** | Club/year/gender dropdown + username/password | Bottom tabs | Own data |
| **Team Admin** | Email/password | Drawer | Managed teams only |
| **Club Admin** | Email/password | Drawer | Entire club |

### Navigation Architecture

**Unauthenticated:**
```
OnboardingScreen (first launch) → LoginScreen ↔ RegisterScreen
                                  LoginScreen → ForgotPasswordScreen
                                  (deep link) → ResetPasswordScreen
```

**Player (bottom tabs):**
```
Home tab        → HomeScreen (greeting, streak, progress, daily challenge)
Exercises tab   → ExercisesList → ExerciseDetail → ExerciseExecution (timer) → ExerciseComplete (celebration)
Leaderboard tab → LeaderboardScreen (scope: Klubb/Lag/Årgang, period: week/month/all-time)
Profile tab     → ProfileScreen → Achievements / Settings / ChangePassword / Notifications / About
```

**Admin (drawer):**
```
Dashboard       → DashboardScreen (metrics, activity, top players)
Players         → PlayersManagementScreen → AddEditPlayerScreen (modal)
Club Structure  → ClubStructureScreen → AddYearGroupScreen (modal)
Exercises       → ExercisesManagementScreen → AddEditExerciseScreen / ExercisePreviewScreen
Exercise Store  → ExerciseStoreScreen → ExerciseStoreDetailScreen (download)
Reports         → ReportsScreen (charts, analytics)
Settings        → AdminSettingsScreen (theme, language, account)
```

### Critical User Flows — Maestro Coverage Status

| # | Flow | Screens | Maestro E2E? |
|---|------|---------|:------------:|
| 1 | Player login | Login → Home | YES |
| 2 | Exercise completion | Exercises → Detail → Execution → Complete | YES |
| 3 | Leaderboard browsing | Leaderboard (scope/period switching) | YES |
| 4 | Admin add player | Dashboard → Players → AddPlayer | YES |
| 5 | Admin store download | Store → Detail → Download | YES |
| 6 | Player registration | Login → Register → fill form → confirm | NO |
| 7 | Forgot password (admin) | Login → ForgotPassword → email sent | NO |
| 8 | Profile & achievements | Profile → view stats → tap achievement | NO |
| 9 | Settings (theme/language) | Settings → toggle dark mode / switch language | NO |
| 10 | Admin exercise CRUD | Exercises → add/edit/delete exercise | NO |
| 11 | Admin club structure | ClubStructure → add year group | NO |
| 12 | Admin reports | Reports → verify charts load | NO |
| 13 | Onboarding (first launch) | Onboarding → swipe → get started | NO |
| 14 | Exercise favorites | Exercises → Detail → toggle favorite | NO |
| 15 | Admin edit player | Players → tap → edit → save | NO |
| 16 | Admin reset password | Players → tap → reset password | NO |

---

## 4. Testing Approach

### 4.1 Unit & Component Testing (Jest)

**Commands:**
```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
npm run validate          # typecheck + lint + test (full CI)
```

**Current state:** 27 test files, 216+ tests
- Component tests (9): Badge, Button, Card, Dropdown, ErrorBoundary, FAB, Input, SearchBar, Toast
- Hook tests (6): useAchievements, useAdmin, useClub, useExercises, useLeaderboard, useStore
- Service tests (7): achievement, admin, auth, club, exercise, leaderboard, store
- Store tests (4): admin, app, auth, exercise
- Setup test (1): `src/__tests__/setup.test.ts`

**Components WITHOUT tests (need coverage):**
AdminHeader, ConfirmationDialog, EmptyState, LoadingSkeleton, ProgressBar, Streak

**Screen files WITHOUT tests:** All 26 screens in `src/features/` have zero unit tests — biggest gap.

**Established test patterns:**

Component tests (`src/components/__tests__/`):
```typescript
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ComponentName } from '../ComponentName';
describe('ComponentName', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  it('should render correctly', () => { /* render + assertions */ });
});
```

Service tests (`src/services/__tests__/`):
```typescript
import { supabase } from '../../lib/supabase';
import * as myService from '../myService';
const mockFrom = supabase._mockFrom;
// Uses the mock chain from jest.setup.js (select, insert, update, delete, eq, order, etc.)
```

Store tests (`src/stores/__tests__/`):
```typescript
import { useMyStore } from '../myStore';
// Setup: useMyStore.setState({...})
// Assert: useMyStore.getState().someValue
// Actions: useMyStore.getState().someAction()
```

Hook tests (`src/hooks/__tests__/`):
```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
function createWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return ({ children }) => React.createElement(QueryClientProvider, { client: qc }, children);
}
```

**Coverage targets:**
- Services: 90%+ (critical business logic)
- Stores: 90%+ (state management)
- Hooks: 80%+ (data fetching)
- Components: 80%+ (shared UI)
- Screens: 60%+ (happy paths)
- **Overall: 75%+**

### 4.2 E2E Testing (Maestro)

**Commands:**
```bash
npx expo start                          # Start dev server first
maestro test e2e/player-login.yaml      # Run single test
maestro test e2e/                       # Run all E2E tests
```

**Existing tests (5):**
1. `e2e/player-login.yaml` — Club/year/gender dropdowns → credentials → login → verify home tab
2. `e2e/exercise-completion.yaml` — Exercises tab → card → detail → start → timer → complete → points
3. `e2e/admin-add-player.yaml` — Dashboard → drawer → Players → FAB → form → save → verify
4. `e2e/leaderboard-check.yaml` — Leaderboard → filters → switch periods → switch scopes
5. `e2e/admin-store-download.yaml` — Drawer → Store → exercise → download → verify success

**Maestro YAML structure:**
```yaml
appId: com.fotballtrening.app
name: "Descriptive Flow Name"
---
# Comments in English
- assertVisible: "Norwegian UI text"
- tapOn:
    id: "testid-name"
- inputText: "value"
- assertVisible:
    id: "element-id"
    timeout: 5000
```

**Priority flows needing E2E coverage (ordered):**
1. Player registration (new user onboarding)
2. Profile & achievements viewing
3. Settings (theme toggle, language switch)
4. Admin exercise CRUD (create/edit/delete)
5. Onboarding (first-launch flow)
6. Exercise favorites toggle
7. Admin club structure (add year group)
8. Admin player edit + password reset
9. Forgot password flow
10. Admin reports (charts load)

### 4.3 testID Conventions

**Naming pattern:** `{feature}-{element}-{type}` — all lowercase, hyphen-separated.

**Currently used testIDs:**
```
# Login
login-club-dropdown, login-year-dropdown, login-gender-dropdown
login-username, login-password, login-button

# Tabs
tab-home, tab-exercises, tab-leaderboard

# Exercises
exercise-card, exercise-start-button, exercise-timer
exercise-complete-button, exercise-back-button

# Admin: Players
drawer-players, add-player-fab
player-name-input, player-username-input, player-password-input
player-year-dropdown, player-gender-dropdown, save-player-button

# Admin: Store
drawer-store, store-exercise-card, store-download-button, store-back-button
```

**Convention for NEW testIDs:**
- Tabs: `tab-{name}` (e.g., `tab-profile`)
- Buttons: `{feature}-{action}-button` (e.g., `profile-edit-button`)
- Inputs: `{feature}-{field}-input` (e.g., `register-email-input`)
- Dropdowns: `{feature}-{field}-dropdown` (e.g., `register-club-dropdown`)
- Cards: `{feature}-card` (e.g., `achievement-card`)
- Drawer items: `drawer-{section}` (e.g., `drawer-exercises`)
- Screen markers: `{screen}-screen` (e.g., `home-screen`)
- FABs: `{feature}-fab` (e.g., `add-exercise-fab`)

**Rules:**
- Every interactive element in a Maestro test MUST have a testID
- Never duplicate a testID across the app
- Add testIDs to the component source file, not the test file
- Components `Button`, `Input`, `FAB`, `Dropdown` already accept `testID` prop

---

## 5. Ready for App Store Criteria

### 5.1 Code Quality Gates
- [ ] `npx tsc --noEmit` — zero errors
- [ ] `npm run lint` — zero errors (warnings acceptable)
- [ ] `npm test` — all 216+ tests pass, zero failures
- [ ] `npm run test:coverage` — overall >= 75%
- [ ] No `@ts-ignore` or `// eslint-disable` in production code

### 5.2 E2E Test Coverage
- [ ] All 5 existing Maestro tests pass on iOS Simulator
- [ ] Additional Maestro tests exist and pass:
  - [ ] Player registration flow
  - [ ] Profile & achievements flow
  - [ ] Settings (theme + language toggle)
  - [ ] Admin exercise CRUD
  - [ ] Onboarding first-launch

### 5.3 Functional Requirements
- [ ] Player login works (club/year/gender + username/password)
- [ ] Admin login works (email/password)
- [ ] Exercise browsing, detail, execution timer, completion, points award
- [ ] Leaderboard loads with correct scope/period filtering
- [ ] Achievements unlock on milestones
- [ ] Streaks calculate correctly (daily training)
- [ ] Admin CRUD: players, exercises, club structure
- [ ] Admin dashboard metrics load
- [ ] Exercise store download works
- [ ] Dark mode renders correctly on all screens
- [ ] Norwegian and English translations complete, switching works
- [ ] Mock data fallback works without Supabase

### 5.4 Production Readiness
- [ ] Sentry configured and sending test crash reports
- [ ] No console.log in production code (console.warn/error OK per ESLint)
- [ ] App loads within 3 seconds on mid-range device
- [ ] No memory leaks on exercise execution (timer cleanup)
- [ ] Error boundaries catch and display friendly messages

### 5.5 App Store Requirements (from `docs/pre-launch-checklist.md`)
- [ ] Apple Developer Account active
- [ ] EAS Secrets configured (SUPABASE_URL, SUPABASE_ANON_KEY, SENTRY_DSN)
- [ ] `app.json` version and buildNumber correct
- [ ] App icon 1024x1024 (no alpha) at `assets/icon.png`
- [ ] Privacy policy published at live URL (content: `docs/privacy-policy.md`)
- [ ] Terms of service published at live URL (content: `docs/terms-of-service.md`)
- [ ] App Store metadata written (`docs/app-store-metadata.md`)
- [ ] Screenshots for iPhone 6.7", 6.1", and iPad
- [ ] `ITSAppUsesNonExemptEncryption: false` in app.json
- [ ] Age rating: 4+ / Category: Sport
- [ ] TestFlight beta tested with real users
- [ ] `npm run validate` passes before every submission
- [ ] Production build succeeds: `eas build --platform ios --profile production`

---

## 6. Rules for Testing & Development

### 6.1 Test-First Bug Fixing
1. Write a failing test that reproduces the bug
2. Verify the test actually fails
3. Fix the bug
4. Verify the test now passes
5. Run `npm test` — no regressions
6. Run `npx tsc --noEmit` — type safety
7. Add the bug pattern and fix to `tasks/lessons.md`

### 6.2 Adding New Tests
1. Identify the file to test
2. Create test at the correct `__tests__/` location following existing patterns
3. Import module under test
4. Write tests: happy path, error cases, edge cases
5. For hooks: use `createWrapper()` with `QueryClientProvider`
6. For stores: use `useMyStore.setState({})` / `getState()`
7. For services: use mock Supabase chain from `jest.setup.js`
8. Run specific test: `npx jest src/path/__tests__/file.test.ts`
9. Run full suite: `npm test`

### 6.3 Adding Maestro E2E Tests
1. Create `e2e/{feature}-{action}.yaml`
2. Header: `appId: com.fotballtrening.app` + descriptive `name:`
3. State prerequisites in comments (e.g., `# Prerequisite: logged in as admin`)
4. Use `id:` selectors (testIDs) primarily, text as fallback
5. Add `timeout:` for network/animation-dependent assertions (default 5000ms)
6. Use `optional: true` for conditional elements
7. Comments in English, assert against Norwegian UI text
8. Test: `maestro test e2e/your-test.yaml`
9. If testID missing from a component, add it to the source component first

### 6.4 Verification Checklist (after every change)
```bash
npx tsc --noEmit          # 1. Type safety
npm run lint               # 2. Code quality
npm test                   # 3. Unit tests
```
All three must pass before any change is considered complete.

For UI changes, also:
```bash
npx expo start             # 4. Visual verification
maestro test e2e/          # 5. E2E (if affected screens changed)
```

### 6.5 Completion Criteria
Never mark a task as done without:
- All three validation commands passing (typecheck, lint, test)
- A clear explanation of what changed and why
- If bug fix: a new test proving the fix
- If new feature: tests covering the happy path minimum
- If UI change: Maestro test passes or visual verification in simulator

### 6.6 Lessons & Self-Improvement
- After any user correction → update `tasks/lessons.md`
- After any bug fix → note root cause in `tasks/lessons.md`
- Review `tasks/lessons.md` at start of every session
- Write rules that prevent repeating the same mistake

### 6.7 When to Ask vs. When to Fix

**Ask the user before:**
- Changing navigation structure
- Adding new npm dependencies
- Modifying Supabase schema or migrations
- Changing test framework or config
- Making architectural decisions (new patterns, abstractions)
- Deleting existing tests or code

**Just fix without asking:**
- Lint/type errors
- Adding missing testIDs (follow the convention)
- Writing tests for uncovered files (follow established patterns)
- Fixing failing tests (reproduce, diagnose, fix)

---

## 7. NPM Scripts Reference

```bash
# Development
npm start                  # Expo dev server
npm run ios                # iOS simulator
npm run android            # Android emulator

# Testing
npm test                   # Jest
npm run test:watch         # Jest watch mode
npm run test:coverage      # Jest + coverage
npm run validate           # typecheck + lint + test

# Code Quality
npm run lint               # ESLint
npm run lint:fix           # ESLint auto-fix
npm run typecheck          # tsc --noEmit
npm run format             # Prettier format
npm run format:check       # Prettier check

# Build & Deploy
npm run build:dev          # EAS dev build
npm run build:preview      # EAS preview build
npm run build:production   # EAS production build
npm run build:ios          # iOS production
npm run build:android      # Android production
npm run submit:ios         # App Store / TestFlight
npm run submit:android     # Google Play
```

---

## 8. Database Schema (Supabase)

**Core tables:** clubs, year_groups, teams, profiles, exercises, exercise_completions, achievements, favorites

**Store tables:** store_exercises, store_reviews, store_downloads

**Admin tables:** admin_team_assignments

**Key relationships:**
```
Club → YearGroup → Team → Profile (player)
Profile → ExerciseCompletion → Exercise
Profile → Achievement
Profile → Favorite → Exercise
Admin → AdminTeamAssignment → Team
```

**Auto-triggers:**
- `on_auth_user_created` → auto-create profile
- `on_exercise_completed` → auto-update total_points
- `on_completion_update_streak` → auto-calculate current/longest streak
- `on_completion_check_achievements` → auto-award 9 achievement types

**RLS:** All tables protected. Players see club data. Team admins see managed teams. Club admins see all club data.

**Migrations:** 11 files in `supabase/` (001_schema → 011_admin_reset_player_password)

---

## 9. i18n

- Default: Norwegian (`no`) — `src/lib/i18n/no.ts`
- Secondary: English (`en`) — `src/lib/i18n/en.ts`
- Function: `t('keyPath')` with optional params: `t('home.greeting', { name: 'Ola' })`
- Key structure: nested objects (e.g., `auth.login`, `exercises.title`, `admin.dashboard`)
- When adding new UI text: ALWAYS add to both `no.ts` and `en.ts`
- Maestro tests assert against Norwegian text (default language)
