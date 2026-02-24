# FotballTrening — Issue Tracker

> Primary tracking: [GitHub Issues](https://github.com/Bendix-ai/fotballtrening-app/issues)
> Milestone: [v1.1.0 — Bug Fixes & UX](https://github.com/Bendix-ai/fotballtrening-app/milestone/1)
>
> Last updated: 2026-02-24

---

## Bugs

| # | GitHub | Tittel | Prioritet | Status | Rotårsak | Fix / Commit |
|---|--------|--------|-----------|--------|----------|--------------|
| 1 | [#1](https://github.com/Bendix-ai/fotballtrening-app/issues/1) | Treg førstelasting — må gjenåpne app | Critical | **Fixed** | `getProfile()` ikke dekket av timeout → uendelig loading. Listener satte ikke `isLoading: false` | Wrappet hele session+profile i 5s timeout, la til `isLoading: false` i listener, `initialLoadDone` flag |
| 2 | [#2](https://github.com/Bendix-ai/fotballtrening-app/issues/2) | Kan ikke lagre øvelsesendringer | Critical | **Fixed** | `updateExercise`/`createExercise` returnerte null ved feil istedenfor å kaste error → mutation viste suksess | Service-funksjonene kaster nå Error ved Supabase-feil |
| 3 | [#3](https://github.com/Bendix-ai/fotballtrening-app/issues/3) | Push/e-post varsler fungerer ikke | Medium | Open | Ikke implementert — kun UI-toggles, «coming soon» | Korrekt kommunisert i UI — feature-gap, ikke kodefeil |
| 4 | [#4](https://github.com/Bendix-ai/fotballtrening-app/issues/4) | Versjon viser v1.0.0 | High | **Fixed** | Hardkodet v1.0.0 i AboutScreen | Opprettet `lib/version.ts` med `Constants.expoConfig?.version` + fallback '1.0.3' |
| 5 | [#5](https://github.com/Bendix-ai/fotballtrening-app/issues/5) | Hjelpesenter fører ingen plass | Medium | Open | Ingen hjelpeside eksisterer — i18n-nøkkel definert men ikke brukt i UI | Krever brukerflyt-beslutning (ny side eller URL) |
| 6 | [#6](https://github.com/Bendix-ai/fotballtrening-app/issues/6) | Spillerantall viser 12 (hardkodet) | High | **Fixed** | `getDashboardMetrics` falt tilbake til mock data (`totalPlayers: 12`) ved RPC-feil | Lagt til direkte `profiles`-count som fallback istedenfor mock |
| 7 | [#7](https://github.com/Bendix-ai/fotballtrening-app/issues/7) | Kan ikke redigere spillere som admin | Critical | **Fixed** | 1) Ingen loading state — skjema viste add-modus før data lastet. 2) `year_group` populert med årstall (2017) istedenfor UUID → dropdown-mismatch | Lagt til loading spinner, returnerer `year_group_id` fra API, bruker UUID i skjema-populering |
| 8 | [#8](https://github.com/Bendix-ai/fotballtrening-app/issues/8) | Kan ikke legge til årganger | High | **Fixed** | `addYearGroup` returnerte `false` ved feil istedenfor å kaste → mutation rapporterte suksess | Service-funksjonen kaster nå Error ved Supabase-feil |

## Feature Requests

| # | GitHub | Tittel | Prioritet | Status | Notater |
|---|--------|--------|-----------|--------|---------|
| 1 | [#9](https://github.com/Bendix-ai/fotballtrening-app/issues/9) | Standardpakke med øvelser | Medium | Open | Bulk-import av startsett |
| 2 | [#10](https://github.com/Bendix-ai/fotballtrening-app/issues/10) | Øvelsesbutikk UX | High | Open | Filtrering, bilder, bedre kort |
| 3 | [#11](https://github.com/Bendix-ai/fotballtrening-app/issues/11) | Rapporter med reelle data | High | Open | Erstatt dummytall, seed testdata |
| 4 | [#12](https://github.com/Bendix-ai/fotballtrening-app/issues/12) | Import fra Spond | Medium | Open | CSV/JSON import av lag/klubber |
| 5 | [#13](https://github.com/Bendix-ai/fotballtrening-app/issues/13) | Gjennomsiktig tab bar | Low | Open | Moderne iOS-design med blur |
| 6 | [#14](https://github.com/Bendix-ai/fotballtrening-app/issues/14) | UI/UX for unge brukere | High | Open | Brukerhistorier, større trykkmål |
| 7 | [#15](https://github.com/Bendix-ai/fotballtrening-app/issues/15) | Avatar / profilbilde | Medium | Open | expo-image-picker, Supabase Storage |
| 8 | [#16](https://github.com/Bendix-ai/fotballtrening-app/issues/16) | Øvelsesbrowsing med bilder | High | Open | Bilder, filtrering, visuelt hierarki |

---

## Prioritert rekkefølge for utbedring

### Runde 1 — Critical bugs (blokkerer bruk) — DONE
1. ~~**#1** Treg førstelasting~~ ✅
2. ~~**#2** Kan ikke lagre øvelsesendringer~~ ✅
3. ~~**#7** Kan ikke redigere spillere~~ ✅

### Runde 2 — High bugs (data-problemer) — DONE
4. ~~**#4** Feil versjonsnummer~~ ✅
5. ~~**#6** Hardkodet spillerantall~~ ✅
6. ~~**#8** Årganger lagres ikke~~ ✅

### Runde 3 — High features (UX-forbedringer)
7. **#10** Øvelsesbutikk UX
8. **#11** Rapporter med reelle data
9. **#14** UI/UX for unge brukere
10. **#16** Øvelsesbrowsing

### Runde 4 — Medium bugs + features
11. **#3** Varsler (feature-gap, ikke kodefeil)
12. **#5** Hjelpesenter (krever brukerflyt-beslutning)
13. **#9** Standardpakke øvelser
14. **#12** Spond-import
15. **#15** Avatar/profilbilde

### Runde 5 — Low priority
16. **#13** Gjennomsiktig tab bar
