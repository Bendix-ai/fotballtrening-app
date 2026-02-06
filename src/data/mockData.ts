import { Club, YearGroup, Gender, Exercise, LeaderboardEntry, AchievementDefinition, AdminPlayer, AdminActivity, DashboardMetrics, StoreExercise, StoreReview, ClubYearGroup, ChartDataPoint } from '../types';

export const mockClubs: Club[] = [
    { id: '1', name: 'Vaganes IL', logo_url: null, created_by: 'admin1', created_at: '2024-01-01' },
    { id: '2', name: 'Stavanger IF', logo_url: null, created_by: 'admin2', created_at: '2024-01-01' },
    { id: '3', name: 'Rosenborg BK Ungdom', logo_url: null, created_by: 'admin3', created_at: '2024-01-01' },
    { id: '4', name: 'Valerenga IF', logo_url: null, created_by: 'admin4', created_at: '2024-01-01' },
];

export const mockYearGroups: { value: string; label: string }[] = [
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' },
    { value: '2014', label: '2014' },
    { value: '2013', label: '2013' },
    { value: '2012', label: '2012' },
    { value: '2011', label: '2011' },
];

export const mockGenders: { value: Gender; label: string }[] = [
    { value: 'boys', label: 'Gutter' },
    { value: 'girls', label: 'Jenter' },
    { value: 'mixed', label: 'Blandet' },
];

export const mockExercises: Exercise[] = [
    {
        id: '1',
        title: 'Oppvarming med ball',
        description: 'Let oppvarming med fotball for a fa kroppen i gang.',
        instructions: 'Start med lett jogging mens du dribler ballen. Varier mellom hoyrefot og venstrefot. Hold overkroppen rett og blikket framover. Okt tempoet gradvis etter 1 minutt.',
        image_url: null,
        video_url: null,
        duration_seconds: 120,
        difficulty: 'easy',
        category: 'warmup',
        points: 10,
        is_public: true,
        created_by_club_id: null,
        created_at: '2024-01-01',
    },
    {
        id: '2',
        title: 'Styrke: Kneboey',
        description: 'Bygg styrke i beina med kneboey-ovelse.',
        instructions: 'Sta med foettene i skulderbreddes avstand. Senk kroppen ned som om du setter deg pa en stol. Hold ryggen rett og knarne bak tarnes. Press deg opp til startposisjon. Gjenta 3 sett med 15 repetisjoner.',
        image_url: null,
        video_url: null,
        duration_seconds: 180,
        difficulty: 'medium',
        category: 'strength',
        points: 20,
        is_public: true,
        created_by_club_id: null,
        created_at: '2024-01-01',
    },
    {
        id: '3',
        title: 'Sprintovelser',
        description: 'Forbedre akselerasjonen og toppfarten din.',
        instructions: 'Marker 20 meter. Sprint sa fort du kan til enden. Ga rolig tilbake til start. Hvil 30 sekunder. Gjenta 8 ganger. Fokuser pa eksplosiv start.',
        image_url: null,
        video_url: null,
        duration_seconds: 240,
        difficulty: 'hard',
        category: 'agility',
        points: 25,
        is_public: true,
        created_by_club_id: null,
        created_at: '2024-01-01',
    },
    {
        id: '4',
        title: 'Pasningstrening',
        description: 'Ov pa presise pasninger mot vegg eller med partner.',
        instructions: 'Finn en vegg eller partner pa 5-10 meters avstand. Slipp ballen med innsiden av foten. Motta ballen og kontroller den for du sender tilbake. Varier mellom hoyre og venstre fot. Prov a treffe samme punkt hver gang.',
        image_url: null,
        video_url: null,
        duration_seconds: 300,
        difficulty: 'medium',
        category: 'skill',
        points: 15,
        is_public: true,
        created_by_club_id: null,
        created_at: '2024-01-01',
    },
    {
        id: '5',
        title: 'Stretching',
        description: 'Toy ut etter trening for bedre restitusjon.',
        instructions: 'Toy alle hovedmuskelgrupper i 30 sekunder hver. Start med legger, lartrekker, hofteboeyere. Fortsett med hamstrings, quadriceps og adduktorer. Avslutt med overkropp og armer. Pust dypt og slapp av.',
        image_url: null,
        video_url: null,
        duration_seconds: 300,
        difficulty: 'easy',
        category: 'cooldown',
        points: 10,
        is_public: true,
        created_by_club_id: null,
        created_at: '2024-01-01',
    },
    {
        id: '6',
        title: 'Stige-ovelser',
        description: 'Forbedre fotarbeid og koordinasjon med stigeovelser.',
        instructions: 'Legg ut en koordinasjonsstige. Kjor gjennom med hurtige fotsteg. Varier mellom inn-ut, sideveis og hoppmonstre. Hold kroppen lav og armene aktive. Gjenta hver ovelse 3 ganger.',
        image_url: null,
        video_url: null,
        duration_seconds: 180,
        difficulty: 'medium',
        category: 'agility',
        points: 20,
        is_public: true,
        created_by_club_id: null,
        created_at: '2024-01-01',
    },
    {
        id: '7',
        title: 'Planken',
        description: 'Bygg en sterk kjerne med plankeovelse.',
        instructions: 'Legg deg pa magen. Loft kroppen opp pa underarmer og taer. Hold kroppen i en rett linje. Spenn mage og rumpe. Hold posisjonen i 30 sekunder. Hvil 15 sekunder. Gjenta 4 ganger.',
        image_url: null,
        video_url: null,
        duration_seconds: 180,
        difficulty: 'easy',
        category: 'strength',
        points: 15,
        is_public: true,
        created_by_club_id: null,
        created_at: '2024-01-01',
    },
    {
        id: '8',
        title: 'Dribling i kjegle-bane',
        description: 'Ov dribling og ballkontroll gjennom kjegler.',
        instructions: 'Sett opp 8-10 kjegler i en rekke med 1 meters avstand. Dribl gjennom kjeglebanen sa fort du kan. Bruk bade innside og utside av foten. Prov a holde ballen naert foten. Timer deg og prov a sla din egen rekord.',
        image_url: null,
        video_url: null,
        duration_seconds: 300,
        difficulty: 'hard',
        category: 'skill',
        points: 30,
        is_public: true,
        created_by_club_id: null,
        created_at: '2024-01-01',
    },
];

