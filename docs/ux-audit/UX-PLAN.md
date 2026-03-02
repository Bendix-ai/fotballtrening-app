# UX-PLAN — 30-dagers redesign og gamification-plan

> Mål: Gjøre FotballTrening-appen til en app barn på 8–13 år **vil** åpne hver dag.
> Prinsipp: Forenkling, umiddelbar belønning, sosial tilhørighet, og daglig grunn til å komme tilbake.

---

## De 10 største UX-utfordringene

### 1. Hjemmeskjermen gir ingen retning
- **Hvor:** HomeScreen
- **Alvorlighetsgrad:** Kritisk
- **Beskrivelse:** Skjermen viser 7+ informasjonskort (streak, nivå, toppliste, daglig mål, utfordring, nylige øvelser, aktivitetsstrøm). En 10-åring vet ikke hva de skal gjøre først. Tomme kort på dag 1 (0 poeng, 0 streak, 8/9 prestasjoner låst) skaper en "tom butikk"-følelse.
- **Anbefalt løsning:** Redesign til én tydelig handling: "Dagens trening" som en stor, animert knapp øverst. Vis kun 2–3 motivasjonskort under. Skjul avansert info bak en "Se mer"-seksjon. På dag 1: vis en velkomstmelding med guidet første øvelse i stedet for tomme statistikker.

### 2. Ingen daglig grunn til å åpne appen
- **Hvor:** Hele appen (manglende funksjon)
- **Alvorlighetsgrad:** Kritisk
- **Beskrivelse:** Det finnes ingen pushvarsler, ingen daglige utfordringer med tidsfrist, ingen innloggingsbelønning, og ingen sosiale hendelser. Etter at barnet lukker appen, er det ingenting som trekker dem tilbake.
- **Anbefalt løsning:** Innfør tre daglige kroker: (1) Daglig utfordring med 2x poeng og 24-timers tidsfrist, (2) Innloggingsbonus (5 poeng bare for å åpne), (3) "Vennen din trener nå!"-varsel. Vis daglig utfordring som førsteprioritert kort på hjemmeskjermen.

### 3. Streak-brudd uten recovery er demotiverende
- **Hvor:** Streak-systemet (authStore, HomeScreen, ProfileScreen)
- **Alvorlighetsgrad:** Kritisk
- **Beskrivelse:** Én glemt dag = streaken nullstilles med meldingen "Streak brutt" (rød tekst). For et barn er dette som å tape hele spillet. Det finnes ingen mekanisme for å redde streaken eller komme tilbake.
- **Anbefalt løsning:** Innfør "Streak Shield" — en gratis redning per måned som beskytter streaken i 1 dag. Vis oppmuntrende melding: "Du glemte i går, men du kan ta det igjen! Fullfør 2 øvelser i dag for å beholde streaken." Endre "Streak brutt" til "Streak på pause — kom tilbake i dag!".

### 4. Topplisten er demotiverende for nye spillere
- **Hvor:** LeaderboardScreen
- **Alvorlighetsgrad:** Høy
- **Beskrivelse:** Ny spiller med 10 poeng ser andre med 500+ poeng. Gapet er uoverkommelig. Standardvisning er "all time" som forsterker problemet.
- **Anbefalt løsning:** Standardvisning = "Denne uken" (alle starter likt hver mandag). Vis "Din progresjon" øverst: "Du klatret 3 plasser denne uken!". Legg til "Venner"-filter som kun viser spillere barnet kjenner. Vis motivasjonsmelding: "Bare 15 poeng til neste plass!".

### 5. Ingen venner eller sosiale funksjoner
- **Hvor:** Hele appen (manglende funksjon)
- **Alvorlighetsgrad:** Høy
- **Beskrivelse:** Utfordrings-systemet finnes i koden (typer og ruter), men er ikke implementert i UI. Barn kan ikke legge til venner, utfordre hverandre, eller se hverandres aktivitet. Appen føles som en ensomøvelse.
- **Anbefalt løsning:** Implementer vennesystem med: (1) Legg til venn via brukernavn, (2) Se vennens aktivitet i en feed, (3) Utfordre vennen til en spesifikk øvelse, (4) Gi "high five" (emoji-reaksjon) på vennens prestasjoner.

### 6. Feiringen etter øvelse er for kort og stille
- **Hvor:** ExerciseCompleteScreen
- **Alvorlighetsgrad:** Høy
- **Beskrivelse:** Konfetti og "+10 poeng" vises i ~2 sekunder uten lyd. Deretter kun "Fortsett trening". Ingen sammenligning med venner, ingen progresjon mot nivå, ingen kontekstuell melding. For en 10-åring er belønningen utilstrekkelig.
- **Anbefalt løsning:** Utvid feiringsskjermen: (1) Legg til lydsignal (myntklirr + jubeleffekt), (2) Vis progresjon: "Du er nå 40/100 poeng mot Sølv!", (3) Vis sosial sammenligning: "Du slo Emil med 5 poeng i dag!", (4) Gi valg: "Tren mer" / "Se topplisten" / "Utfordre en venn".

