import { useExerciseStore } from '../exerciseStore';

describe('exerciseStore', () => {
  beforeEach(() => {
    useExerciseStore.setState({
      completions: [],
      totalPoints: 0,
      favorites: [],
    });
  });

  describe('initial state', () => {
    it('should have correct defaults', () => {
      const state = useExerciseStore.getState();
      expect(state.completions).toEqual([]);
      expect(state.totalPoints).toBe(0);
      expect(state.favorites).toEqual([]);
    });
  });

  describe('addCompletion', () => {
    it('should add a completion and update points', () => {
      const completion = {
        id: 'comp1',
        user_id: 'u1',
        exercise_id: 'e1',
        points_earned: 10,
        completed_at: new Date().toISOString(),
      };

      useExerciseStore.getState().addCompletion(completion);

      const state = useExerciseStore.getState();
      expect(state.completions).toHaveLength(1);
      expect(state.completions[0]).toEqual(completion);
      expect(state.totalPoints).toBe(10);
    });

    it('should accumulate points', () => {
      const now = new Date().toISOString();
      useExerciseStore.getState().addCompletion({
        id: 'c1', user_id: 'u1', exercise_id: 'e1', points_earned: 10, completed_at: now,
      });
      useExerciseStore.getState().addCompletion({
        id: 'c2', user_id: 'u1', exercise_id: 'e2', points_earned: 20, completed_at: now,
      });

      expect(useExerciseStore.getState().totalPoints).toBe(30);
      expect(useExerciseStore.getState().completions).toHaveLength(2);
    });
  });

  describe('toggleFavorite', () => {
    it('should add to favorites', () => {
      useExerciseStore.getState().toggleFavorite('e1');
      expect(useExerciseStore.getState().favorites).toEqual(['e1']);
    });

    it('should remove from favorites', () => {
      useExerciseStore.setState({ favorites: ['e1', 'e2'] });
      useExerciseStore.getState().toggleFavorite('e1');
      expect(useExerciseStore.getState().favorites).toEqual(['e2']);
    });
  });

  describe('isFavorite', () => {
    it('should return true for favorited exercise', () => {
      useExerciseStore.setState({ favorites: ['e1'] });
      expect(useExerciseStore.getState().isFavorite('e1')).toBe(true);
    });

    it('should return false for non-favorited exercise', () => {
      expect(useExerciseStore.getState().isFavorite('e1')).toBe(false);
    });
  });

  describe('getTodayCompletions', () => {
    it('should return only today completions', () => {
      const today = new Date().toISOString();
      const yesterday = new Date(Date.now() - 86400000).toISOString();

      useExerciseStore.setState({
        completions: [
          { id: 'c1', user_id: 'u1', exercise_id: 'e1', points_earned: 10, completed_at: today },
          { id: 'c2', user_id: 'u1', exercise_id: 'e2', points_earned: 20, completed_at: yesterday },
        ],
      });

      const todayCompletions = useExerciseStore.getState().getTodayCompletions();
      expect(todayCompletions).toHaveLength(1);
      expect(todayCompletions[0].id).toBe('c1');
    });
  });

  describe('getTodayPoints', () => {
    it('should sum only today points', () => {
      const today = new Date().toISOString();
      const yesterday = new Date(Date.now() - 86400000).toISOString();

      useExerciseStore.setState({
        completions: [
          { id: 'c1', user_id: 'u1', exercise_id: 'e1', points_earned: 10, completed_at: today },
          { id: 'c2', user_id: 'u1', exercise_id: 'e2', points_earned: 20, completed_at: today },
          { id: 'c3', user_id: 'u1', exercise_id: 'e3', points_earned: 50, completed_at: yesterday },
        ],
      });

      expect(useExerciseStore.getState().getTodayPoints()).toBe(30);
    });

    it('should return 0 with no today completions', () => {
      expect(useExerciseStore.getState().getTodayPoints()).toBe(0);
    });
  });

  describe('getTodayExerciseCount', () => {
    it('should count today exercises', () => {
      const today = new Date().toISOString();

      useExerciseStore.setState({
        completions: [
          { id: 'c1', user_id: 'u1', exercise_id: 'e1', points_earned: 10, completed_at: today },
          { id: 'c2', user_id: 'u1', exercise_id: 'e2', points_earned: 20, completed_at: today },
        ],
      });

      expect(useExerciseStore.getState().getTodayExerciseCount()).toBe(2);
    });
  });
});
