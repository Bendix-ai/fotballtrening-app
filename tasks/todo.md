# Maestro E2E Testing - Progress Report

## Session Summary (2026-02-23)

### What was completed:
- [x] Read entire codebase and understood all 26 screens
- [x] Added testIDs to ~15 screen files (following `{feature}-{element}-{type}` convention)
- [x] Created 11 new Maestro YAML test files (total: 16 E2E tests)
- [x] Fixed pre-existing Toast test failure (Animated.timing mock)
- [x] Fixed TypeScript errors (tabBarButtonTestID)
- [x] Fixed wrong appId in all Maestro files (`com.fotballtrening.app` → `com.bendixen.fotballtrening`)
- [x] Removed invalid Maestro 2.x syntax (timeout, optional, wait properties)
- [x] Built iOS app on simulator (iPhone 17 Pro, iOS 26.2)
- [x] Connected dev client to Metro bundler

### Test Execution Results So Far:

| # | Test File | Status | Issue |
|---|-----------|--------|-------|
| 1 | `onboarding.yaml` | FAILING | Debug warning banner covers button; fixed to use swipe gestures instead, needs re-test |
| 2 | `forgot-password.yaml` | FIXED | Screen title is "Tilbakestill passord" not "Glemt passord?" — updated assertion |
| 3-16 | All others | NOT YET RUN | Queued for testing |

### Remaining work:
- [ ] Re-test `onboarding.yaml` (updated to use swipe gestures + dismiss debug banner)
- [ ] Test `forgot-password.yaml` (assertion fixed)
- [ ] Run and fix `player-login.yaml`
- [ ] Run and fix `player-registration.yaml`
- [ ] Run and fix `exercise-completion.yaml`
- [ ] Run and fix `exercise-favorites.yaml`
- [ ] Run and fix `leaderboard-check.yaml`
- [ ] Run and fix `profile-achievements.yaml`
- [ ] Run and fix `settings-theme-language.yaml`
- [ ] Run and fix `admin-add-player.yaml`
- [ ] Run and fix `admin-store-download.yaml`
- [ ] Run and fix `admin-exercise-crud.yaml`
- [ ] Run and fix `admin-club-structure.yaml`
- [ ] Run and fix `admin-edit-player.yaml`
- [ ] Run and fix `admin-reports.yaml`
- [ ] Run and fix `admin-settings.yaml`
- [ ] Final report of all findings and fixes

### Known Issues:
1. **Debug warning banner**: The "Open debugger to view warnings" banner overlaps interactive elements at the bottom of screens. Tests need to dismiss it (tap X at ~95%,97%) before interacting with bottom buttons.
2. **FlatList scroll animation**: Tapping the "Next" button on onboarding triggers `scrollToOffset` with animation, but Maestro moves too fast and the assertion fires before the scroll completes. Fixed by using `swipe` gestures instead.
3. **App state between tests**: Each test assumes a certain app state. Need to either chain tests or reset app state between them. Fresh install needed for onboarding test.

### Files Created (new Maestro tests):
1. `e2e/onboarding.yaml` - Onboarding first-launch flow
2. `e2e/player-registration.yaml` - Player registration
3. `e2e/forgot-password.yaml` - Forgot password flow
4. `e2e/profile-achievements.yaml` - Profile & achievements
5. `e2e/settings-theme-language.yaml` - Settings (theme/language)
6. `e2e/exercise-favorites.yaml` - Exercise favorites toggle
7. `e2e/admin-exercise-crud.yaml` - Admin exercise CRUD
8. `e2e/admin-club-structure.yaml` - Admin club structure
9. `e2e/admin-edit-player.yaml` - Admin edit player
10. `e2e/admin-reports.yaml` - Admin reports
11. `e2e/admin-settings.yaml` - Admin settings

### Files Modified (testIDs added):
- `src/navigation/AppNavigator.tsx` - Tab bar testIDs
- `src/navigation/AdminDrawerContent.tsx` - Drawer item testIDs
- `src/features/auth/RegisterScreen.tsx` - Registration form testIDs
- `src/features/auth/ForgotPasswordScreen.tsx` - Forgot password testIDs
- `src/features/onboarding/OnboardingScreen.tsx` - Onboarding testIDs
- `src/features/profile/ProfileScreen.tsx` - Profile testIDs
- `src/features/profile/SettingsScreen.tsx` - Settings testIDs
- `src/features/exercises/ExerciseDetailScreen.tsx` - Exercise detail testIDs
- `src/features/admin/ExercisesManagementScreen.tsx` - Exercise management testIDs
- `src/features/admin/AddEditExerciseScreen.tsx` - Add/edit exercise testIDs
- `src/features/admin/ClubStructureScreen.tsx` - Club structure testIDs
- `src/features/admin/AddYearGroupScreen.tsx` - Add year group testIDs

### Files Modified (bug fixes):
- `src/components/__tests__/Toast.test.tsx` - Fixed Animated.timing mock for test environment

### How to Resume:
1. Start Metro: `npx expo start --port 8081`
2. Launch app: `npx expo run:ios` (or `xcrun simctl launch booted com.bendixen.fotballtrening`)
3. Handle "Open in FotballTrening?" dialog if it appears
4. For onboarding test: uninstall app first (`xcrun simctl uninstall booted com.bendixen.fotballtrening`) then reinstall
5. Run tests: `export PATH="$HOME/.maestro/bin:$PATH" && maestro test e2e/<test>.yaml`
6. Continue from the remaining work list above
