# Pre-Launch Checklist — FotballTrening

## 1. Forutsetninger

### Kontoer
- [ ] Apple Developer Account ($99/år) — developer.apple.com
- [ ] Google Play Developer Account ($25 engangskostnad) — play.google.com/console
- [ ] EAS-konto (Expo) — expo.dev
- [ ] Sentry-konto (gratis tier) — sentry.io

### Sertifikater & nøkler
- [ ] iOS Distribution Certificate
- [ ] iOS Provisioning Profile (opprettes automatisk av EAS)
- [ ] Google Play Service Account Key (`play-store-key.json`)

---

## 2. Miljøvariabler (EAS Secrets)

Sett opp via `eas secret:create`:

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://pfmwlqrdkrmeqaigzzzn.supabase.co"
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "din-anon-key"
eas secret:create --name EXPO_PUBLIC_SENTRY_DSN --value "https://xxx@sentry.io/xxx"
```

---

## 3. Før første bygg

- [ ] Kjør `npm run validate` (typecheck + lint + test)
- [ ] Verifiser at alle 216+ tester passerer
- [ ] Oppdater `version` i `app.json` om nødvendig
- [ ] Verifiser `bundleIdentifier` (iOS) og `package` (Android) i `app.json`
- [ ] Oppdater `eas.json` submit-seksjon med faktiske Apple/Google-verdier

---

## 4. Intern beta (TestFlight / Internal Testing)

### Bygg
```bash
npm run build:preview
```

### iOS (TestFlight)
- [ ] Opprett appen i App Store Connect
- [ ] Last opp bygget: `npm run submit:ios`
- [ ] Legg til interne testere i TestFlight
- [ ] Vent på App Store-godkjenning av beta (vanligvis < 24 timer)

### Android (Intern testing)
- [ ] Opprett appen i Google Play Console
- [ ] Last opp bygget: `npm run submit:android`
- [ ] Legg til testere via e-postliste
- [ ] Publiser til intern testspor

### Test med beta-testere
- [ ] Test innlogging (spiller + admin)
- [ ] Test øvelsesgjennomføring
- [ ] Test toppliste
- [ ] Test oppnåelser
- [ ] Test streak-funksjon
- [ ] Test admin-panel (dashboard, spilleradmin, øvelsesadmin)
- [ ] Test øvelsesbutikk
- [ ] Test mørkt tema
- [ ] Test norsk og engelsk
- [ ] Test på ulike enheter og skjermstørrelser

---

## 5. App Store-metadata

### iOS App Store Connect
- [ ] Appnavn: "FotballTrening"
- [ ] Undertittel: "Treningsapp for fotballklubber"
- [ ] Beskrivelse (se `docs/app-store-metadata.md`)
- [ ] Nøkkelord (se `docs/app-store-metadata.md`)
- [ ] Kategori: Sport
- [ ] Aldersgrense: 4+
- [ ] Privatlivspolicy URL: https://fotballtrening.app/privacy
- [ ] Support URL: https://fotballtrening.app/support
- [ ] Skjermbilder (6 stk for iPhone 6.7", 6.1", iPad)
- [ ] App-ikon (1024x1024, uten alfa)

### Google Play Console
- [ ] Appnavn: "FotballTrening — Treningsapp for fotballklubber"
- [ ] Kort beskrivelse (80 tegn)
- [ ] Full beskrivelse
- [ ] Innholdsgradering: Alle (PEGI 3)
- [ ] Personvernerklæring URL
- [ ] Skjermbilder (min. 2 stk, 1080x1920)
- [ ] Feature graphic (1024x500)
- [ ] App-ikon (512x512)

---

## 6. Juridiske dokumenter

- [ ] Personvernerklæring publisert (se `docs/privacy-policy.md`)
- [ ] Bruksvilkår publisert (se `docs/terms-of-service.md`)
- [ ] URL-er tilgjengelige (GitHub Pages, Vercel, eller lignende)

---

## 7. Produksjonsbygg

```bash
# Kjør full validering
npm run validate

# Bygg for begge plattformer
npm run build:production

# Send til butikkene
npm run submit:ios
npm run submit:android
```

---

## 8. Etter lansering

- [ ] Overvåk Sentry for krasj
- [ ] Sjekk App Store-anmeldelser
- [ ] Sjekk Google Play-anmeldelser
- [ ] Overvåk Supabase-bruk (database, auth, storage)
- [ ] Planlegg v1.1 basert på bruker-feedback
