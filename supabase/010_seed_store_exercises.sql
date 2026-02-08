-- ============================================================
-- FotballTrening App - Seed store_exercises with 35 real exercises
-- Run AFTER 009_store_exercises_equipment.sql
--
-- Sletter eksisterende store-data og setter inn reelle øvelser.
-- ============================================================

-- Clear existing store data
DELETE FROM public.store_downloads;
DELETE FROM public.store_reviews;
DELETE FROM public.store_exercises;

-- ============================================================
-- WARMUP — 7 øvelser
-- ============================================================

INSERT INTO public.store_exercises (title, description, instructions, category, difficulty, duration_seconds, points, rating, downloads, author, is_featured, equipment) VALUES

-- 1. Dynamisk oppvarming
(
    'Dynamisk oppvarming',
    'Få kroppen klar for trening med dynamiske bevegelser som øker pulsen og mobiliserer leddene. Ingen utstyr nødvendig.',
    'Start med lett jogging på stedet i 30 sekunder. Gjør 10 høye kneløft på hver side mens du holder god holdning. Utfør 10 sparkeslag fremover med strake bein for å aktivere hamstrings. Gjør 10 sidesteg med armrotasjon til hver side. Utfør 10 utfall fremover med rotasjon i overkroppen. Gjør 10 armsvinger fra side til side med bøyde knær. Avslutt med 30 sekunder med lett jogging og hopping.',
    'warmup', 'easy', 180, 10, 4.5, 0, 'NFF Trenerskolen', false, ''
),

-- 2. Oppvarming med ball
(
    'Oppvarming med ball',
    'Kombiner oppvarming med ballkontroll for å varme opp kroppen og få god ballføling. Trenger kun en ball.',
    'Start med lett jogging mens du dribler ballen fremover. Varier mellom høyrefot og venstrefot hvert femte steg. Stopp og gjør 5 trådtrekk med sålen på hver fot. Dribl videre med kun utsiden av foten i 30 sekunder. Bytt til kun innsiden av foten i 30 sekunder. Gjør 10 vendinger med sålen der du snur 180 grader. Dribl i sikksakk med korte hurtige touch. Avslutt med å holde ballen i luften så lenge du kan.',
    'warmup', 'easy', 120, 10, 4.7, 0, 'NFF Trenerskolen', true, 'Ball'
),

-- 3. Rondo (griseboks)
(
    'Rondo (griseboks)',
    'Klassisk oppvarmingsøvelse som trener pasning, bevegelse og ballbesittelse i gruppe. Trenger ball og 4 eller flere spillere.',
    'Lag en sirkel med 4-6 spillere og 1-2 i midten. Spillerne i sirkelen skal holde ballen unna de i midten. Bruk maks to touch for å kontrollere og sende ballen. De i midten jager ballen og prøver å vinne den tilbake. Den som mister ballen bytter plass med den som erobret. Hold høyt tempo og kommuniser med medspillerne. Varier med ett-touch for økt vanskelighetsgrad. Spill i 5 minutter med korte pauser mellom rundene.',
    'warmup', 'medium', 300, 20, 4.6, 0, 'NFF Trenerskolen', false, 'Ball, 4+ spillere'
),

-- 4. Pasning i bevegelse
(
    'Pasning i bevegelse',
    'Tren presise pasninger mens du er i bevegelse. Perfekt for oppvarming med partner. Trenger ball og en treningspartner.',
    'Stå 8-10 meter fra partneren din med ball. Jobb dere sideveis i samme retning mens dere sender ballen mellom hverandre. Bruk innsiden av foten og sikt på partnerens fremre fot. Bytt retning etter 30 sekunder. Øk tempoet gradvis slik at pasningene må være mer presise. Prøv å holde ballen langs bakken hele tiden. Varier med pasning i luften som partneren skal dempe. Avslutt med en-touch pasninger i høyt tempo.',
    'warmup', 'medium', 240, 20, 4.4, 0, 'Norges idrettshøgskole', false, 'Ball, partner'
),

