# UX-LOGG — Konkrete designløsninger for kjerneskjermene

> Designvalg for de viktigste endringene. Fokus: minimale kodeendringer, maksimal opplevelseseffekt.
> Alle løsninger kan implementeres uten å bygge om plattformen.

---

## 1. Hjemmeskjermen — Fra informasjonsdump til handlingsrettet

### Nåværende problem
Hjemmeskjermen viser 7+ kort i en lang scrollview. En 10-åring ser alt, men forstår ingenting. Ingen tydelig "gjør dette nå"-element.

### Ny struktur

```
┌────────────────────────────────┐
│  Hei Oliver! 👋                │
│                                │
│  ┌────────────────────────────┐│
│  │  🏆 DAGENS TRENING         ││
│  │                            ││
│  │  "Sprintøvelser"           ││
│  │  ⭐ 2x poeng i dag!        ││
│  │                            ││
│  │  ┌──────────────────────┐  ││
│  │  │    START NÅ! →       │  ││
│  │  └──────────────────────┘  ││
│  └────────────────────────────┘│
│                                │
│  🔥 3 dager på rad!  │ Nivå: ⚽│
│  ━━━━━━━━━░░░  70%   │ Bronse │
│                                │
│  Venneaktivitet:               │
│  Emma fullførte Knebøy 💪     │
│  Jonas slo streak-rekord! 🔥  │
│                                │
│  [Se mer ▼]                    │
└────────────────────────────────┘
```

### Designvalg

**Handling #1 — "Dagens trening"-kortet:**
- Tar opp ~40 % av skjermhøyden.
- Stort, animert kort med pulserende kant (subtil glow-animasjon).
- Viser daglig utfordring med bonuspoeng ("2x poeng i dag!").
- Én tydelig CTA-knapp: "START NÅ!" i kontrastfarge.
- Trykk = direkte til treningsgjennomføring (skipper detaljskjerm for daglig utfordring).

**Handling #2 — Kompakt status-stripe:**
- Streak + nivå på én linje, side om side.
- Progresjonsbar mot neste nivå (visuelt, ikke tekst).
- Trykk = ekspanderer til full status.

**Handling #3 — Venneaktivitet (2–3 linjer):**
- Kort feed med vennenes siste prestasjoner.
- Mulighet for å trykke "👋" (high five) direkte fra feeden.
- Kun synlig hvis bruker har venner. Ellers: "Legg til en venn!" CTA.

**"Se mer"-seksjon (kollapset):**
- Ukens statistikk, alle prestasjoner, toppliste-rangering.
- Skjult bak ett trykk for å holde skjermen ren.

### Fil som endres
`src/features/home/HomeScreen.tsx` — Reorganisering av eksisterende seksjoner. Ingen nye avhengigheter.

### Kodeendring (logikk)
```
Fjern: Separat daglig mål-kort, separat streak-kort, separat nivå-kort,
       separat toppliste-kort, separat daglig utfordring-kort
Behold: Hilsen, aktivitetsstrøm, nylige øvelser
Legg til: Kombinert "Dagens trening"-kort, kompakt statuslinje,
          venneaktivitets-feed (kort variant)
Flytt: Alt annet bak "Se mer"-kollaps
```

---

## 2. Ferdig-skjermen — Fra "ok, ferdig" til "YEEES!"

### Nåværende problem
Konfetti vises i ~2 sek, "+10 poeng" bouncer, "Fortsett trening"-knapp. For kort, for stille, for lite kontekst.

### Ny struktur