export const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, user_id: '1', display_name: 'Martin S.', avatar_url: null, total_points: 520, exercises_completed: 42, current_streak: 12, is_current_user: false },
    { rank: 2, user_id: '2', display_name: 'Emma L.', avatar_url: null, total_points: 485, exercises_completed: 38, current_streak: 8, is_current_user: false },
    { rank: 3, user_id: '3', display_name: 'Jonas K.', avatar_url: null, total_points: 460, exercises_completed: 35, current_streak: 15, is_current_user: false },
    { rank: 4, user_id: '4', display_name: 'Du', avatar_url: null, total_points: 390, exercises_completed: 30, current_streak: 5, is_current_user: true },
    { rank: 5, user_id: '5', display_name: 'Sofia M.', avatar_url: null, total_points: 350, exercises_completed: 28, current_streak: 3, is_current_user: false },
    { rank: 6, user_id: '6', display_name: 'Oliver T.', avatar_url: null, total_points: 320, exercises_completed: 25, current_streak: 7, is_current_user: false },
    { rank: 7, user_id: '7', display_name: 'Nora B.', avatar_url: null, total_points: 280, exercises_completed: 22, current_streak: 4, is_current_user: false },
    { rank: 8, user_id: '8', display_name: 'Henrik A.', avatar_url: null, total_points: 250, exercises_completed: 20, current_streak: 2, is_current_user: false },
];

export const mockAchievements = [
    { type: 'first_exercise' as const, unlocked: true },
    { type: 'streak_7' as const, unlocked: true },
    { type: 'points_100' as const, unlocked: true },
    { type: 'exercises_10' as const, unlocked: true },
    { type: 'streak_30' as const, unlocked: false },
    { type: 'points_500' as const, unlocked: false },
    { type: 'points_1000' as const, unlocked: false },
    { type: 'exercises_50' as const, unlocked: false },
    { type: 'all_categories' as const, unlocked: false },
];