-- 5. Aktiveringsøvelser
(
    'Aktiveringsøvelser',
    'Aktiver de viktigste muskelgruppene for fotball med kontrollerte bevegelser. Ingen utstyr nødvendig.',
    'Start med 10 knebøy med armene rett frem for balanse. Gjør 10 utfall til siden med vekt på det bøyde beinet. Utfør 10 ettbeins markløft på hvert bein med kontrollert bevegelse. Gjør 20 tåhev for å aktivere leggene. Utfør 10 hofteåpnere der du løfter kneet ut til siden. Gjør 10 glutebroer der du holder toppen i 2 sekunder. Avslutt med 30 sekunder med lette sprintbevegelser på stedet.',
    'warmup', 'easy', 180, 10, 4.3, 0, 'Norges idrettshøgskole', false, ''
),

-- 6. Jogging med retningsendring
(
    'Jogging med retningsendring',
    'Varm opp med jogging og brå retningsendringer som etterligner kampbevegelser. Trenger kjegler til å markere banen.',
    'Sett opp 6 kjegler i en tilfeldig formasjon med 3-4 meters avstand. Jog rolig mellom kjeglen i 30 sekunder. Ved hver kjegle gjør du en rask retningsendring til høyre eller venstre. Øk tempoet gradvis slik at retningsendringene blir mer eksplosive. Legg til sidesteg mellom annenhver kjegle. Gjør et lavt tyngdepunkt ved hver vending. Kjør 3 runder med 20 sekunders pause mellom.',
    'warmup', 'easy', 180, 10, 4.2, 0, 'Toppfotball Akademiet', false, 'Kjegler'
),

-- 7. Ballmestringssirkel
(
    'Ballmestringssirkel',
    'Øv på ulike ballmestringsteknikker i en sirkel av kjegler. Trenger ball og kjegler.',
    'Sett opp 4 kjegler i en firkant med 5 meters avstand. Dribl fra kjegle til kjegle med ulike teknikker. Første side bruk innsiden av foten med korte touch. Andre side bruk utsiden av foten. Tredje side gjør trådtrekk med sålen mellom hvert steg. Fjerde side bruk veksling mellom innsiden og utsiden. Gjenta sirkelen 4-5 ganger med økende tempo. Prøv å holde hodet opp og blikket fremover.',
    'warmup', 'medium', 240, 20, 4.5, 0, 'NFF Trenerskolen', false, 'Ball, kjegler'
),

-- ============================================================
-- STRENGTH — 7 øvelser
-- ============================================================

-- 8. Knebøy med varianter
(
    'Knebøy med varianter',
    'Bygg styrke i beina med ulike knebøy-varianter som er viktige for spenstighet og skuddkraft. Ingen utstyr nødvendig.',
    'Start med føttene i skulderbreddes avstand og tærne litt utover. Senk kroppen ned til lårene er parallelle med bakken. Hold ryggen rett og brystet opp gjennom hele bevegelsen. Press deg opp til startposisjonen og klem setemusklene i toppen. Gjør 12 vanlige knebøy som oppvarming. Fortsett med 10 smale knebøy med føttene samlet. Gjør 8 knebøy med pause i bunnen i 3 sekunder. Avslutt med 6 hoppknebøy der du hopper opp fra bunnposisjonen.',
    'strength', 'easy', 180, 10, 4.4, 0, 'Norges idrettshøgskole', false, ''
),

-- 9. Utfall fremover og bakover
(
    'Utfall fremover og bakover',
    'Styrk bein og hofter med utfall i begge retninger for bedre balanse og stabilitet. Ingen utstyr nødvendig.',
    'Stå med føttene samlet og hendene på hoftene. Ta et langt steg fremover og senk bakre kne mot bakken. Fremre kne skal ikke passere tærne når du er i bunnposisjonen. Press deg tilbake til start med kraft fra fremre bein. Gjør 10 utfall fremover på hvert bein. Snu og gjør 10 utfall bakover på hvert bein for ekstra utfordring. Hold overkroppen oppreist hele tiden. Gjør 2 sett med 30 sekunders pause mellom.',
    'strength', 'medium', 180, 20, 4.3, 0, 'Norges idrettshøgskole', false, ''
),

-- 10. Planken med varianter
(
    'Planken med varianter',
    'Bygg en sterk kjernemuskulatur med planken og ulike variasjoner. Ingen utstyr nødvendig.',
    'Legg deg på magen og løft kroppen opp på underarmer og tær. Hold kroppen i en rett linje fra hode til hæler. Spenn mage og setemuskulatur aktivt. Hold standard planke i 30 sekunder. Løft høyre arm rett frem i 5 sekunder og bytt til venstre. Løft høyre fot fra bakken i 5 sekunder og bytt til venstre. Gå over til sideplanke på hver side i 20 sekunder. Avslutt med 20 sekunder i standard planke.',
    'strength', 'easy', 180, 10, 4.6, 0, 'NFF Trenerskolen', false, ''
),