```
┌────────────────────────────────┐
│                                │
│      🎊  🎊  🎊  🎊  🎊       │
│                                │
│         ✅ BRA JOBBET!         │
│                                │
│    "Sprintøvelser" fullført!   │
│                                │
│    ┌────────────────────┐      │
│    │  ⭐ +25 poeng       │      │
│    │  ━━━━━━━━░░  80%   │      │
│    │  Til Sølv-rangering │      │
│    └────────────────────┘      │
│                                │
│    🔥 Streak: 4 dager!         │
│    Du slo Emma med 10 poeng!   │
│                                │
│  ┌──────────────────────────┐  │
│  │   Utfordre en venn 🤝    │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │   Tren mer 💪             │  │
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │   Se topplisten 🏆       │  │
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

### Designvalg

**Feiring (3–4 sekunder):**
- Konfetti-partikler varer lengre (3–4 sek i stedet for 2).
- Lydsignal: myntklirr ved poeng-visning, jubeleffekt ved prestasjonsopplåsing.
- Haptic feedback: medium impact ved konfetti-start.

**Progresjonskort:**
- Viser progresjonsbar mot neste rangering (f.eks. "80 % til Sølv").
- Animerer barens fylling fra forrige verdi til ny verdi (visuelt bevis på fremgang).
- Ved rangeringsopprykk: erstatter dette kortet med fullskjerm "LEVEL UP!" animasjon.

**Sosial sammenligning (kontekstuell):**
- Hvis bruker slo en venn i dag: "Du slo Emma med 10 poeng!"
- Hvis bruker klatret på topplisten: "Du klatret til #5 denne uken!"
- Hvis ingen sosial data: vis streak-info i stedet.

**Tre valgknapper (i stedet for én):**
- "Utfordre en venn" — Viktigst for retention. Øverst.
- "Tren mer" — For de som er i flytsonen.
- "Se topplisten" — For de som vil sjekke rangering.

### Filer som endres
`src/features/exercises/ExerciseCompleteScreen.tsx` — Utvide eksisterende feiring.
Ny fil: `src/lib/sounds.ts` — Lyd-utilities med `expo-av`.

### Kodeendring (logikk)
```
Endre: Konfetti-varighet fra 2s → 4s
Endre: Erstatt enkelt "Fortsett"-knapp med tre valgknapper
Legg til: Progresjonsbar-kort mot neste rangering
Legg til: Kontekstuell sosial melding (betinget rendering)
Legg til: Lydavspilling ved poeng og prestasjoner
```

---

## 3. Innlogging — Fra skjema til hurtigstart

### Nåværende problem
5 felter: klubb-dropdown, årgang-dropdown, kjønn-dropdown, brukernavn, passord. Hver gang.

### Ny logikk

```
Første innlogging:         Påfølgende innlogginger:
┌────────────────────┐     ┌────────────────────┐
│  Velg ditt lag:    │     │  Velkommen tilbake! │
│                    │     │                    │
│  [Våganes FK  ▼]  │     │  Våganes FK G2015  │
│  [2015        ▼]  │     │  (Bytt lag)        │
│  [Gutter      ▼]  │     │                    │
│                    │     │  [Brukernavn      ]│
│  [Brukernavn     ] │     │  [Passord       🔒]│
│  [Passord      🔒] │     │                    │
│                    │     │  [LOGG INN →]      │
│  [LOGG INN →]     │     │                    │
└────────────────────┘     └────────────────────┘
```

### Designvalg

**Husket kontekst:**
- Lagre valgt klubb, årgang og kjønn i AsyncStorage etter første innlogging.
- Ved neste åpning: vis valgt lag som tekst, ikke dropdowns.
- "Bytt lag"-lenke for de som trenger det (kollapser ut dropdowns).

**Barnespråk:**
- "Årgang" → "Ditt lag" (med årstall i parentes)
- "Kjønn" → fjernes visuelt, automatisk basert på valgt lag/gruppe

**Biometrisk innlogging (fremtidig):**
- Etter første vellykket innlogging: tilby "Vil du logge inn med Face ID neste gang?"
- Lagre token i `expo-secure-store`.

### Fil som endres
`src/features/auth/LoginScreen.tsx` — Betinget rendering basert på lagret kontekst.

### Kodeendring (logikk)
```
Legg til: AsyncStorage.getItem('lastClub/Year/Gender') ved mount
Endre: Hvis lagret → vis kompakt visning (kun brukernavn + passord)
Legg til: "Bytt lag"-toggle som viser/skjuler dropdowns
Flytt: "Spilltype"-toggle (spiller/admin) bak innstillinger
```

---

## 4. Topplisten — Fra deprimerende til motiverende

### Nåværende problem
Ny spiller ser seg selv på bunn med 10 poeng vs. 520 poeng. Standard = all-time.

### Ny struktur

```
┌────────────────────────────────┐
│  Toppliste                     │
│                                │
│  [Denne uken ✓] [Måned] [Alt] │
│  [Mine venner ✓] [Alle]       │
│                                │
│  ┌──────────────────────┐     │
│  │ 📈 Du klatret 3       │     │
│  │    plasser denne uken! │     │
│  └──────────────────────┘     │
│                                │
│     🥈        🥇        🥉    │
│    Emma     Martin     Jonas   │
│    85 pts   120 pts    75 pts  │
│  ┌───────┐┌─────────┐┌──────┐ │
│  │       ││         ││      │ │
│  └───────┘└─────────┘└──────┘ │
│                                │
│  4. Oliver ⭐ (du)   70 pts   │
│     ↑ 3 plasser  │  15 til #3 │
│  5. Nora          55 pts      │
│  6. Liam          45 pts      │
│                                │
└────────────────────────────────┘
```

### Designvalg

**Standardvisning:**
- Periode = "Denne uken" (ikke all-time). Alle starter mer likt.
- Filter = "Mine venner" (ikke hele klubben) som standard.
- Viser klatreindikator: "↑3 plasser" med grønn pil.

**Motivasjonsmelding øverst:**
- Dynamisk kort som viser ukens progresjon.
- "Du klatret 3 plasser denne uken!" (grønt, positivt).
- "Bare 15 poeng til #3!" (motiverer til å trene mer).

**Brukerens rad:**
- Alltid uthevet (bakgrunnsfarge).
- Viser avstand til neste plass: "15 poeng til #3".
- Animert inngang (slide-in fra høyre).

### Fil som endres
`src/features/leaderboard/LeaderboardScreen.tsx` — Endre standardfiltre, legg til motivasjonskort.

---

## 5. Prestasjoner — Fra låst og fjern til nært og oppnåelig

### Nåværende problem
8/9 prestasjoner er låst. De fleste krever 30+ dager eller 50+ øvelser. Ingen mellomsteg.

### Nye prestasjoner (dag 1–7)

```
Eksisterende (beholdes):          NYE (legges til):
━━━━━━━━━━━━━━━━━━━━━━━         ━━━━━━━━━━━━━━━━━━━━━━━
✅ Første øvelse (10 pts)         ⭐ 3-dagers streak (15 pts)
🔒 7-dagers streak (25 pts)       ⭐ Prøvd 2 kategorier (10 pts)
🔒 30-dagers streak (100 pts)     ⭐ 10 poeng totalt (5 pts)
🔒 100 poeng (15 pts)             ⭐ Første favoritt (5 pts)
🔒 500 poeng (50 pts)             ⭐ Første utfordring sendt (10 pts)
🔒 1000 poeng (100 pts)           ⭐ 5 øvelser fullført (10 pts)
🔒 10 øvelser (20 pts)            ⭐ Første high five gitt (5 pts)
🔒 50 øvelser (75 pts)
🔒 Alle kategorier (50 pts)
```

### Designvalg

**"Neste opp"-indikator:**
- Den nærmeste oppnåelige prestasjonen vises øverst på profilsiden.
- Progresjonsbar med animasjon: "3/5 øvelser — nesten!"
- Pulserende glow-effekt når >80 % fullført ("Så nærme!").

**Opplåsingsseremoni:**
- Fullskjerm overlay med gull-bakgrunn.
- Prestasjonsikonet spinner inn og "låses opp" (hengelås → stjerne).
- Lyd: en tilfredsstillende "pling!"-effekt.
- Melding: "Ny prestasjon! 🌟 3-dagers streak!"
- Knapper: "Del med venner" / "Se alle prestasjoner".

**Grid-visning:**
- Opplåste: fargerik bakgrunn + ikon + sjekkmerke.
- Nesten opplåste (>50 %): farget kant med mini-progresjonsbar.
- Låste: grå, men med hint om hva som kreves ("? øvelser til").

### Filer som endres
- `src/features/profile/ProfileScreen.tsx` — Legg til "neste prestasjon"-kort.
- Supabase: Legg til nye prestasjonstyper i `achievement_definitions`.
- `src/lib/i18n/no.ts` og `en.ts` — Nye prestasjonstekster.

---

## 6. Streak-systemet — Fra straff til oppmuntring

### Nåværende problem
"Streak brutt" i rød tekst. Ingen recovery. Tap er permanent.

### Ny logikk

```
Streak-status:              Melding:
━━━━━━━━━━━━━              ━━━━━━━━━━━━━
Aktiv streak               "🔥 4 dager på rad! Fortsett!"
Streak i fare (19:00+)     "⚡ Husk å trene i dag for å beholde streaken!"
Streak pauset (shield)     "🛡️ Streak beskyttet! Du har 0 skjold igjen denne måneden."
Streak brutt (uten shield) "💪 Ny start! Fullfør 2 øvelser i dag for bonus-poeng!"
```

### Designvalg

**Streak Shield:**
- 1 gratis shield per måned (tilbakestilles 1. i hver måned).
- Automatisk brukt hvis spilleren ikke trener en dag OG har shield tilgjengelig.
- Visuelt: et skjold-ikon ved siden av streak-tallet.
- Melding dagen etter: "Ditt Streak Shield reddet streaken din! Du har 0 skjold igjen."

**"Streak i fare"-varsel:**
- Kl. 19:00 (konfigurerbar): pushvarsel + banner på hjemmeskjermen.
- Orange farge (advarsel, ikke rød/feil).
- "Du har trent hver dag i 4 dager. Ikke stopp nå!"

**Recovery etter brudd:**
- Aldri vis "Streak brutt" alene. Alltid med oppmuntring.
- "Ny start! Fullfør 2 øvelser i dag og få 10 bonus-poeng!"
- Bonus-poeng for recovery motiverer til å komme tilbake.

### Kodeendring
```
authStore.ts: Legg til streak_shield_count, streak_shield_used_date
HomeScreen.tsx: Betinget rendering for streak-tilstand
Supabase trigger: Sjekk shield før streak-nullstilling
pushNotifications: Planlegg "streak i fare"-varsel
```

---

## 7. Utfordringer (1v1) — Kjernen i sosial konkurranse

### Ny funksjon (bygger på eksisterende Challenge-typer i koden)

```
Opprett utfordring:             Mottaker ser:
┌────────────────────────┐     ┌────────────────────────┐
│ Utfordre en venn! 🤝   │     │ Oliver utfordrer deg!  │
│                        │     │                        │
│ Velg venn:             │     │ Øvelse: Sprintøvelser  │
│ [Emma L.           ▼] │     │ Poeng: 25 (+10 bonus)  │
│                        │     │ Tidsfrist: 24 timer    │
│ Velg øvelse:           │     │                        │
│ [Sprintøvelser     ▼] │     │ ┌──────┐  ┌──────────┐│
│                        │     │ │Avslå │  │ AKSEPTER!││
│ Bonuspoeng: +10        │     │ └──────┘  └──────────┘│
│ Tidsfrist: 24 timer    │     │                        │
│                        │     └────────────────────────┘
│ [SEND UTFORDRING →]    │
└────────────────────────┘

