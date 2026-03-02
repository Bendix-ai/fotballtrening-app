# MASKOT-STRATEGI — Interaktiv maskot for FotballTrening-appen

> Oppskrift for gradvis introduksjon av en maskot som fungerer som støttespiller, motivator og guide for barn 8–13 år.

---

## 1. Maskot-konsept

### Karakter: "Kicky"
- **Type:** En animert fotball med personlighet (øyne, munn, armer/bein).
- **Hvorfor en fotball?** Umiddelbart gjenkjennelig. Krever ingen forklaring. Fungerer på tvers av kjønn og alder.
- **Personlighet:** Entusiastisk, støttende, litt tullete. Aldri sarkastisk eller nedlatende. Feirer barnet, aldri seg selv.
- **Visuell stil:** Enkel 2D-illustrasjon med store øyne og tydelige uttrykk. Maks 4 farger. Gjenkjennelig i 32x32px (som ikon) og 200x200px (som fullskjerm).

### Uttrykk (6 grunntilstander)

| Tilstand | Uttrykk | Brukes når |
|----------|---------|------------|
| **Glad** | 😊 Stort smil, åpne øyne | Standard, hilsen, oppmuntring |
| **Imponert** | 🤩 Store øyne, åpen munn | Prestasjon opplåst, level up |
| **Heier** | 🙌 Armer i været, jubel | Øvelse fullført, streak-milestone |
| **Tenker** | 🤔 Finger på haken | Tips, veiledning, velg øvelse |
| **Trener** | 💪 Fleksende arm | Under øvelse, motivasjon |
| **Bekymret** | 😟 Lite smil, ser opp | Streak i fare, lenge siden sist |

---

## 2. Gradvis utrulling (4 faser)

### Fase 1: Stille introduksjon (Uke 1)
> Kicky dukker opp som en statisk illustrasjon. Ingen interaksjon ennå.

**Hvor:**
- **Onboarding:** Kicky er med på alle 3 onboarding-sider som en guide.
  - Side 1: Kicky vinker. "Hei! Jeg er Kicky. La meg vise deg rundt!"
  - Side 2: Kicky peker på en øvelse. "Her finner du treningsøvelser!"
  - Side 3: Kicky holder en pokal. "Konkurrer mot vennene dine!"
- **Tomme tilstander:** Kicky vises når det ikke er data å vise.
  - Tom øvelsesliste: Kicky med lupe. "Ingen øvelser her ennå!"
  - Tom venneliste: Kicky vinker. "Legg til en venn for å komme i gang!"
- **Lasteskjermer:** Kicky jogger mens appen laster.

**Implementering:**
- 6 statiske SVG-illustrasjoner (én per tilstand).
- Importeres som React Native SVG-komponenter.
- Ingen animasjon, ingen logikk. Kun visuelt.

**Innsats:** Lav (illustrasjoner + enkel komponent).

---

### Fase 2: Kontekstuelle meldinger (Uke 2–3)
> Kicky "snakker" med spilleren gjennom korte meldinger basert på kontekst.

**Hvor:**

**Hjemmeskjermen — Dynamisk hilsen:**
```
Morgen (06–12):     Kicky gjesper + "God morgen! Klar for trening?"
Ettermiddag (12–17): Kicky smiler + "Perfekt tid for en økt!"
Kveld (17–21):       Kicky med lommelykt + "Kveldstrening? Du er tøff!"
Natt (21–06):        Kicky sover + "Sov godt! Trening venter i morgen."
```

**Etter øvelse — Kontekstuell tilbakemelding:**
```
Lett øvelse:    Kicky smiler + "Fin oppvarming! Klar for noe tøffere?"
Medium øvelse:  Kicky heier + "Bra jobba! Du blir sterkere!"
Hard øvelse:    Kicky imponert + "WOW! Den var vanskelig! Respekt!"
Rask fullføring: Kicky overrasket + "Det gikk fort! Du er i form!"
```

**Streak-meldinger:**
```
Dag 3:  Kicky heier + "3 dager! Du er i gang!"
Dag 7:  Kicky imponert + "En hel uke! Legendeee!"
Dag 14: Kicky gråter av glede + "To uker?! Du er helt rå!"
Dag 30: Kicky med gullhjelm + "30 DAGER. Du er en maskin!"
```

**Implementering:**
- Ny komponent: `<MascotMessage mood="happy" message="..." />`
- Mood bestemmer illustrasjon, melding er dynamisk tekst.
- Meldingslogikk i en egen hook: `useMascotMessage(context)`.
- Kontekst: tid på døgnet, øvelsestype, streak-lengde, etc.

**Innsats:** Lav–medium (komponent + hook + meldingslogikk).

---

### Fase 3: Mikro-animasjoner (Uke 4–5)
> Kicky begynner å bevege seg. Små, gjenbrukbare animasjoner.

**Animasjoner (React Native Reanimated):**

