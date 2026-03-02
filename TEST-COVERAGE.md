# TEST-COVERAGE.md — Dekning per brukerhistorie (nye UX-features)

Opprettet: 2026-03-02

## Oversikt

| Brukerhistorie | Unit test | Screen test | E2E |
|---|---|---|---|
| Husket innlogging (compact mode) | appStore ✅ | LoginScreen ✅ | player-login.yaml ✅ |
| Redesignet hjem (status stripe, CTA) | — | HomeScreen ✅ | — |
| Dag 1-velkomst (ny bruker) | — | HomeScreen ✅ | — |
| Lydsystem | sounds ✅ | — | — |
| Utvidet feiring (konfetti, 3 CTA) | — | CompleteScreen ✅ | — |
| Level Up-modal | LevelUpModal ✅ | — | — |
| 7 nye prestasjoner | — | — | — |
| Vennesystem (søk, legg til, fjern) | friendService ✅, useFriends ✅ | **MANGLER** | — |
| High fives | highfiveService ✅, useHighFives ✅ | — | — |
| Toppliste vennefilter | useLeaderboard ✅ | LeaderboardScreen ✅ | — |
| Utfordringer synlighet | — | ExercisesScreen ✅ | — |
| Daglig utfordring 2x poeng | — | **MANGLER** | — |
| Streak shield | appStore ✅ | — | — |
| Innloggingsbonus | appStore ✅ | — | — |
| Pushvarsler | notifications ✅ | **MANGLER** | — |
| Maskot-komponent | Mascot ✅ | — | — |
| Maskot-melding + hook | MascotMessage ✅, useMascotMessage ✅ | — | — |
| Maskot-integrasjon | EmptyState ✅ | — | — |
| CreateChallenge (venner prioritert) | — | **MANGLER** | — |
| ChallengesScreen | — | **MANGLER** | — |
| FriendsScreen | — | **MANGLER** | — |
| NotificationsScreen | — | **MANGLER** | — |
| OnboardingScreen (maskot) | — | **MANGLER** | — |

## Oppsummering

- **8 skjermer mangler tester:** FriendsScreen, CreateChallengeScreen, ChallengesScreen, NotificationsScreen, OnboardingScreen, + daglig utfordring 2x-verifisering i ExerciseCompleteScreen/ExerciseExecutionScreen
- **Daglig utfordring-logikken** er helt utestet (hook finnes ikke, logikk er duplisert)
- **Kritiske brukerreiser** (venneutfordring, daglig innlogging → bonus → trening → feiring) mangler ende-til-ende-verifisering

## Kjente bugs

| ID | Bug | Alvorlighet | Fil(er) |
|----|-----|-------------|---------|
| A | Daglig utfordring race condition — `isDailyChallenge=false` under lasting | HØY | ExerciseExecutionScreen.tsx:40-45 |
| B | Daglig utfordring-logikk duplisert i 2 filer | MEDIUM | ExerciseExecutionScreen.tsx, HomeScreen.tsx |
| C | `points_earned` doubling i frontend OG trigger | LAV | ExerciseCompleteScreen.tsx:101 |
| D | `sounds.ts` er no-op (alle entries null) | MEDIUM | src/lib/sounds.ts |
| E | `activityFeedService` — `.limit(20)` før klientfiltrering | MEDIUM | src/services/activityFeedService.ts |
| F | Login bonus — DST edge case med 86400000ms | LAV | src/stores/appStore.ts:143 |