-- 11. Ettbeins styrke
(
    'Ettbeins styrke',
    'Utvikle balanse og styrke i hvert bein separat — avgjørende for fotballspillere. Ingen utstyr nødvendig.',
    'Stå på ett bein med lett bøyd kne og armene ut til siden. Hold balansen i 15 sekunder på hvert bein. Gjør 10 ettbeins knebøy på hvert bein med kontrollert bevegelse. Stå på høyre fot og strekk venstre bein bakover som en vekt. Hold posisjonen i 10 sekunder og gjenta på andre siden. Gjør 8 ettbeins hopp fremover på hvert bein. Avslutt med 10 ettbeins tåhev på hvert bein. Fokuser på å holde hoften rett hele tiden.',
    'strength', 'medium', 240, 20, 4.8, 0, 'Toppfotball Akademiet', true, ''
),

-- 12. Eksplosive hopp
(
    'Eksplosive hopp',
    'Tren spenst og eksplosivitet med ulike hoppøvelser. Passer for de som vil øke hoppkraften. Trenger kjegler.',
    'Sett opp 5 kjegler i en rekke med 1 meters avstand. Hopp over hver kjegle med samlede bein og land mykt. Snu og hopp tilbake med ett bein om gangen. Gjør 10 vertikale hopp der du prøver å nå så høyt som mulig. Utfør 8 brede hopp fremover med fokus på avstand. Gjør 10 knebøy-hopp der du går ned i dyp knebøy før du hopper. Utfør 8 hopp opp på et stabilt underlag om tilgjengelig. Hvil 20 sekunder mellom hver øvelse.',
    'strength', 'hard', 240, 30, 4.5, 0, 'Toppfotball Akademiet', false, 'Kjegler'
),

-- 13. Armhevinger for fotball
(
    'Armhevinger for fotball',
    'Styrk overkroppen for bedre skjermingsevne og duellstyrke. Ingen utstyr nødvendig.',
    'Start i plankeposisjon med hendene i skulderbredde. Senk brystet mot bakken med kontrollert fart. Hold kroppen i en rett linje hele veien ned. Press deg opp til startposisjon med full utstrekning. Gjør 3 sett med 10 armhevinger med 15 sekunders pause. Varier med smale armhevinger der hendene er tett sammen. Prøv diamant-armhevinger for ekstra utfordring. Avslutt med å holde bunnposisjonen i 10 sekunder.',
    'strength', 'medium', 180, 20, 4.2, 0, 'Norges idrettshøgskole', false, ''
),

-- 14. Kjernetrening komplett
(
    'Kjernetrening komplett',
    'Komplett kjernetreningsøkt som dekker alle magemuskelgrupper. Viktig for skuddkraft og balanse. Ingen utstyr.',
    'Start med 20 crunchies der du løfter skuldrene fra bakken. Gjør 15 sykkel-crunchies der du fører albuen mot motsatt kne. Utfør 20 beinløft der du holder beina strake og senker dem sakte. Hold en V-sit der du balanserer på setet med bein og overkropp løftet i 20 sekunder. Gjør 10 russiske vridninger til hver side med hendene foran brystet. Utfør 20 fjellklatrere i plankeposisjon med høyt tempo. Avslutt med 30 sekunder i standard planke. Hvil 15 sekunder mellom hver øvelse.',
    'strength', 'hard', 300, 30, 4.7, 0, 'Toppfotball Akademiet', false, ''
),

-- ============================================================
-- AGILITY — 7 øvelser
-- ============================================================

-- 15. Stige-øvelser grunnleggende
(
    'Stige-øvelser grunnleggende',
    'Lær grunnleggende stige-øvelser for bedre fotarbeid og koordinasjon. Trenger en koordinasjonsstige.',
    'Legg ut koordinasjonsstigen på en flat overflate. Start med to-fots hopp inn i hvert felt. Gå over til rask løping med ett steg i hvert felt. Øv på sideveis inn-og-ut med begge føttene. Gjør icki-shuffle der du går to steg inn og ett ut. Hold armene aktive og kroppen i balanse. Løp gjennom stigen 3 ganger med hver teknikk. Fokuser på hurtige lette fotsteg fremfor stor kraft.',
    'agility', 'easy', 180, 10, 4.3, 0, 'NFF Trenerskolen', false, 'Koordinasjonsstige'
),