Resultat:
┌────────────────────────────────┐
│  🏆 UTFORDRING FULLFØRT!       │
│                                │
│  Oliver    VS    Emma          │
│   ✅ 2:30       ✅ 3:15        │
│                                │
│  Oliver vant! 🎉               │
│  +25 poeng + 10 bonus = 35!   │
│                                │
│  [Utfordre igjen] [Hjem]      │
└────────────────────────────────┘
```

### Designvalg

**Enkelhet:**
- Maks 2 steg: velg venn → velg øvelse → send.
- Forhåndsfylt med "anbefalt øvelse" for å redusere valg.
- 24-timers tidsfrist skaper urgency uten stress.

**Visuell "VS":**
- Stor VS-grafikk mellom to avatarer.
- Sanntidsoppdatering: sjekkmerke vises ved fullføring.
- Vinner-animasjon med konfetti og bonuspoeng.

**Tilgangspunkter:**
- Fra ferdig-skjermen: "Utfordre en venn med denne øvelsen".
- Fra øvelsesdetalj: "Utfordre en venn"-knapp.
- Fra venneliste: "Utfordre"-knapp ved hver venn.
- Fra pushvarsel: "Emma utfordret deg! Trykk for å svare."

---

## 8. Lyddesign — Den usynlige motivatoren

### Nye lydsignaler

| Hendelse | Lyd | Varighet | Fil |
|----------|-----|----------|-----|
| Poeng opptjent | Myntklirr (coin ding) | 0.5 sek | `coin.mp3` |
| Øvelse fullført | Kort jubeleffekt | 1.5 sek | `complete.mp3` |
| Prestasjon opplåst | Magisk pling + fanfare | 2 sek | `achievement.mp3` |
| Level Up | Triumf-fanfare | 3 sek | `levelup.mp3` |
| Streak milestone | Kraftig bass-boom + pling | 1 sek | `streak.mp3` |
| Utfordring mottatt | Notifikasjonspling | 0.5 sek | `challenge.mp3` |
| Utfordring vunnet | Seierfanfare | 2 sek | `victory.mp3` |

### Designvalg
- Alle lyder er korte og positive (ingen negative lyder).
- Lyden kan skrus av i innstillinger (respekter brukervalg).
- Implementeres med `expo-av` — lette MP3-filer (<50 KB hver).
- Lyder lastes asynkront ved app-start (ingen forsinkelse).

---

## Oppsummering: Hva endres, hva beholdes

### Beholdes (fungerer bra)
- Timer-opplevelsen under øvelser (SVG-ring, fargeendring, motivasjonsmeldinger)
- Konfetti-partikler på ferdig-skjermen (utvides, ikke erstattes)
- Øvelseslistens fargekoding og favoritt-animasjon
- Bottom-tab-navigasjon for spillere
- Podium-visningen på topplisten
- Profilsidens prestasjon-grid (utvides med flere prestasjoner)

### Endres (forbedres)
- Hjemmeskjermen: fra informasjonsdump → handlingsrettet
- Ferdig-skjermen: fra kort feiring → full belønningsopplevelse
- Innlogging: fra 5 felter → 2 felter (etter første gang)
- Topplisten: fra all-time → ukentlig, fra alle → venner
- Prestasjoner: fra 9 → 16, med lette mål for dag 1–7
- Streak: fra straff → oppmuntring

### Legges til (nytt)
- Vennesystem med aktivitetsfeed og high fives
- 1v1-utfordringer med bonuspoeng
- Daglig utfordring med 2x poeng
- Streak Shield (1 per måned)
- Innloggingsbonus
- Lydsignaler
- Level Up-animasjon
- Pushvarsler

---

*Se `UX-PLAN.md` for sprint-tidslinjen.*
*Se `MASKOT-STRATEGI.md` for maskot-konseptet.*