export const achievementDefinitions: Record<string, AchievementDefinition> = {
    first_exercise: { type: 'first_exercise', title: 'Første øvelse', description: 'Fullfør din første øvelse', icon: 'star', points_bonus: 10 },
    streak_7: { type: 'streak_7', title: 'Uke-streak', description: 'Hold streaken i 7 dager', icon: 'local-fire-department', points_bonus: 25 },
    streak_30: { type: 'streak_30', title: 'Måneds-streak', description: 'Hold streaken i 30 dager', icon: 'whatshot', points_bonus: 100 },
    points_100: { type: 'points_100', title: 'Hundre poeng', description: 'Tjen 100 poeng', icon: 'emoji-events', points_bonus: 15 },
    points_500: { type: 'points_500', title: 'Fem hundre', description: 'Tjen 500 poeng', icon: 'emoji-events', points_bonus: 50 },
    points_1000: { type: 'points_1000', title: 'Tusen poeng', description: 'Tjen 1000 poeng', icon: 'emoji-events', points_bonus: 100 },
    exercises_10: { type: 'exercises_10', title: 'Ti øvelser', description: 'Fullfør 10 øvelser', icon: 'fitness-center', points_bonus: 20 },
    exercises_50: { type: 'exercises_50', title: 'Femti øvelser', description: 'Fullfør 50 øvelser', icon: 'fitness-center', points_bonus: 75 },
    all_categories: { type: 'all_categories', title: 'Allsidig', description: 'Prøv alle øvelseskategorier', icon: 'category', points_bonus: 50 },
};

// Admin mock data
export const mockAdminPlayers: AdminPlayer[] = [
    { id: 'p1', display_name: 'Martin Solberg', username: 'martin.s', year_group: 2015, gender: 'boys', total_points: 520, exercises_completed: 42, current_streak: 12, last_active: '2024-12-15', is_active: true },
    { id: 'p2', display_name: 'Emma Larsen', username: 'emma.l', year_group: 2015, gender: 'girls', total_points: 485, exercises_completed: 38, current_streak: 8, last_active: '2024-12-15', is_active: true },
    { id: 'p3', display_name: 'Jonas Kristiansen', username: 'jonas.k', year_group: 2014, gender: 'boys', total_points: 460, exercises_completed: 35, current_streak: 15, last_active: '2024-12-14', is_active: true },
    { id: 'p4', display_name: 'Sofia Mikkelsen', username: 'sofia.m', year_group: 2015, gender: 'girls', total_points: 350, exercises_completed: 28, current_streak: 3, last_active: '2024-12-13', is_active: true },
    { id: 'p5', display_name: 'Oliver Thomsen', username: 'oliver.t', year_group: 2014, gender: 'boys', total_points: 320, exercises_completed: 25, current_streak: 7, last_active: '2024-12-15', is_active: true },
    { id: 'p6', display_name: 'Nora Berg', username: 'nora.b', year_group: 2016, gender: 'girls', total_points: 280, exercises_completed: 22, current_streak: 4, last_active: '2024-12-12', is_active: true },
    { id: 'p7', display_name: 'Henrik Andersen', username: 'henrik.a', year_group: 2014, gender: 'boys', total_points: 250, exercises_completed: 20, current_streak: 2, last_active: '2024-12-11', is_active: false },
    { id: 'p8', display_name: 'Ingrid Nilsen', username: 'ingrid.n', year_group: 2016, gender: 'girls', total_points: 220, exercises_completed: 18, current_streak: 0, last_active: '2024-12-10', is_active: false },
    { id: 'p9', display_name: 'Aksel Hansen', username: 'aksel.h', year_group: 2015, gender: 'boys', total_points: 190, exercises_completed: 15, current_streak: 1, last_active: '2024-12-14', is_active: true },
    { id: 'p10', display_name: 'Ella Johansen', username: 'ella.j', year_group: 2016, gender: 'girls', total_points: 150, exercises_completed: 12, current_streak: 5, last_active: '2024-12-15', is_active: true },
    { id: 'p11', display_name: 'Lars Eriksen', username: 'lars.e', year_group: 2013, gender: 'boys', total_points: 130, exercises_completed: 10, current_streak: 0, last_active: '2024-12-08', is_active: false },
    { id: 'p12', display_name: 'Maja Pedersen', username: 'maja.p', year_group: 2013, gender: 'girls', total_points: 100, exercises_completed: 8, current_streak: 2, last_active: '2024-12-14', is_active: true },
];

