# FIX-AND-ITERATION-LOG.md

Opprettet: 2026-03-02

## Utgangspunkt

- 517 tester, 53 testsuiter, 0 type-feil, 0 lint-feil
- 8 skjermer manglet tester
- 6 kjente bugs identifisert

## Fikser

### Bug A+B: Daglig utfordring — race condition + duplisert logikk (HØY/MEDIUM)

**Problem:** `isDailyChallenge` ble beregnet inline med `useMemo` i to separate filer (`ExerciseExecutionScreen.tsx` og `HomeScreen.tsx`). Hvis exercises-lista var tom (under lasting), returnerte den `false`, noe som ga feil verdier under lasting.

**Fiks:**
- Opprettet `src/hooks/useDailyChallenge.ts` — delt hook med `dailyChallenge`, `isDailyChallenge(id)`, og `isLoading`
- Oppdaterte `ExerciseExecutionScreen.tsx` til å bruke hooken + deaktivere "Fullfør"-knappen mens exercises laster
- Oppdaterte `HomeScreen.tsx` til å bruke hooken (fjernet duplisert logikk)

**Verifisering:** `src/hooks/__tests__/useDailyChallenge.test.ts` (9 tester) + oppdaterte skjermtester (3 nye describe-blokker)

### Bug C: points_earned frontend doubling (LAV)

**Problem:** Frontend sendte `pointsEarned * 2` til backend, men databasetriggeren (`016_daily_challenge_bonus.sql`) doblerte også. Resultatet var korrekt, men frontend og trigger hadde duplisert ansvar.

**Fiks:** Fjernet doubling i `ExerciseCompleteScreen.tsx:101`. Frontend sender nå original `pointsEarned`, trigger håndterer multiplisering.

**Verifisering:** Eksisterende test "should call completeExercise mutation on mount" + ny test "should send original (non-doubled) points to backend"

### Bug D: sounds.ts no-op (MEDIUM)

**Problem:** Alle entries i `soundMap` var `null`. `playSound()` returnerte tidlig uten å spille lyd.

**Fiks:** Opprettet 4 placeholder MP3-filer i `assets/sounds/` og oppdaterte `soundMap` med `require()`-kall.

**Verifisering:** `src/lib/__tests__/sounds.test.ts` (3 tester, alle passerer)

### Bug E: activityFeedService — limit før klientfiltrering (MEDIUM)

**Problem:** `getActivityFeed()` hentet med `.limit(20)` før klientsidefiltrering på club/team. Kunne gi tom liste selv om klubben hadde aktivitet.

**Fiks:** Økte limit til 100, la til `.slice(0, 20)` etter filtrering.

**Verifisering:** Eksisterende tester + kodegjennomgang

### Bug F: Login bonus — DST edge case (LAV)

**Problem:** `86400000ms` er eksakt 24 timer, men DST-overganger gir 23 eller 25-timers dager.

**Fiks:** Byttet til `setDate(getDate() - 1)` for yesterday-beregning i `appStore.ts`.

**Verifisering:** `src/stores/__tests__/appStore.test.ts` — alle 27 tester passerer inkl. "should increment loginStreak for consecutive days"

## Nye tester

| Testfil | Tester | Type |
|---------|--------|------|
| `src/hooks/__tests__/useDailyChallenge.test.ts` | 9 | Hook |
| `src/features/profile/__tests__/FriendsScreen.test.tsx` | 10 | Screen |
| `src/features/exercises/__tests__/CreateChallengeScreen.test.tsx` | 27 | Screen |
| `src/features/exercises/__tests__/ChallengesScreen.test.tsx` | 29 | Screen |
| `src/features/profile/__tests__/NotificationsScreen.test.tsx` | 6 | Screen |
| `src/features/onboarding/__tests__/OnboardingScreen.test.tsx` | 5 | Screen |
| `src/features/exercises/__tests__/challengeFlow.test.ts` | 5 | Integration |
| Eksist. ExerciseCompleteScreen (nye tester) | +4 | Screen (2x) |
| Eksist. ExerciseExecutionScreen (nye tester) | +4 | Screen (2x) |
| **Totalt nye tester** | **~89** | |

## Sluttresultat

| Metrikk | Før | Etter |
|---------|-----|-------|
| Testsuiter | 53 | 59 |
| Tester | 517 | 606 |
| Type-feil | 0 | 0 |
| Lint-feil | 0 | 0 |
| Skjermer uten tester | 8 | 3* |

*Gjenværende uten tester: AdminDashboard, AdminPlayers, AdminSettings (admin-skjermer med lavere prioritet)

## Filer opprettet

- `TEST-COVERAGE.md`
- `FIX-AND-ITERATION-LOG.md`
- `src/hooks/useDailyChallenge.ts`
- `src/hooks/__tests__/useDailyChallenge.test.ts`
- `src/features/profile/__tests__/FriendsScreen.test.tsx`
- `src/features/exercises/__tests__/CreateChallengeScreen.test.tsx`
- `src/features/exercises/__tests__/ChallengesScreen.test.tsx`
- `src/features/profile/__tests__/NotificationsScreen.test.tsx`
- `src/features/onboarding/__tests__/OnboardingScreen.test.tsx`
- `src/features/exercises/__tests__/challengeFlow.test.ts`
- `assets/sounds/coin.mp3`
- `assets/sounds/complete.mp3`
- `assets/sounds/achievement.mp3`
- `assets/sounds/levelup.mp3`

## Filer endret

- `src/features/exercises/ExerciseExecutionScreen.tsx` — Bruker `useDailyChallenge` hook, deaktiverer knapp under lasting
- `src/features/exercises/ExerciseCompleteScreen.tsx` — Fjernet frontend-doubling av poeng
- `src/features/home/HomeScreen.tsx` — Bruker `useDailyChallenge` hook
- `src/services/activityFeedService.ts` — Økt limit fra 20 til 100, lagt til slice
- `src/stores/appStore.ts` — DST-safe yesterday-beregning
- `src/lib/sounds.ts` — Oppdatert soundMap med require()-kall
- `src/features/exercises/__tests__/ExerciseCompleteScreen.test.tsx` — +4 tester for 2x poeng
- `src/features/exercises/__tests__/ExerciseExecutionScreen.test.tsx` — +4 tester for daily challenge