### 7. Innlogging føles som et skjema
- **Hvor:** LoginScreen
- **Alvorlighetsgrad:** Høy
- **Beskrivelse:** Tre nedtrekkslister (klubb, årgang, kjønn) + brukernavn + passord er fem steg. For en 8-åring er dette et byråkratisk hinder. Terminologi som "årgang" og "kjønn" er voksenspråk.
- **Anbefalt løsning:** Husk klubb/årgang/kjønn etter første innlogging (lagre i AsyncStorage). Etter første gang: vis kun brukernavn og passord. Bruk barnespråk: "Ditt lag" i stedet for "Årgang". Vurder QR-kode-innlogging: treneren viser en QR-kode, barnet scanner den.

### 8. Øvelsesdetaljer er teksttunge
- **Hvor:** ExerciseDetailScreen
- **Alvorlighetsgrad:** Medium
- **Beskrivelse:** Detaljskjermen har beskrivelse, utstyrsliste, steg-for-steg-instruksjoner og relaterte øvelser. "Start"-knappen er gjemt nederst. Et barn vil gjøre, ikke lese.
- **Anbefalt løsning:** Flytt "Start"-knappen til en fast posisjon øverst (sticky header). Vis kun 2–3 steg som standard, resten bak "Vis alle steg". Erstatt tekst med ikoner der mulig. Prioriter video/animasjon over tekst.

### 9. Prestasjoner føles uoppnåelige
- **Hvor:** ProfileScreen (Achievement-grid)
- **Alvorlighetsgrad:** Medium
- **Beskrivelse:** 8 av 9 prestasjoner er låst med hengelås. Mange krever 50+ øvelser eller 30 dagers streak. For en ny spiller føles dette som en uoppnåelig fjelltopp. Det finnes ingen mellomsteg.
- **Anbefalt løsning:** Legg til flere "lette" prestasjoner for dag 1–7: "Første øvelse!", "3 dager på rad!", "Prøvd 2 kategorier!". Vis tydelig progresjon: "Du er 3/10 øvelser unna denne!". Animer progresjonsbar når den øker. Vis "Neste oppnåelse" prominent på hjemmeskjermen.

### 10. Ingen nivå/rangering-system med visuell progresjon
- **Hvor:** Hele appen (delvis implementert)
- **Alvorlighetsgrad:** Medium
- **Beskrivelse:** Nivåsystemet finnes i kode (Bronze/Sølv/Gull/Diamant), men er lite synlig og har uklar progresjon. Barn forstår poeng dårlig — de forstår rangeringer ("Jeg er Gull!").
- **Anbefalt løsning:** Gjør rangering til en sentral identitet. Vis rangering-badge ved navn overalt (toppliste, profil, venner). Animer oppgraderinger: fullskjerm "LEVEL UP! Du er nå Sølv!" med spesialeffekt. Vis progresjonsbar mot neste rangering på hjemmeskjermen.

---

## 30-dagers sprint-plan

### Uke 1: Forenkling og "Day 1 Magic" (Sprint 1)

> **Tema:** Fjern friksjon, gjør dag 1 uforglemmelig.

| Dag | Oppgave | Mål |
|-----|---------|-----|
| 1–2 | **Redesign hjemmeskjermen** | Én stor "Start trening"-knapp øverst. Maks 3 motivasjonskort under. Skjul resten bak "Se mer". |
| 2–3 | **Forenkle innlogging** | Lagre klubb/årgang/kjønn i AsyncStorage. Ved gjentatt innlogging: vis kun brukernavn + passord. |
| 3–4 | **Ny velkomst for dag 1** | Erstatt tomme statistikker med guidet "Din første øvelse" — direkte sti fra hjem til en enkel øvelse. |
| 4–5 | **Sticky "Start"-knapp** | Flytt Start-knapp til sticky header på øvelsesdetalj. Vis video-thumbnail fremfor tekst. |

**Leveranse uke 1:** En enklere app der Oliver vet nøyaktig hva han skal gjøre fra sekund én.

---

### Uke 2: Belønning og feiring (Sprint 2)

> **Tema:** Gjør hver treningsøkt til en opplevelse.

| Dag | Oppgave | Mål |
|-----|---------|-----|
| 6–7 | **Utvid ferdig-skjermen** | Lengre feiring (3–4 sek), lydsignaler (myntklirr, jubel), valgmeny etter ferdig. |
| 8–9 | **Synlig nivå-progresjon** | Vis "40/100 poeng mot Sølv" på hjem og etter øvelse. Animer progresjonsbar. |
| 9–10 | **Level Up-animasjon** | Fullskjerm "LEVEL UP!"-feiring med spesialeffekter og lyd ved rangeringsopprykk. |
| 10 | **Nye "lette" prestasjoner** | Legg til 5 prestasjoner for dag 1–7: "Første øvelse", "3-dagers streak", "Prøvd 2 kategorier", "10 poeng", "Første favoritt". |