-- 16. Stige-øvelser avansert
(
    'Stige-øvelser avansert',
    'Avanserte koordinasjonsstige-mønstre for maksimal fotarbeidshastighet. Trenger en koordinasjonsstige.',
    'Varm opp med 2 gjennomkjøringer i vanlig tempo. Utfør krysssteg inn-og-ut der du krysser føttene i hvert felt. Gjør sideveis karaoke-steg gjennom hele stigen. Kombiner hopp med landing på ett bein annethvert felt. Utfør 180-graders vendinger i hvert tredje felt. Gjør doble touch med hvert bein i hvert felt i maksimal hastighet. Kombiner flere mønstre etter hverandre uten pause. Timer deg selv og prøv å slå din egen rekord for hver runde.',
    'agility', 'hard', 240, 30, 4.9, 0, 'Toppfotball Akademiet', true, 'Koordinasjonsstige'
),

-- 17. Kjegle-sprint med vendinger
(
    'Kjegle-sprint med vendinger',
    'Tren akselerasjon og deselerasjon med korte sprinter og brå vendinger. Trenger 6 kjegler.',
    'Sett opp 6 kjegler i sikksakk med 3-4 meters avstand. Sprint til første kjegle og gjør en skarp vending. Fortsett til neste kjegle med eksplosiv akselerasjon. Bremse ned kontrollert inn mot hver kjegle. Hold tyngdepunktet lavt i vendingene. Gjør vendinger med både høyre og venstre fot. Kjør 5 gjennomkjøringer med 30 sekunders hvile mellom. Prøv å forbedre tiden for hver runde.',
    'agility', 'medium', 240, 20, 4.5, 0, 'NFF Trenerskolen', false, 'Kjegler'
),

-- 18. T-test hurtighetsdrill
(
    'T-test hurtighetsdrill',
    'Klassisk T-test som måler akselerasjon, sidesteg og baklengs løping. Trenger 4 kjegler.',
    'Sett opp kjeglen i en T-form med 5 meter opp og 5 meter til hver side. Sprint fremover fra startpunktet til midtkjeglen. Sidesteg til venstre kjegle og berør den. Sidesteg hele veien til høyre kjegle og berør den. Sidesteg tilbake til midtkjeglen. Løp baklengs tilbake til startpunktet. Gjør 4 gjennomkjøringer med 45 sekunders hvile mellom. Timer deg og noter beste tid.',
    'agility', 'hard', 180, 30, 4.6, 0, 'Toppfotball Akademiet', false, 'Kjegler'
),

-- 19. Sideveis bevegelse
(
    'Sideveis bevegelse',
    'Forbedre evnen til å bevege deg sideveis med hurtige defensive fotarbeidsteknikker. Trenger kjegler.',
    'Sett opp 2 kjegler med 5 meters avstand. Stå i atletisk posisjon med bøyde knær og lav hofte. Gjør raske sidesteg fra kjegle til kjegle uten å krysse føttene. Hold blikket fremover og armene foran kroppen. Berør kjeglen med håndflaten ved hver vending. Gjør 10 gjennomkjøringer i høyeste tempo du klarer. Varier med å legge til et hopp ved hver kjegle. Ta 20 sekunders pause etter 5 gjennomkjøringer.',
    'agility', 'medium', 180, 20, 4.4, 0, 'NFF Trenerskolen', false, 'Kjegler'
),

-- 20. Reaksjonsøvelser
(
    'Reaksjonsøvelser',
    'Skjerp reaksjonsevnen med øvelser der du må reagere raskt på signaler. Trenger kjegler og partner.',
    'Stå klar i atletisk posisjon med en partner foran deg. Partneren peker i en retning og du sprinter dit så fort du kan. Sett opp 4 kjegler i en firkant rundt deg med 3 meters avstand. Partneren roper et tall 1-4 og du sprinter til riktig kjegle. Varier med farger i stedet for tall for økt utfordring. Gjør 10 reaksjoner i rask rekkefølge og bytt roller. Hvil 30 sekunder mellom settene. Gjør 3 sett hver.',
    'agility', 'medium', 240, 20, 4.3, 0, 'Norges idrettshøgskole', false, 'Kjegler, partner'
),

