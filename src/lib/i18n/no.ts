// Norwegian translations for the app
export const no = {
    // Common
    common: {
        loading: 'Laster...',
        error: 'Noe gikk galt',
        retry: 'Prøv igjen',
        cancel: 'Avbryt',
        save: 'Lagre',
        delete: 'Slett',
        edit: 'Rediger',
        back: 'Tilbake',
        next: 'Neste',
        done: 'Ferdig',
        yes: 'Ja',
        no: 'Nei',
        ok: 'OK',
    },

    // Onboarding
    onboarding: {
        welcome: 'Velkommen til FotballTrening!',
        subtitle: 'Tren smartere, konkurrer med lagkamerater',
        selectClub: 'Velg din klubb',
        selectTeam: 'Velg ditt lag',
        getStarted: 'Kom i gang',
        skip: 'Hopp over',
    },

    // Auth
    auth: {
        login: 'Logg inn',
        logout: 'Logg ut',
        username: 'Brukernavn',
        password: 'Passord',
        forgotPassword: 'Glemt passord?',
        loginButton: 'Logg inn',
        loginError: 'Feil brukernavn eller passord',
        welcomeBack: 'Velkommen tilbake!',
    },

    // Navigation tabs
    tabs: {
        home: 'Hjem',
        exercises: 'Øvelser',
        leaderboard: 'Toppliste',
        profile: 'Profil',
    },

    // Home screen
    home: {
        greeting: 'Hei',
        todayProgress: 'Dagens fremgang',
        exercises: 'øvelser',
        points: 'poeng',
        currentStreak: 'Nåværende streak',
        days: 'dager',
        quickStart: 'Hurtigstart',
        viewAll: 'Se alle',
        keepGoing: 'Fortsett sånn!',
        startTraining: 'Start trening',
    },

    // Exercises
    exercises: {
        title: 'Øvelser',
        all: 'Alle',
        warmup: 'Oppvarming',
        strength: 'Styrke',
        agility: 'Hurtighet',
        skill: 'Teknikk',
        cooldown: 'Nedtrapping',
        difficulty: 'Vanskelighetsgrad',
        easy: 'Lett',
        medium: 'Middels',
        hard: 'Vanskelig',
        duration: 'Varighet',
        seconds: 'sekunder',
        minutes: 'minutter',
        points: 'poeng',
        start: 'Start øvelse',
        complete: 'Fullfør',
        instructions: 'Instruksjoner',
        completed: 'Fullført!',
        pointsEarned: 'Du fikk {points} poeng!',
        greatJob: 'Bra jobbet!',
        continueTraining: 'Fortsett trening',
        backToExercises: 'Tilbake til øvelser',
    },

    // Leaderboard
    leaderboard: {
        title: 'Toppliste',
        club: 'Klubb',
        yearGroup: 'Årgang',
        team: 'Lag',
        thisWeek: 'Denne uken',
        thisMonth: 'Denne måneden',
        allTime: 'Totalt',
        rank: 'Plass',
        player: 'Spiller',
        points: 'Poeng',
        you: 'Deg',
        noData: 'Ingen data ennå',
    },

    // Profile
    profile: {
        title: 'Min profil',
        totalPoints: 'Totale poeng',
        exercisesCompleted: 'Øvelser fullført',
        currentStreak: 'Nåværende streak',
        longestStreak: 'Lengste streak',
        achievements: 'Oppnåelser',
        viewAll: 'Se alle',
        settings: 'Innstillinger',
        days: 'dager',
    },

    // Achievements
    achievements: {
        title: 'Oppnåelser',
        locked: 'Låst',
        unlocked: 'Ulåst',
        first_exercise: 'Første øvelse',
        first_exercise_desc: 'Fullfør din første øvelse',
        streak_7: 'Uke-streak',
        streak_7_desc: 'Hold streaken i 7 dager',
        streak_30: 'Måneds-streak',
        streak_30_desc: 'Hold streaken i 30 dager',
        points_100: 'Hundre poeng',
        points_100_desc: 'Tjen 100 poeng',
        points_500: 'Fem hundre',
        points_500_desc: 'Tjen 500 poeng',
        points_1000: 'Tusen poeng',
        points_1000_desc: 'Tjen 1000 poeng',
        exercises_10: 'Ti øvelser',
        exercises_10_desc: 'Fullfør 10 øvelser',
        exercises_50: 'Femti øvelser',
        exercises_50_desc: 'Fullfør 50 øvelser',
        all_categories: 'Allsidig',
        all_categories_desc: 'Prøv alle øvelseskategorier',
    },

    // Settings
    settings: {
        title: 'Innstillinger',
        appearance: 'Utseende',
        theme: 'Tema',
        light: 'Lyst',
        dark: 'Mørkt',
        system: 'System',
        notifications: 'Varsler',
        enableNotifications: 'Aktiver varsler',
        about: 'Om appen',
        version: 'Versjon',
        logout: 'Logg ut',
        logoutConfirm: 'Er du sikker på at du vil logge ut?',
    },

    // Admin
    admin: {
        dashboard: 'Admin Dashboard',
        players: 'Spillere',
        exercises: 'Øvelser',
        addPlayer: 'Legg til spiller',
        addExercise: 'Legg til øvelse',
        totalPlayers: 'Totalt spillere',
        activeToday: 'Aktive i dag',
        exercisesToday: 'Øvelser i dag',
    },

    // Streak
    streak: {
        title: 'Streak 🔥',
        keepItUp: 'Fortsett sånn!',
        broken: 'Streak brutt',
        newRecord: 'Ny rekord!',
    },
};

export type Translations = typeof no;
export default no;