| Animasjon | Varighet | Trigger |
|-----------|----------|---------|
| **Vinke** | 1 sek | Åpne app, ny dag |
| **Hoppe** | 0.5 sek | Poeng opptjent |
| **Spinne** | 1 sek | Prestasjon opplåst |
| **Danse** | 2 sek | Level Up |
| **Nikke** | 0.5 sek | Fullført øvelse |
| **Riste på hodet** | 0.5 sek | Avbryter øvelse (snilt) |

**Implementering:**
- Bruk `Lottie` (react-native-lottie) for smidige animasjoner.
- Alternativ: React Native Reanimated med SVG-transformasjoner.
- Én animasjonsfil per bevegelse (~10–30 KB per Lottie-fil).
- Trigger via context: `<MascotAnimated animation="jump" />`

**Plassering:**
- Hjemmeskjermen: liten Kicky (48x48) i hjørnet av "Dagens trening"-kortet.
- Ferdig-skjermen: stor Kicky (120x120) over konfettien.
- Timer-skjermen: liten Kicky (32x32) under timeren som heier.
- Topplisten: liten Kicky ved brukerens rad ("Du er her!").

**Innsats:** Medium (Lottie-filer + animasjonskomponent).

---

### Fase 4: Interaktiv maskot (Uke 6+)
> Kicky blir en aktiv del av opplevelsen. Spilleren kan "snakke" med Kicky.

**Funksjoner:**

**4a. Kicky anbefaler øvelser:**
```
┌────────────────────────────────┐
│  💬 Kicky sier:                │
│                                │
│  "Du har ikke trent styrke     │
│   på 3 dager. Prøv denne!"    │
│                                │
│  ┌──────────────────────────┐  │
│  │ Styrke: Knebøy  25 pts  │  │
│  │ [START →]                │  │
│  └──────────────────────────┘  │
│                                │
│  [Vis meg noe annet]           │
└────────────────────────────────┘
```

- Basert på brukerens historikk: anbefaler kategorier de har ignorert.
- "Vis meg noe annet" gir en ny anbefaling (maks 3 forsøk).

**4b. Kicky som treningscoach:**
Under øvelsesgjennomføring kan Kicky gi tips mellom instruksjonssteg:
```
Steg 1: "Stå med bena i skulderbredde"
Kicky: "Husk: rett rygg! 🏋️"
Steg 2: "Bøy knærne sakte ned"
Kicky: "Fint! Ned... og opp igjen!"
```

- Kort, oppmuntrende tekst mellom steg.
- Maksimalt 5 ord per Kicky-melding (ingen vegg av tekst).

**4c. Kicky i pushvarsler:**
```
15:00: "🏃 Kicky minner deg: Dagens utfordring venter!"
19:00: "🔥 Kicky: Streaken din er i fare! Rekker du en øvelse?"
```

- Kicky som avsender gjør varselet mer personlig.
- Barn responderer bedre på en "venn" enn en "app".

**4d. Kicky-reaksjoner på topplisten:**
- Klatret plasser: Kicky danser ved raden din.
- Falt plasser: Kicky ser bekymret ut, men oppmuntrer.
- #1: Kicky har gullhjelm og jubler.

**Innsats:** Medium–høy (anbefalingslogikk + kobling til pushvarsler).

---

## 3. Teknisk arkitektur

### Komponentstruktur

```
src/components/
  Mascot/
    MascotImage.tsx        — Statisk SVG-illustrasjon (fase 1)
    MascotMessage.tsx      — Illustrasjon + snakkeboble (fase 2)
    MascotAnimated.tsx     — Lottie/Reanimated-animasjon (fase 3)
    MascotRecommend.tsx    — Anbefaling med CTA (fase 4)

src/hooks/
  useMascotMessage.ts      — Kontekstuell meldingslogikk
  useMascotRecommend.ts    — Anbefalingslogikk basert på historikk

src/assets/mascot/
  kicky-happy.svg
  kicky-impressed.svg
  kicky-cheering.svg
  kicky-thinking.svg
  kicky-training.svg
  kicky-worried.svg
  animations/
    wave.json              — Lottie-animasjon
    jump.json
    spin.json
    dance.json
    nod.json
    shake.json
```

### MascotMessage-komponent (fase 2)

```typescript
// Konseptuell API
<MascotMessage
  mood="happy"              // Bestemmer illustrasjon
  message="God morgen!"     // Tekst i snakkeboble
  size="small"              // small (48px) | medium (80px) | large (120px)
  onDismiss={() => {}}      // Valgfri: fjern meldingen
/>
```

### useMascotMessage hook (fase 2)

```typescript
// Konseptuell logikk
function useMascotMessage(context: MascotContext): MascotState {
  // Kontekstuelle regler (prioritert rekkefølge):
  // 1. Streak i fare → bekymret + "Rekker du en øvelse?"
  // 2. Ny prestasjon tilgjengelig → imponert + "Du er nesten der!"
  // 3. Lang tid siden sist → bekymret + "Vi savner deg!"
  // 4. Tid på døgnet → glad + kontekstuell hilsen
  // 5. Standard → glad + tilfeldig oppmuntring
}
```

---

## 4. Innholdsstrategi for Kicky

