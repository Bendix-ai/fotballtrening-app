# Lessons Learned

## 2026-02-23 — Full Codebase Audit

### Pattern: Unused Imports/Variables Accumulate Silently
- **Root cause**: Developers import types or destructure variables during development, then change the code without cleaning up
- **Rule**: Always run `npm run lint` after any code change and fix warnings immediately
- **Prevention**: Enable ESLint `--max-warnings 0` in CI to block PRs with any warnings

### Pattern: Query Cache Keys Must Include All Parameters That Affect Data
- **Root cause**: `useLeaderboard` had `scopeId` in the query function but NOT in the query key. Changing scopeId didn't invalidate the cache, showing stale data.
- **Rule**: Every parameter passed to `queryFn` that affects the result MUST be in the `queryKey`
- **Fix**: Added `scopeId` to `queryKeys.leaderboard()` signature and the hook's queryKey

### Pattern: NaN Propagation Through Math Operations
- **Root cause**: `Math.min(Math.max(NaN, 0), 1)` returns NaN, which breaks percentage-based width calculations in ProgressBar
- **Rule**: Always validate numeric inputs at component boundaries with `Number.isNaN()`

### Pattern: `as any` Casts Hide Real Type Mismatches
- **Root cause**: `supabase.rpc('increment_downloads' as any, ...)` bypasses type checking entirely
- **Rule**: Remove `as any` casts. If the RPC function isn't typed, add it to the Supabase types or use a proper type assertion

### Pattern: Worker Process Leak in Tests
- **Root cause**: React Query background timers and async operations keep the Jest worker alive
- **Rule**: Add `forceExit: true` to jest.config.js when using React Query in tests

### Pattern: ESLint Console Rule vs. Intentional Dev Logging
- **Root cause**: `analytics.ts` has intentional `console.log` calls wrapped in `__DEV__`, but ESLint's `no-console` rule still flags them
- **Rule**: Use `// eslint-disable-next-line no-console` for intentional dev-only console statements

### Pattern: Hardcoded Strings Break i18n
- **Root cause**: Many screens had hardcoded Norwegian strings instead of using `t()` calls, making language switching impossible
- **Rule**: NEVER use hardcoded text in UI. Always use `t('key')`. When a function builds UI text from a const array, convert it to a function that calls `t()` at render time (not at module load)
- **Fix**: Converted OnboardingScreen's `pages` const to `getPages()` function, replaced 30+ hardcoded strings across 7 screens

### Pattern: Service Functions Should Return Success/Failure Status
- **Root cause**: `toggleFavorite` returned `void` — callers had no way to know if the operation failed
- **Rule**: Supabase service functions should return a boolean or the result data, not void. Check `error` from Supabase and return false/null on failure
- **Fix**: Changed `toggleFavorite` to return `Promise<boolean>` with proper error handling

### Pattern: `.limit()` Before Client-Side Filtering Can Return 0 Results
- **Root cause**: `adminService.getRecentActivity()` used `.limit(15)` on the Supabase query, then filtered by club_id. If the 15 most recent activities were from other clubs, the result was empty.
- **Rule**: When filtering client-side after a query, fetch enough rows to have results after filtering. Use `.limit(100)` + `.slice(0, 15)` after filtering.

### Pattern: Maestro + Expo Dev Banner Blocks Tab Bar
- **Root cause**: Expo's "Open debugger to view warnings" banner covers the bottom tab bar in dev builds. Maestro can't read or tap through it.
- **Rule**: For Maestro E2E tests that need tab navigation, use in-app links (e.g., "Se alle") instead of tab bar taps. For admin screens, open the drawer explicitly with `admin-menu-button` testID.
- **Workaround**: Use coordinate taps to dismiss the banner X, then navigate via testID or in-content links

### Pattern: Maestro + iOS 26.2 Simulator Has Intermittent Crashes
- **Root cause**: `kAXErrorInvalidUIElement` XCTest driver error during view hierarchy queries. This is a Maestro/iOS compatibility issue, not a code issue.
- **Rule**: Accept intermittent failures during E2E testing on bleeding-edge iOS simulators. Retry once, then move on.

### Pattern: testIDs Referenced in E2E Tests Must Actually Exist in Source
- **Root cause**: E2E YAML files referenced `exercise-card`, `exercise-timer`, `exercise-complete-button`, `store-exercise-card`, etc. but these testIDs were never added to the component source files.
- **Rule**: When writing Maestro tests, always verify testIDs exist in the source. Add missing testIDs following the `{feature}-{element}-{type}` convention before writing the test.