-- 21. Pendelløp (shuttle run)
(
    'Pendelløp (shuttle run)',
    'Tren anaerob utholdenhet og vendekapasitet med intense pendelløp. Trenger 2 kjegler.',
    'Sett opp 2 kjegler med 20 meters avstand. Sprint fra start til den andre kjeglen og berør bakken. Snu raskt og sprint tilbake til startkjeglen. Gjenta uten pause i 30 sekunder. Hvil i 30 sekunder og gjenta 4 ganger. Fokuser på eksplosive starter og lave vendinger. Prøv å øke antall lengder for hvert sett. Avslutt med en rolig utjogging mellom kjeglen.',
    'agility', 'hard', 180, 30, 4.5, 0, 'Toppfotball Akademiet', false, 'Kjegler'
),

-- ============================================================
-- SKILL — 9 øvelser
-- ============================================================

-- 22. Dribling i kjegle-bane
(
    'Dribling i kjegle-bane',
    'Øv dribling og ballkontroll gjennom en kjegle-bane for tettere ballkontroll. Trenger ball og kjegler.',
    'Sett opp 8-10 kjegler i en rett linje med 1 meters avstand. Dribl gjennom banen med innsiden av foten og hold ballen nær. Snu og dribl tilbake med utsiden av foten. Tredje gjennomkjøring bruk veksling mellom inn og utside. Fjerde gjennomkjøring bruk kun venstre fot. Femte gjennomkjøring bruk kun høyre fot. Timer deg og prøv å slå din egen rekord. Fokuser på å ha ballen under kontroll fremfor hastighet.',
    'skill', 'medium', 300, 20, 4.6, 0, 'NFF Trenerskolen', false, 'Ball, kjegler'
),

-- 23. Pasningstrening mot vegg
(
    'Pasningstrening mot vegg',
    'Perfekt øvelse for å øve alene på presise pasninger og mottak. Trenger ball og en vegg.',
    'Stå 4-5 meter fra veggen med ballen ved føttene. Slå ballen mot veggen med innsiden av høyre fot og motta med venstre. Bytt slik at du slår med venstre og mottar med høyre. Øk avstanden til 6-7 meter for lengre pasninger. Prøv å treffe samme punkt på veggen hver gang. Varier med loftet pasning mot veggen og dempe med brystet. Øv på en-touch pasning der du sender ballen rett tilbake. Avslutt med 10 pasninger med utsiden av foten på hvert bein.',
    'skill', 'easy', 300, 10, 4.5, 0, 'NFF Trenerskolen', false, 'Ball, vegg'
),

-- 24. Skuddtrening
(
    'Skuddtrening',
    'Øv på presise skudd med ulike teknikker mot mål. Trenger ball og mål eller markert målområde.',
    'Start med ballen 12 meter fra målet. Skyt 5 skudd med vristen og sikt i hjørnene. Flytt ballen til siden og skyt 5 skudd med innsiden av foten. Øv på sidefotspark med plassering i nedre hjørne. Prøv 5 vristskudd med litt skru på ballen. Ta 3-4 steg tilløp og fokuser på at standfoten peker mot målet. Varier mellom lav hard og høy plassert avslutning. Avslutt med 5 skudd etter kort dribling. Plassering er viktigere enn kraft.',
    'skill', 'medium', 300, 20, 4.7, 0, 'Toppfotball Akademiet', false, 'Ball, mål'
),

-- 25. Førstekontakt og mottak
(
    'Førstekontakt og mottak',
    'Utvikle en sterk førstekontakt som gir deg tid og rom i kampsituasjoner. Trenger ball og vegg.',
    'Stå 3-4 meter fra veggen med ball. Slå ballen mot veggen med innsiden av foten i medium tempo. Ta imot ballen med ett touch og kontroller den ved siden av kroppen. Varier mellom høyre og venstre fot for mottak. Øv på å dempe ballen med brystet etter kast mot veggen. Prøv å ta imot med utsiden av foten og dra ballen med deg. Øk avstanden gradvis til 5-6 meter. Utfordring: motta ballen og snu i én bevegelse bort fra veggen.',
    'skill', 'medium', 240, 20, 4.8, 0, 'NFF Trenerskolen', true, 'Ball, vegg'
),

