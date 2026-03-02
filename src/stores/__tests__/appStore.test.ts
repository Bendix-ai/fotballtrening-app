import { useAppStore } from '../appStore';

describe('appStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      themeMode: 'system',
      hasCompletedOnboarding: false,
      selectedClubId: null,
      lastLoginYear: null,
      lastLoginGender: null,
      soundEnabled: true,
      streakShieldAvailable: true,
      streakShieldUsedDate: null,
      lastLoginBonusDate: null,
      loginStreak: 0,
    });
  });

  describe('initial state', () => {
    it('should have correct defaults', () => {
      const state = useAppStore.getState();
      expect(state.themeMode).toBe('system');
      expect(state.hasCompletedOnboarding).toBe(false);
      expect(state.selectedClubId).toBeNull();
      expect(state.lastLoginYear).toBeNull();
      expect(state.lastLoginGender).toBeNull();
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

  describe('setLastLoginYear', () => {
    it('should set a year', () => {
      useAppStore.getState().setLastLoginYear('yg-2015');
      expect(useAppStore.getState().lastLoginYear).toBe('yg-2015');
    });

    it('should clear year back to null', () => {
      useAppStore.getState().setLastLoginYear('yg-2015');
      useAppStore.getState().setLastLoginYear(null);
      expect(useAppStore.getState().lastLoginYear).toBeNull();
    });
  });

  describe('setLastLoginGender', () => {
    it('should set a gender', () => {
      useAppStore.getState().setLastLoginGender('boys');
      expect(useAppStore.getState().lastLoginGender).toBe('boys');
    });

    it('should clear gender back to null', () => {
      useAppStore.getState().setLastLoginGender('boys');
      useAppStore.getState().setLastLoginGender(null);
      expect(useAppStore.getState().lastLoginGender).toBeNull();
    });
  });

  describe('soundEnabled', () => {
    it('should default to true', () => {
      expect(useAppStore.getState().soundEnabled).toBe(true);
    });

    it('should disable sound', () => {
      useAppStore.getState().setSoundEnabled(false);
      expect(useAppStore.getState().soundEnabled).toBe(false);
    });

    it('should re-enable sound', () => {
      useAppStore.getState().setSoundEnabled(false);
      useAppStore.getState().setSoundEnabled(true);
      expect(useAppStore.getState().soundEnabled).toBe(true);
    });
  });

  describe('streak shield', () => {
    it('should default streakShieldAvailable to true', () => {
      expect(useAppStore.getState().streakShieldAvailable).toBe(true);
    });

    it('should default streakShieldUsedDate to null', () => {
      expect(useAppStore.getState().streakShieldUsedDate).toBeNull();
    });

    it('should set streakShieldAvailable to false when used', () => {
      useAppStore.getState().useStreakShield();
      expect(useAppStore.getState().streakShieldAvailable).toBe(false);
    });

    it('should set streakShieldUsedDate to today when used', () => {
      const today = new Date().toISOString().split('T')[0];
      useAppStore.getState().useStreakShield();
      expect(useAppStore.getState().streakShieldUsedDate).toBe(today);
    });

    it('should not change streakShieldUsedDate if shield is already used', () => {
      useAppStore.getState().useStreakShield();
      const firstDate = useAppStore.getState().streakShieldUsedDate;
      useAppStore.getState().useStreakShield();
      expect(useAppStore.getState().streakShieldUsedDate).toBe(firstDate);
    });
  });

  describe('login bonus', () => {
    it('should default lastLoginBonusDate to null', () => {
      expect(useAppStore.getState().lastLoginBonusDate).toBeNull();
    });

    it('should default loginStreak to 0', () => {
      expect(useAppStore.getState().loginStreak).toBe(0);
    });

    it('should set lastLoginBonusDate to today when awarded', () => {
      const today = new Date().toISOString().split('T')[0];
      useAppStore.getState().awardLoginBonus();
      expect(useAppStore.getState().lastLoginBonusDate).toBe(today);
    });

    it('should set loginStreak to 1 on first award', () => {
      useAppStore.getState().awardLoginBonus();
      expect(useAppStore.getState().loginStreak).toBe(1);
    });

    it('should not update if already awarded today', () => {
      useAppStore.getState().awardLoginBonus();
      const state1 = useAppStore.getState();
      useAppStore.getState().awardLoginBonus();
      const state2 = useAppStore.getState();
      expect(state2.lastLoginBonusDate).toBe(state1.lastLoginBonusDate);
      expect(state2.loginStreak).toBe(state1.loginStreak);
    });

    it('should increment loginStreak for consecutive days', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      useAppStore.setState({ lastLoginBonusDate: yesterday, loginStreak: 3 });
      useAppStore.getState().awardLoginBonus();
      expect(useAppStore.getState().loginStreak).toBe(4);
    });

    it('should reset loginStreak to 1 if not consecutive', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
      useAppStore.setState({ lastLoginBonusDate: twoDaysAgo, loginStreak: 5 });
      useAppStore.getState().awardLoginBonus();
      expect(useAppStore.getState().loginStreak).toBe(1);
    });
  });
});
