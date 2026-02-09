import { useAppStore } from '../appStore';

describe('appStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      themeMode: 'system',
      hasCompletedOnboarding: false,
      selectedClubId: null,
    });
  });

  describe('initial state', () => {
    it('should have correct defaults', () => {
      const state = useAppStore.getState();
      expect(state.themeMode).toBe('system');
      expect(state.hasCompletedOnboarding).toBe(false);
      expect(state.selectedClubId).toBeNull();
    });
  });

  describe('setThemeMode', () => {
    it('should set to light', () => {
      useAppStore.getState().setThemeMode('light');
      expect(useAppStore.getState().themeMode).toBe('light');
    });

    it('should set to dark', () => {
      useAppStore.getState().setThemeMode('dark');
      expect(useAppStore.getState().themeMode).toBe('dark');
    });

    it('should set to system', () => {
      useAppStore.getState().setThemeMode('light');
      useAppStore.getState().setThemeMode('system');
      expect(useAppStore.getState().themeMode).toBe('system');
    });
  });

  describe('setOnboardingComplete', () => {
    it('should mark onboarding complete', () => {
      useAppStore.getState().setOnboardingComplete(true);
      expect(useAppStore.getState().hasCompletedOnboarding).toBe(true);
    });

    it('should reset onboarding', () => {
      useAppStore.getState().setOnboardingComplete(true);
      useAppStore.getState().setOnboardingComplete(false);
      expect(useAppStore.getState().hasCompletedOnboarding).toBe(false);
    });
  });

  describe('setSelectedClubId', () => {
    it('should set a club ID', () => {
      useAppStore.getState().setSelectedClubId('c1');
      expect(useAppStore.getState().selectedClubId).toBe('c1');
    });

    it('should clear club ID', () => {
      useAppStore.getState().setSelectedClubId('c1');
      useAppStore.getState().setSelectedClubId(null);
      expect(useAppStore.getState().selectedClubId).toBeNull();
    });
  });
});
