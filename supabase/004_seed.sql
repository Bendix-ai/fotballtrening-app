-- ============================================================
-- FotballTrening App - Seed Data
-- Run AFTER all other migration files
-- ============================================================

-- Clubs
INSERT INTO public.clubs (id, name) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Våganes IL'),
    ('00000000-0000-0000-0000-000000000002', 'Stavanger IF'),
    ('00000000-0000-0000-0000-000000000003', 'Rosenborg BK Ungdom'),
    ('00000000-0000-0000-0000-000000000004', 'Vålerenga IF');

-- Year groups for Våganes IL
INSERT INTO public.year_groups (club_id, year) VALUES
    ('00000000-0000-0000-0000-000000000001', 2011),
    ('00000000-0000-0000-0000-000000000001', 2012),
    ('00000000-0000-0000-0000-000000000001', 2013),
    ('00000000-0000-0000-0000-000000000001', 2014),
    ('00000000-0000-0000-0000-000000000001', 2015),
    ('00000000-0000-0000-0000-000000000001', 2016);

-- Teams (boys + girls for each year group of Våganes IL)
INSERT INTO public.teams (year_group_id, gender, name)
SELECT yg.id, 'boys', 'Gutter ' || yg.year
FROM public.year_groups yg WHERE yg.club_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.teams (year_group_id, gender, name)
SELECT yg.id, 'girls', 'Jenter ' || yg.year
FROM public.year_groups yg WHERE yg.club_id = '00000000-0000-0000-0000-000000000001';

-- Public exercises
INSERT INTO public.exercises (title, description, instructions, duration_seconds, difficulty, category, points, is_public) VALUES
    ('Oppvarming med ball', 'Let oppvarming med fotball for å få kroppen i gang.', 'Start med lett jogging mens du dribler ballen. Varier mellom høyrefot og venstrefot. Hold overkroppen rett og blikket framover. Øk tempoet gradvis etter 1 minutt.', 120, 'easy', 'warmup', 10, TRUE),
    ('Styrke: Knebøy', 'Bygg styrke i beina med knebøy-øvelse.', 'Stå med føttene i skulderbreddes avstand. Senk kroppen ned som om du setter deg på en stol. Hold ryggen rett og knærne bak tærnes. Press deg opp til startposisjon. Gjenta 3 sett med 15 repetisjoner.', 180, 'medium', 'strength', 20, TRUE),
    ('Sprintøvelser', 'Forbedre akselerasjonen og toppfarten din.', 'Marker 20 meter. Sprint så fort du kan til enden. Gå rolig tilbake til start. Hvil 30 sekunder. Gjenta 8 ganger. Fokuser på eksplosiv start.', 240, 'hard', 'agility', 25, TRUE),
    ('Pasningstrening', 'Øv på presise pasninger mot vegg eller med partner.', 'Finn en vegg eller partner på 5-10 meters avstand. Slipp ballen med innsiden av foten. Motta ballen og kontroller den før du sender tilbake. Varier mellom høyre og venstre fot. Prøv å treffe samme punkt hver gang.', 300, 'medium', 'skill', 15, TRUE),
    ('Stretching', 'Tøy ut etter trening for bedre restitusjon.', 'Tøy alle hovedmuskelgrupper i 30 sekunder hver. Start med legger, lårtrekker, hoftebøyere. Fortsett med hamstrings, quadriceps og adduktorer. Avslutt med overkropp og armer. Pust dypt og slapp av.', 300, 'easy', 'cooldown', 10, TRUE),
    ('Stige-øvelser', 'Forbedre fotarbeid og koordinasjon med stigeøvelser.', 'Legg ut en koordinasjonsstige. Kjør gjennom med hurtige fotsteg. Varier mellom inn-ut, sideveis og hoppmønstre. Hold kroppen lav og armene aktive. Gjenta hver øvelse 3 ganger.', 180, 'medium', 'agility', 20, TRUE),
    ('Planken', 'Bygg en sterk kjerne med plankeøvelse.', 'Legg deg på magen. Løft kroppen opp på underarmer og tær. Hold kroppen i en rett linje. Spenn mage og rumpe. Hold posisjonen i 30 sekunder. Hvil 15 sekunder. Gjenta 4 ganger.', 180, 'easy', 'strength', 15, TRUE),
    ('Dribling i kjegle-bane', 'Øv dribling og ballkontroll gjennom kjegler.', 'Sett opp 8-10 kjegler i en rekke med 1 meters avstand. Dribl gjennom kjeglebanen så fort du kan. Bruk både innside og utside av foten. Prøv å holde ballen nært foten. Timer deg og prøv å slå din egen rekord.', 300, 'hard', 'skill', 30, TRUE);

