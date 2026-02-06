import { create } from 'zustand';
import { AdminPlayer, Exercise, ExerciseCategory, Gender } from '../types';
import { mockAdminPlayers, mockExercises } from '../data/mockData';

interface AdminState {
    players: AdminPlayer[];
    clubExercises: Exercise[];

    // Filters
    playerYearFilter: number | null;
    playerGenderFilter: Gender | null;
    exerciseCategoryFilter: ExerciseCategory | null;

    // Player CRUD
    addPlayer: (player: AdminPlayer) => void;
    updatePlayer: (id: string, data: Partial<AdminPlayer>) => void;
    deletePlayer: (id: string) => void;

    // Exercise management
    addExercise: (exercise: Exercise) => void;
    updateExercise: (id: string, data: Partial<Exercise>) => void;
    deleteExercise: (id: string) => void;

    // Filters
    setPlayerYearFilter: (year: number | null) => void;
    setPlayerGenderFilter: (gender: Gender | null) => void;
    setExerciseCategoryFilter: (category: ExerciseCategory | null) => void;

    getFilteredPlayers: () => AdminPlayer[];
    getFilteredExercises: () => Exercise[];
}

export const useAdminStore = create<AdminState>()((set, get) => ({
    players: mockAdminPlayers,
    clubExercises: [...mockExercises],

    playerYearFilter: null,
    playerGenderFilter: null,
    exerciseCategoryFilter: null,

    addPlayer: (player) =>
        set((state) => ({ players: [...state.players, player] })),

    updatePlayer: (id, data) =>
        set((state) => ({
            players: state.players.map((p) =>
                p.id === id ? { ...p, ...data } : p
            ),
        })),

    deletePlayer: (id) =>
        set((state) => ({
            players: state.players.filter((p) => p.id !== id),
        })),

    addExercise: (exercise) =>
        set((state) => ({ clubExercises: [...state.clubExercises, exercise] })),

    updateExercise: (id, data) =>
        set((state) => ({
            clubExercises: state.clubExercises.map((e) =>
                e.id === id ? { ...e, ...data } : e
            ),
        })),

    deleteExercise: (id) =>
        set((state) => ({
            clubExercises: state.clubExercises.filter((e) => e.id !== id),
        })),

    setPlayerYearFilter: (year) => set({ playerYearFilter: year }),
    setPlayerGenderFilter: (gender) => set({ playerGenderFilter: gender }),
    setExerciseCategoryFilter: (category) => set({ exerciseCategoryFilter: category }),

    getFilteredPlayers: () => {
        const { players, playerYearFilter, playerGenderFilter } = get();
        return players.filter((p) => {
            if (playerYearFilter && p.year_group !== playerYearFilter) return false;
            if (playerGenderFilter && p.gender !== playerGenderFilter) return false;
            return true;
        });
    },

    getFilteredExercises: () => {
        const { clubExercises, exerciseCategoryFilter } = get();
        if (!exerciseCategoryFilter) return clubExercises;
        return clubExercises.filter((e) => e.category === exerciseCategoryFilter);
    },
}));
