# FotballTrening

Treningsapp for fotballag. Spillere logger treningsaktiviteter, trenere administrerer lag og ser statistikk.

**Teknologi:** React Native (Expo), TypeScript, Supabase, NativeWind (Tailwind CSS)

## Kom i gang

```bash
npm install
npx expo start
```

Kjør på fysisk enhet med Expo Go, eller bruk simulator:
```bash
npx expo start --ios
```

## Prosjektstruktur

```
src/
  components/    UI-komponenter (Button, Card, Input, etc.)
  features/      Skjermbilder gruppert etter funksjon
  hooks/         Custom React hooks
  services/      API-kall og backend-logikk (Supabase)
  stores/        Global state (Zustand)
  navigation/    React Navigation-oppsett
  types/         TypeScript-typer
  utils/         Hjelpefunksjoner
```

## Utviklingsflyt: fra kode til TestFlight

### 1. Gjør endringer

Lag endringer i koden. Test lokalt med `npx expo start`.

### 2. Valider

Kjør alle sjekker lokalt:

```bash
npm run validate
```

Dette kjører TypeScript-sjekk, linting og tester i ett.

### 3. Push til GitHub

```bash
git add <filer>
git commit -m "beskrivelse av endring"
git push
```

GitHub Actions kjører automatisk tester ved push til `main`.

### 4. Bygg ny versjon

```bash
npm run build:ios
```

EAS bygger appen i skyen. Byggetid er ca. 10-15 minutter. Build-nummeret inkrementeres automatisk.

### 5. Send til TestFlight

```bash
npm run submit:ios
```

Appen lastes opp til App Store Connect. Etter noen minutters prosessering er den tilgjengelig for testere i TestFlight.

**Automatisk:** Når du pusher til `main`, bygger GitHub Actions automatisk og sender til TestFlight. Du trenger kun steg 4-5 manuelt hvis du vil bygge fra din egen maskin.

## OTA-oppdateringer (uten nytt bygg)

For rene JavaScript/TypeScript-endringer (ingen nye native moduler) kan du pushe oppdateringer direkte til brukerne uten å gå via TestFlight:

```bash
npx eas-cli update --branch production --message "beskrivelse"
```

Brukerne får oppdateringen neste gang de åpner appen. Dette er mye raskere enn et fullt bygg.

**Når trenger du nytt bygg i stedet?**
- Ny native pakke installert (f.eks. kamera, push-notifikasjoner)
- Endringer i `app.json` (versjon, permissions, etc.)
- Oppgradering av Expo SDK

## Nyttige kommandoer

| Kommando | Beskrivelse |
|----------|-------------|
| `npx expo start` | Start utviklingsserver |
| `npm run validate` | Kjør typecheck + lint + tester |
| `npm test` | Kjør tester |
| `npm run test:watch` | Kjør tester i watch-modus |
| `npm run test:coverage` | Kjør tester med dekningsrapport |
| `npm run lint` | Kjør ESLint |
| `npm run typecheck` | Kjør TypeScript-sjekk |
| `npm run build:ios` | Bygg iOS-produksjonsversjon (EAS) |
| `npm run submit:ios` | Send bygg til TestFlight |
| `npx eas-cli update --branch production` | Push OTA-oppdatering |

## Konfigurasjon

| Fil | Innhold |
|-----|---------|
| `app.json` | Expo-konfigurasjon (versjon, bundle ID, permissions) |
| `eas.json` | EAS Build- og Submit-profiler |
| `.env` | Miljøvariabler (Supabase URL/nøkkel) |
| `tsconfig.json` | TypeScript-konfigurasjon |
| `tailwind.config.js` | Tailwind/NativeWind-tema |
