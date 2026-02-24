import { useAdminStore } from '../adminStore';
import { AdminPlayer, Exercise } from '../../types';

const mockPlayer: AdminPlayer = {
  id: 'p1',
  display_name: 'Test Player',
  username: 'test',
  year_group: 2015,
  gender: 'boys',
  total_points: 100,
  exercises_completed: 5,
  current_streak: 3,
  longest_streak: 7,
  last_active: '2026-01-01',
  is_active: true,
};

const mockExercise: Exercise = {
  id: 'e1',
  title: 'Test Exercise',
  description: 'A test',
  category: 'warmup',
  difficulty: 'easy',
  points: 10,
  duration_seconds: 900,
  equipment: 'Ball',
  instructions: 'Do the thing',
  image_url: null,
  video_url: null,
  is_public: false,
  created_by_club_id: 'c1',
  created_at: '2026-01-01',
};

describe('adminStore', () => {
  beforeEach(() => {
    // Reset to a clean state with known data
    useAdminStore.setState({
      players: [mockPlayer],
      clubExercises: [mockExercise],
      playerYearFilter: null,
      playerGenderFilter: null,
      exerciseCategoryFilter: null,
    });
  });

  describe('player CRUD', () => {
    it('should add a player', () => {
      const newPlayer = { ...mockPlayer, id: 'p2', display_name: 'New Player' };
      useAdminStore.getState().addPlayer(newPlayer);

      expect(useAdminStore.getState().players).toHaveLength(2);
      expect(useAdminStore.getState().players[1].id).toBe('p2');
    });

    it('should update a player', () => {
      useAdminStore.getState().updatePlayer('p1', { total_points: 200 });

      const player = useAdminStore.getState().players.find(p => p.id === 'p1');
      expect(player?.total_points).toBe(200);
      expect(player?.display_name).toBe('Test Player'); // unchanged
    });

    it('should delete a player', () => {
      useAdminStore.getState().deletePlayer('p1');
      expect(useAdminStore.getState().players).toHaveLength(0);
    });

    it('should not affect other players on delete', () => {
      useAdminStore.setState({
        players: [
          mockPlayer,
          { ...mockPlayer, id: 'p2', display_name: 'Other' },
        ],
      });

      useAdminStore.getState().deletePlayer('p1');
      expect(useAdminStore.getState().players).toHaveLength(1);
      expect(useAdminStore.getState().players[0].id).toBe('p2');
    });
  });

  describe('exercise CRUD', () => {
    it('should add an exercise', () => {
      const newExercise = { ...mockExercise, id: 'e2', title: 'New Exercise' };
      useAdminStore.getState().addExercise(newExercise);

      expect(useAdminStore.getState().clubExercises).toHaveLength(2);
    });

    it('should update an exercise', () => {
      useAdminStore.getState().updateExercise('e1', { title: 'Updated' });

      const exercise = useAdminStore.getState().clubExercises.find(e => e.id === 'e1');
      expect(exercise?.title).toBe('Updated');
      expect(exercise?.category).toBe('warmup'); // unchanged
    });

    it('should delete an exercise', () => {
      useAdminStore.getState().deleteExercise('e1');
      expect(useAdminStore.getState().clubExercises).toHaveLength(0);
    });
  });

  describe('filters', () => {
    it('should set player year filter', () => {
      useAdminStore.getState().setPlayerYearFilter(2015);
      expect(useAdminStore.getState().playerYearFilter).toBe(2015);
    });

    it('should set player gender filter', () => {
      useAdminStore.getState().setPlayerGenderFilter('girls');
      expect(useAdminStore.getState().playerGenderFilter).toBe('girls');
    });

    it('should set exercise category filter', () => {
      useAdminStore.getState().setExerciseCategoryFilter('strength');
      expect(useAdminStore.getState().exerciseCategoryFilter).toBe('strength');
    });

    it('should clear filters with null', () => {
      useAdminStore.getState().setPlayerYearFilter(2015);
      useAdminStore.getState().setPlayerYearFilter(null);
      expect(useAdminStore.getState().playerYearFilter).toBeNull();
    });
  });

  describe('getFilteredPlayers', () => {
    beforeEach(() => {
      useAdminStore.setState({
        players: [
          { ...mockPlayer, id: 'p1', year_group: 2015, gender: 'boys' },
          { ...mockPlayer, id: 'p2', year_group: 2015, gender: 'girls' },
          { ...mockPlayer, id: 'p3', year_group: 2014, gender: 'boys' },
        ],
      });
    });

    it('should return all without filters', () => {
      expect(useAdminStore.getState().getFilteredPlayers()).toHaveLength(3);
    });

    it('should filter by year', () => {
      useAdminStore.getState().setPlayerYearFilter(2015);
      const filtered = useAdminStore.getState().getFilteredPlayers();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(p => p.year_group === 2015)).toBe(true);
    });

    it('should filter by gender', () => {
      useAdminStore.getState().setPlayerGenderFilter('boys');
      const filtered = useAdminStore.getState().getFilteredPlayers();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(p => p.gender === 'boys')).toBe(true);
    });

    it('should combine year and gender filters', () => {
      useAdminStore.getState().setPlayerYearFilter(2015);
      useAdminStore.getState().setPlayerGenderFilter('boys');
      const filtered = useAdminStore.getState().getFilteredPlayers();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('p1');
    });
  });

  describe('getFilteredExercises', () => {
    beforeEach(() => {
      useAdminStore.setState({
        clubExercises: [
          { ...mockExercise, id: 'e1', category: 'warmup' },
          { ...mockExercise, id: 'e2', category: 'strength' },
          { ...mockExercise, id: 'e3', category: 'warmup' },
        ],
      });
    });

    it('should return all without filter', () => {
      expect(useAdminStore.getState().getFilteredExercises()).toHaveLength(3);
    });

    it('should filter by category', () => {
      useAdminStore.getState().setExerciseCategoryFilter('warmup');
      const filtered = useAdminStore.getState().getFilteredExercises();
      expect(filtered).toHaveLength(2);
      expect(filtered.every(e => e.category === 'warmup')).toBe(true);
    });
  });
});