-- 26. Jonglering
(
    'Jonglering',
    'Forbedre ballføling og koordinasjon gjennom jonglering. Alt du trenger er en ball.',
    'Hold ballen i hendene og slipp den ned på foten for å starte. Prøv å holde ballen i luften med vekselvis høyre og venstre fot. Fokuser på å treffe ballen med snørebåndet eller vristen. Hold ankelen låst og tærne litt opp. Start med å la ballen sprette en gang mellom hvert touch om nødvendig. Prøv å nå 10 touch i strekk som første mål. Legg til lår og hode når du mestrer fot-jonglering. Sett deg et mål om å slå din egen rekord hver gang du trener.',
    'skill', 'easy', 300, 10, 4.2, 0, 'NFF Trenerskolen', false, 'Ball'
),

-- 27. Finter og vendinger
(
    'Finter og vendinger',
    'Lær de viktigste fintene for å passere motstandere i 1-mot-1 situasjoner. Trenger ball og kjegler.',
    'Sett opp 4 kjegler med 5 meters avstand i en rekke som tenkte motstandere. Øv på stepover-finte der du fører foten over ballen og drar den motsatt vei. Gjør saksefinte der du svinger foten rundt ballen før du akselererer. Øv Cruyff-vendingen der du spiller ballen bak standfoten. Prøv drag-back der du stopper ballen med sålen og drar den bakover. Gjør skulderfinte der du lener kroppen en vei og drar ballen den andre. Kombiner to finter etter hverandre mot samme kjegle. Utfør alle fintene i full fart for realistisk trening.',
    'skill', 'hard', 300, 30, 4.9, 0, 'Toppfotball Akademiet', false, 'Ball, kjegler'
),

-- 28. Heading-teknikk
(
    'Heading-teknikk',
    'Øv på riktig heading-teknikk for presisjon og kraft. Trenger ball og en treningspartner.',
    'Start med ballen i egne hender og kast den lett opp. Treff ballen med pannen midt på hårfestet. Hold øynene åpne og munnen lukket ved treffpunktet. Stram nakkemusklene og press kroppen gjennom ballen. Øv med partner som kaster ballen forsiktig mot deg fra 3 meter. Nik ballen tilbake til partneren med presisjon. Øk avstanden gradvis til 5-6 meter. Varier med å heade ballen nedover mot bakken som ved avslutninger.',
    'skill', 'medium', 240, 20, 4.4, 0, 'NFF Trenerskolen', false, 'Ball, partner'
),

-- 29. Mottak og vending
(
    'Mottak og vending',
    'Lær å ta imot ballen og snu deg mot mål i én bevegelse. Avansert teknikk for kampklar ballkontroll. Trenger ball og kjegler.',
    'Sett opp 2 kjegler med 10 meters avstand som representerer motspiller og mål. Stå ved den ene kjeglen med ryggen mot den andre. Kast eller spill ballen mot veggen og ta imot med kroppen halvt vendt. Bruk det første touchet til å dra ballen forbi den tenkte motstanderen. Akselerér mot den andre kjeglen etter vendingen. Øv på å motta med innsiden av foten og åpne kroppen mot mål. Prøv mottaket med utsiden av foten for å overraske motstanderen. Gjenta 10 ganger på hvert bein med fokus på hurtig vending.',
    'skill', 'hard', 240, 30, 4.6, 0, 'Toppfotball Akademiet', false, 'Ball, kjegler'
),

-- 30. 1-mot-1 situasjoner
(
    '1-mot-1 situasjoner',
    'Tren på å ta deg forbi en motspiller med fart, finter og ballkontroll. Trenger ball, kjegler og partner.',
    'Sett opp et lite område på 10x8 meter med kjegler. Angriper starter med ball 5 meter fra forsvareren. Angriper prøver å dribler forbi forsvareren og over linja bak. Forsvareren skal prøve å vinne ballen eller tvinge angriperen ut. Bruk finter og tempoendringer for å skape rom. Prøv å lese forsvararens bevegelser og utnytte åpninger. Bytt roller etter 5 forsøk. Varier med å starte fra ulike vinkler. Fokuser like mye på forsvarsspill som angrep.',
    'skill', 'hard', 300, 30, 4.8, 0, 'Toppfotball Akademiet', true, 'Ball, kjegler, partner'
),

-- ============================================================
-- COOLDOWN — 5 øvelser
-- ============================================================