-- Store exercises
INSERT INTO public.store_exercises (title, description, category, difficulty, duration_seconds, points, rating, downloads, author, is_featured, instructions) VALUES
    ('Koordinasjonsbane', 'Avansert koordinasjonsøvelse med flere stasjoner.', 'agility', 'hard', 360, 35, 4.8, 234, 'NFF Trenerskolen', TRUE, 'Sett opp 6 stasjoner med ulike koordinasjonsøvelser.'),
    ('Heading-teknikk', 'Lær riktig heading-teknikk trinn for trinn.', 'skill', 'medium', 240, 20, 4.5, 189, 'NFF Trenerskolen', TRUE, 'Start med å kaste ballen opp og heade den.'),
    ('Styrketrening for unge', 'Alderstilpasset styrketrening uten vekter.', 'strength', 'easy', 300, 15, 4.7, 312, 'Idrettshøgskolen', FALSE, 'Kroppsvektøvelser tilpasset unge spillere.'),
    ('Finter og vendinger', 'Mestre ulike finter og vendinger med ball.', 'skill', 'hard', 300, 30, 4.9, 456, 'NFF Trenerskolen', TRUE, 'Øv på stepover, Cruyff-vending og elastico.'),
    ('Dynamisk oppvarming', 'Moderne oppvarming med dynamiske øvelser.', 'warmup', 'easy', 180, 10, 4.3, 567, 'Idrettshøgskolen', FALSE, 'Dynamiske tøyninger og bevegelser.'),
    ('Skuddtrening', 'Øv på avslutninger fra ulike vinkler.', 'skill', 'medium', 360, 25, 4.6, 345, 'NFF Trenerskolen', FALSE, 'Sett opp mål og øv fra ulike posisjoner.'),
    ('Hurtighet med retningsendring', 'Sprint og retningsendring for fotball.', 'agility', 'medium', 240, 20, 4.4, 278, 'Idrettshøgskolen', FALSE, 'Sprint 10m, skift retning, sprint 10m til.'),
    ('Kjernemuskulatur', 'Styrk kjernemuskulaturen for bedre balanse.', 'strength', 'medium', 240, 20, 4.2, 198, 'Idrettshøgskolen', FALSE, 'Planke-variasjoner og rotasjonsøvelser.'),
    ('Yoga for fotball', 'Yoga-inspirerte øvelser for fleksibilitet.', 'cooldown', 'easy', 420, 15, 4.1, 134, 'Idrettshøgskolen', FALSE, 'Rolige yoga-posisjoner for restitusjon.'),
    ('1-mot-1 situasjoner', 'Tren på offensive og defensive 1v1.', 'skill', 'hard', 300, 30, 4.8, 389, 'NFF Trenerskolen', TRUE, 'Øv på dribling forbi motstander.');

-- Store reviews
INSERT INTO public.store_reviews (exercise_id, club_name, rating, comment)
SELECT se.id, 'Stavanger IF', 5, 'Fantastisk øvelse! Spillerne elsket den.'
FROM public.store_exercises se WHERE se.title = 'Koordinasjonsbane';

INSERT INTO public.store_reviews (exercise_id, club_name, rating, comment)
SELECT se.id, 'Rosenborg BK', 4, 'Bra opplegg, litt avansert for de yngste.'
FROM public.store_exercises se WHERE se.title = 'Koordinasjonsbane';

INSERT INTO public.store_reviews (exercise_id, club_name, rating, comment)
SELECT se.id, 'Vålerenga IF', 5, 'Perfekt for teknikk-trening!'
FROM public.store_exercises se WHERE se.title = 'Finter og vendinger';

INSERT INTO public.store_reviews (exercise_id, club_name, rating, comment)
SELECT se.id, 'Brann', 4, 'Godt forklart og lett å følge.'
FROM public.store_exercises se WHERE se.title = 'Heading-teknikk';

INSERT INTO public.store_reviews (exercise_id, club_name, rating, comment)
SELECT se.id, 'Viking FK', 5, 'Meget bra 1v1 trening!'
FROM public.store_exercises se WHERE se.title = '1-mot-1 situasjoner';