export const mockAdminActivity: AdminActivity[] = [
    { id: 'a1', player_name: 'Martin S.', action: 'Fullførte Sprintøvelser', timestamp: '2024-12-15T14:30:00', points: 25 },
    { id: 'a2', player_name: 'Emma L.', action: 'Fullførte Pasningstrening', timestamp: '2024-12-15T13:45:00', points: 15 },
    { id: 'a3', player_name: 'Ella J.', action: 'Fullførte Oppvarming med ball', timestamp: '2024-12-15T12:00:00', points: 10 },
    { id: 'a4', player_name: 'Jonas K.', action: 'Ny streak-rekord: 15 dager', timestamp: '2024-12-14T18:00:00' },
    { id: 'a5', player_name: 'Oliver T.', action: 'Fullførte Planken', timestamp: '2024-12-14T16:30:00', points: 15 },
    { id: 'a6', player_name: 'Sofia M.', action: 'Fullførte Stretching', timestamp: '2024-12-13T17:00:00', points: 10 },
    { id: 'a7', player_name: 'Aksel H.', action: 'Fullførte Styrke: Knebøy', timestamp: '2024-12-14T15:00:00', points: 20 },
    { id: 'a8', player_name: 'Nora B.', action: 'Oppnåelse: Ti øvelser', timestamp: '2024-12-12T14:00:00' },
    { id: 'a9', player_name: 'Martin S.', action: 'Fullførte Dribling i kjegle-bane', timestamp: '2024-12-14T11:30:00', points: 30 },
    { id: 'a10', player_name: 'Maja P.', action: 'Fullførte Stige-øvelser', timestamp: '2024-12-14T10:00:00', points: 20 },
    { id: 'a11', player_name: 'Emma L.', action: 'Oppnåelse: Uke-streak', timestamp: '2024-12-13T09:00:00' },
    { id: 'a12', player_name: 'Ella J.', action: 'Fullførte Planken', timestamp: '2024-12-15T08:30:00', points: 15 },
    { id: 'a13', player_name: 'Oliver T.', action: 'Fullførte Sprintøvelser', timestamp: '2024-12-15T07:45:00', points: 25 },
    { id: 'a14', player_name: 'Jonas K.', action: 'Fullførte Pasningstrening', timestamp: '2024-12-14T19:00:00', points: 15 },
    { id: 'a15', player_name: 'Martin S.', action: 'Oppnåelse: Fem hundre poeng', timestamp: '2024-12-13T16:00:00' },
];

export const mockDashboardMetrics: DashboardMetrics = {
    totalPlayers: 12,
    activeLast7Days: 9,
    totalCompletions: 293,
    engagementRate: 75,
};