-- 31. Uttøying for fotball
(
    'Uttøying for fotball',
    'Grundig uttøying etter trening som dekker alle viktige muskelgrupper for fotballspillere. Ingen utstyr nødvendig.',
    'Start med å tøye leggene ved å presse hælen mot bakken med et bein bak. Hold hver tøyning i 30 sekunder og bytt side. Tøy lårmusklene foran ved å dra foten mot setet mens du står. Tøy hamstrings ved å legge foten på en lav flate og lene deg fremover. Tøy hoftebøyerne med et dypt utfall og press hoften fremover. Tøy adduktorene med brede bein og len deg til siden. Tøy overkroppen med armkryss over brystet. Pust dypt og rolig gjennom hele uttøyingen.',
    'cooldown', 'easy', 300, 10, 4.5, 0, 'NFF Trenerskolen', false, ''
),

-- 32. Yoga-inspirert nedtrapping
(
    'Yoga-inspirert nedtrapping',
    'Rolige yoga-inspirerte bevegelser som hjelper kroppen å komme ned etter trening. Ingen utstyr nødvendig.',
    'Start i stående posisjon med føttene samlet og øynene lukket. Ta 5 dype pust inn gjennom nesen og ut gjennom munnen. Gå ned i fremoverbeining og la overkroppen henge tungt ned. Gå hendene fremover til nedovervendt hund og hold i 30 sekunder. Senk deg ned til kobra-posisjon og strekk ryggen bakover. Gå tilbake til barneposisjon med armene strukket fremover. Hold barneposisjonen i 30 sekunder og fokuser på pusten. Rull sakte opp til stående og avslutt med 5 rolige pust.',
    'cooldown', 'easy', 300, 10, 4.3, 0, 'Norges idrettshøgskole', false, ''
),

-- 33. Pustøvelser og avspenning
(
    'Pustøvelser og avspenning',
    'Senk pulsen og stressnivået med bevisste pusteteknikker. Perfekt avslutning på enhver trening. Ingen utstyr.',
    'Finn et rolig sted og legg deg på ryggen med bøyde knær. Legg en hånd på magen og en på brystet. Pust inn gjennom nesen i 4 sekunder og kjenn at magen hever seg. Hold pusten i 4 sekunder. Pust ut gjennom munnen i 6 sekunder og kjenn at magen synker. Gjenta denne syklusen 10 ganger. Slapp av alle muskelgrupper fra tærne og oppover. Ligg stille i 30 sekunder og kjenn hvordan kroppen føles.',
    'cooldown', 'easy', 180, 10, 4.1, 0, 'Norges idrettshøgskole', false, ''
),

-- 34. Aktiv restitusjon
(
    'Aktiv restitusjon',
    'Lett aktivitet med ball som fremmer restitusjon etter hard trening. Trenger kun en ball.',
    'Start med rolig gange i 1 minutt for å senke pulsen gradvis. Dribl ballen med lette touch i gangfart. Gjør sakte trådtrekk med sålen mens du går fremover. Stopp og gjør forsiktige sirkel-bevegelser med ballen under foten. Varier med å rulle ballen mellom føttene mens du står stille. Gjør lette jonglerings-forsøk i lavt tempo uten stress. Sett deg ned og rull ballen under foten for å massere fotbuen. Avslutt med å ligge på ryggen med beina opp mot en vegg i 1 minutt.',
    'cooldown', 'easy', 300, 10, 4.4, 0, 'NFF Trenerskolen', false, 'Ball'
),

-- 35. Mobilitetsrutine
(
    'Mobilitetsrutine',
    'Forbedre bevegeligheten i hofter, ankler og skuldre med målrettet mobilitetsarbeid. Ingen utstyr nødvendig.',
    'Start med 10 hofteåpnere der du løfter kneet ut til siden i en sirkel. Gjør 10 hoftesirkler der du roterer hoften i store sirkler. Utfør 10 ankelmobiliseringer ved å gå ned i dyp knebøy med hælene i bakken. Gjør den dypeste knebøyen du kan og hold i 30 sekunder. Utfør 10 skulderrotasjoner fremover og bakover. Sett deg i sommerfugl-stilling og press knærne forsiktig mot bakken. Hold verdens beste tøyning i 30 sekunder på hver side. Avslutt med katt-ku bevegelser på alle fire i 30 sekunder.',
    'cooldown', 'medium', 300, 20, 4.6, 0, 'Toppfotball Akademiet', false, ''
);