**Leveranse uke 2:** Hver treningsøkt gir en merkbar belønning. Nivåsystemet er synlig og motiverende.

---

### Uke 3: Sosial og konkurranse (Sprint 3)

> **Tema:** Gjør appen til en lagopplevelse.

| Dag | Oppgave | Mål |
|-----|---------|-----|
| 11–12 | **Vennesystem (MVP)** | Legg til venn via brukernavn. Se venneliste på profil. |
| 13–14 | **Utfordring (1v1)** | Velg en venn → velg en øvelse → send utfordring. Mottaker godtar/avslår. Vinner får bonuspoeng. |
| 15–16 | **Venneaktivitets-feed** | "Emma fullførte Sprintøvelser!", "Jonas slo sin streak-rekord!" på hjem. Mulighet for "High five" (emoji-reaksjon). |
| 16–17 | **Toppliste: Venner-filter** | "Vis kun mine venner" som standardfilter. Standardperiode = denne uken. Vis "Du klatret X plasser". |

**Leveranse uke 3:** Oliver kan konkurrere mot vennene sine, se hva de gjør, og utfordre dem.

---

### Uke 4: Daglig engasjement og retention (Sprint 4)

> **Tema:** Gi barnet en grunn til å åpne appen hver dag.

| Dag | Oppgave | Mål |
|-----|---------|-----|
| 18–19 | **Daglig utfordring (2x poeng)** | Én automatisk generert utfordring per dag med doble poeng og 24-timers tidsfrist. Fremhevet kort på hjemmeskjerm. |
| 20–21 | **Streak Shield** | 1 gratis streak-beskyttelse per måned. "Pause streak"-knapp. Oppmuntrende melding ved brudd i stedet for rød "brutt". |
| 22–23 | **Innloggingsbonus** | +5 poeng for å åpne appen daglig. Innloggings-streak med egne milepæler (3, 7, 14 dager). |
| 24–25 | **Pushvarsler (grunnleggende)** | "Hei Oliver, dagens utfordring venter!" kl. 15:00. "Emma nettopp fullførte en øvelse!" ved venneaktivitet. |

**Leveranse uke 4:** Oliver har tre grunner til å åpne appen: daglig utfordring, innloggingsbonus, og venneaktivitet.

---

### Uke 5 (bonusdager): Polish og testing

| Dag | Oppgave | Mål |
|-----|---------|-----|
| 26–27 | **Lydsignaler** | Implementer `expo-av` for 4 lyder: poeng-klirr, jubel, level-up, streak-milestone. |
| 28 | **Brukertest med 3–5 barn** | La barn i målgruppen teste appen. Observer og noter friksjon. |
| 29–30 | **Iterasjon basert på test** | Fiks topp-3 problemer fra brukertesten. |

---

## Prioriteringsmatrise

| Tiltak | Engasjements-effekt | Utviklingsinnsats | Prioritet |
|--------|---------------------|-------------------|-----------|
| Forenklet hjemmeskjerm | Svært høy | Lav | 🔴 Uke 1 |
| Husket innlogging | Høy | Svært lav | 🔴 Uke 1 |
| Dag 1 velkomstflyt | Svært høy | Lav | 🔴 Uke 1 |
| Utvidet feiring + lyd | Høy | Lav–medium | 🟠 Uke 2 |
| Synlig nivå-progresjon | Høy | Lav | 🟠 Uke 2 |
| Nye lette prestasjoner | Høy | Svært lav | 🟠 Uke 2 |
| Vennesystem | Svært høy | Medium–høy | 🟡 Uke 3 |
| 1v1-utfordringer | Svært høy | Medium | 🟡 Uke 3 |
| Daglig utfordring (2x) | Svært høy | Lav | 🔴 Uke 4 |
| Streak Shield | Høy | Lav | 🟡 Uke 4 |
| Pushvarsler | Svært høy | Medium | 🟡 Uke 4 |
| Level Up-animasjon | Medium | Lav | 🟠 Uke 2 |
| Vennefilter toppliste | Medium | Lav | 🟡 Uke 3 |
| Innloggingsbonus | Medium | Svært lav | 🟡 Uke 4 |

---

## Suksesskriterier

| Metrikk | Nå | Mål etter 30 dager |
|---------|-----|---------------------|
| Daglig aktive brukere (DAU) | Ukjent (antatt lav) | +50 % |
| Gjennomsnittlige øvelser per økt | ~1–2 | 3+ |
| 7-dagers retention | Antatt <30 % | >50 % |
| Gjennomsnittlig streak-lengde | 1–2 dager | 5+ dager |
| Brukere som utfordrer en venn | 0 % | >30 % |
| Tid til første øvelse (dag 1) | 3–5 min | <90 sek |

---

*Se `UX-LOGG.md` for detaljerte skisser av de viktigste skjermendringene.*
*Se `MASKOT-STRATEGI.md` for strategi om interaktiv maskot.*