### Tone of voice
- **Kort:** Maks 10 ord per melding (helst 5–7).
- **Positiv:** Aldri kritisere, aldri skuffe.
- **Personlig:** Bruk spillerens navn: "Bra, Oliver!"
- **Energisk:** Utropstegn og emojier, men ikke overdrevet.
- **Aldersriktig:** Ingen slang som er "for ung" (cringe) eller for voksen.

### Meldingsbank (eksempler)

**Hilsener (20+ varianter, roterer):**
```
"Hei {name}! Klar for å trene?"
"Der er du, {name}! La oss kjøre!"
"Velkommen tilbake, {name}! 💪"
"Yo {name}! Treningstid!"
"{name}! Bra at du er her!"
```

**Etter øvelse (20+ varianter):**
```
"Bra jobba, {name}!"
"Du er en maskin! 🏋️"
"Sterk innsats!"
"Wow, det var imponerende!"
"{name}, du blir bedre og bedre!"
```

**Streak-oppmuntring:**
```
3 dager: "Tre på rad! Du er i gang!"
5 dager: "FEM dager! Fantastisk!"
7 dager: "En hel uke! Du er en legende!"
14 dager: "To uker. Herregud. Respekt!"
21 dager: "Tre uker! Du kan ikke stoppes!"
30 dager: "EN MÅNED! 🏆 Du er best!"
```

**Recovery (etter brudd):**
```
1 dag borte: "Hei igjen! Savna deg i går. En øvelse?"
3 dager borte: "Kicky savner deg! Kom tilbake?"
7 dager borte: "Heeei {name}! Husker du meg? 😅"
```

### Viktige regler
1. **Aldri gjenta samme melding to ganger på rad.** Roter fra banken.
2. **Aldri vær negativ.** Selv ved streak-brudd: oppmuntre, ikke bebreide.
3. **Aldri blokker brukerflyt.** Kicky er en kommentar, ikke en popup.
4. **Respekter innstillinger.** "Skru av Kicky" i innstillinger for de som ikke vil.

---

## 5. Utrullingsplan

| Fase | Tidsramme | Avhengigheter | Testbart |
|------|-----------|---------------|----------|
| **1: Statisk** | Uke 1 | SVG-illustrasjoner | Ja, visuell QA |
| **2: Meldinger** | Uke 2–3 | Fase 1 + meldingsbank + hook | Ja, unit test + visuell |
| **3: Animasjoner** | Uke 4–5 | Fase 2 + Lottie-filer | Ja, visuell QA |
| **4: Interaktiv** | Uke 6+ | Fase 3 + anbefalingslogikk | Ja, unit test + E2E |

### Fase 1 — Leveranser
- [ ] 6 SVG-illustrasjoner av Kicky
- [ ] `MascotImage`-komponent
- [ ] Integrert i onboarding, tomme tilstander, lasteskjermer

### Fase 2 — Leveranser
- [ ] `MascotMessage`-komponent med snakkeboble
- [ ] `useMascotMessage` hook
- [ ] 60+ meldinger i meldingsbanken (no + en)
- [ ] Integrert i hjemmeskjerm, ferdig-skjerm, streak-visning

### Fase 3 — Leveranser
- [ ] 6 Lottie-animasjonsfiler
- [ ] `MascotAnimated`-komponent
- [ ] Trigger-integrasjon (poeng, prestasjoner, level up)

### Fase 4 — Leveranser
- [ ] `MascotRecommend`-komponent
- [ ] `useMascotRecommend` hook
- [ ] Integrert i hjemmeskjerm, pushvarsler, toppliste

---

## 6. Målbare effekter

| Metrikk | Uten maskot | Med maskot (mål) |
|---------|-------------|-------------------|
| Tid på hjemmeskjerm | ~5 sek | ~10 sek (leser Kicky) |
| Klikk på daglig utfordring | ~20 % | ~35 % (Kicky peker) |
| Pushvarsel åpningsrate | ~10 % | ~25 % (Kicky som avsender) |
| 7-dagers retention | ~30 % | ~45 % (emosjonell tilknytning) |
| Streak-recovery etter brudd | ~10 % | ~30 % (Kicky oppmuntrer) |

---

## 7. Risiko og mitigering

| Risiko | Sannsynlighet | Mitigering |
|--------|---------------|------------|
| Kicky oppfattes som barnslig (12–13-åringer) | Medium | Gjør Kicky valgfri i innstillinger. Hold tonen kul, ikke babyaktig. |
| Repetitive meldinger irriterer | Høy | 60+ meldinger + rotasjonslogikk + aldri gjenta. |
| Animasjoner påvirker ytelse | Lav | Lottie er GPU-akselerert. Test på lavspekk-enheter. |
| Illustrasjonsstil treffer ikke | Medium | Brukertesting med 3–5 barn FØR produksjon. |

---

*Kicky er ikke bare en maskot — det er en emosjonell forbindelse mellom barnet og appen. Når Oliver åpner appen og Kicky vinker og sier "Hei Oliver! Klar for å trene?", føles det som å møte en venn. Det er den følelsen som gjør at han kommer tilbake i morgen.*