export const mockStoreExercises: StoreExercise[] = [
    { id: 's1', title: 'Koordinasjonsbane', description: 'Avansert koordinasjonsøvelse med flere stasjoner.', category: 'agility', difficulty: 'hard', duration_seconds: 360, points: 35, rating: 4.8, downloads: 234, author: 'NFF Trenerskolen', is_featured: true },
    { id: 's2', title: 'Heading-teknikk', description: 'Lær riktig heading-teknikk trinn for trinn.', category: 'skill', difficulty: 'medium', duration_seconds: 240, points: 20, rating: 4.5, downloads: 189, author: 'NFF Trenerskolen', is_featured: true },
    { id: 's3', title: 'Styrketrening for unge', description: 'Alderstilpasset styrketrening uten vekter.', category: 'strength', difficulty: 'easy', duration_seconds: 300, points: 15, rating: 4.7, downloads: 312, author: 'Idrettshøgskolen', is_featured: false },
    { id: 's4', title: 'Finter og vendinger', description: 'Mestre ulike finter og vendinger med ball.', category: 'skill', difficulty: 'hard', duration_seconds: 300, points: 30, rating: 4.9, downloads: 456, author: 'NFF Trenerskolen', is_featured: true },
    { id: 's5', title: 'Dynamisk oppvarming', description: 'Moderne oppvarming med dynamiske øvelser.', category: 'warmup', difficulty: 'easy', duration_seconds: 180, points: 10, rating: 4.3, downloads: 567, author: 'Idrettshøgskolen', is_featured: false },
    { id: 's6', title: 'Skuddtrening', description: 'Øv på avslutninger fra ulike vinkler.', category: 'skill', difficulty: 'medium', duration_seconds: 360, points: 25, rating: 4.6, downloads: 345, author: 'NFF Trenerskolen', is_featured: false },
    { id: 's7', title: 'Hurtighet med retningsendring', description: 'Sprint og retningsendring for fotball.', category: 'agility', difficulty: 'medium', duration_seconds: 240, points: 20, rating: 4.4, downloads: 278, author: 'Idrettshøgskolen', is_featured: false },
    { id: 's8', title: 'Kjernemuskulatur', description: 'Styrk kjernemuskulaturen for bedre balanse.', category: 'strength', difficulty: 'medium', duration_seconds: 240, points: 20, rating: 4.2, downloads: 198, author: 'Idrettshøgskolen', is_featured: false },
    { id: 's9', title: 'Yoga for fotball', description: 'Yoga-inspirerte øvelser for fleksibilitet.', category: 'cooldown', difficulty: 'easy', duration_seconds: 420, points: 15, rating: 4.1, downloads: 134, author: 'Idrettshøgskolen', is_featured: false },
    { id: 's10', title: '1-mot-1 situasjoner', description: 'Tren på offensive og defensive 1v1.', category: 'skill', difficulty: 'hard', duration_seconds: 300, points: 30, rating: 4.8, downloads: 389, author: 'NFF Trenerskolen', is_featured: true },
];

export const mockStoreReviews: StoreReview[] = [
    { id: 'r1', exercise_id: 's1', club_name: 'Stavanger IF', rating: 5, comment: 'Fantastisk øvelse! Spillerne elsket den.', created_at: '2024-12-10' },
    { id: 'r2', exercise_id: 's1', club_name: 'Rosenborg BK', rating: 4, comment: 'Bra opplegg, litt avansert for de yngste.', created_at: '2024-12-08' },
    { id: 'r3', exercise_id: 's4', club_name: 'Vålerenga IF', rating: 5, comment: 'Perfekt for teknikk-trening!', created_at: '2024-12-12' },
    { id: 'r4', exercise_id: 's2', club_name: 'Brann', rating: 4, comment: 'Godt forklart og lett å følge.', created_at: '2024-12-05' },
    { id: 'r5', exercise_id: 's10', club_name: 'Viking FK', rating: 5, comment: 'Meget bra 1v1 trening!', created_at: '2024-12-14' },
];

export const mockClubStructure: ClubYearGroup[] = [
    { year: 2013, boys_count: 2, girls_count: 1, total_count: 3 },
    { year: 2014, boys_count: 3, girls_count: 2, total_count: 5 },
    { year: 2015, boys_count: 3, girls_count: 2, total_count: 5 },
    { year: 2016, boys_count: 2, girls_count: 3, total_count: 5 },
];

export const mockReportData = {
    weeklyActivity: [
        { label: 'Man', value: 12 },
        { label: 'Tir', value: 18 },
        { label: 'Ons', value: 15 },
        { label: 'Tor', value: 22 },
        { label: 'Fre', value: 8 },
        { label: 'Lør', value: 25 },
        { label: 'Søn', value: 20 },
    ] as ChartDataPoint[],
    monthlyPoints: [
        { label: 'Jul', value: 450 },
        { label: 'Aug', value: 680 },
        { label: 'Sep', value: 890 },
        { label: 'Okt', value: 1050 },
        { label: 'Nov', value: 980 },
        { label: 'Des', value: 1200 },
    ] as ChartDataPoint[],
    categoryDistribution: [
        { label: 'Oppvarming', value: 18 },
        { label: 'Styrke', value: 25 },
        { label: 'Hurtighet', value: 22 },
        { label: 'Teknikk', value: 28 },
        { label: 'Nedtrapping', value: 7 },
    ] as ChartDataPoint[],
    difficultyDistribution: [
        { label: 'Lett', value: 35 },
        { label: 'Middels', value: 45 },
        { label: 'Vanskelig', value: 20 },
    ] as ChartDataPoint[],
};
