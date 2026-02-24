import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { StreakBadge, StreakCard } from '../Streak';

describe('StreakBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with days count', () => {
    render(<StreakBadge days={5} />);
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('should render the streak badge testID', () => {
    render(<StreakBadge days={3} />);
    expect(screen.getByTestId('streak-badge')).toBeTruthy();
  });

  it('should return null when days is 0', () => {
    const { toJSON } = render(<StreakBadge days={0} />);
    expect(toJSON()).toBeNull();
  });

  it('should render the fire icon', () => {
    render(<StreakBadge days={7} />);
    // The mocked MaterialIcons renders the icon name as text
    expect(screen.getByText('local-fire-department')).toBeTruthy();
  });

  it('should render with small size', () => {
    render(<StreakBadge days={3} size="small" />);
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByTestId('streak-badge')).toBeTruthy();
  });

  it('should render with medium size (default)', () => {
    render(<StreakBadge days={5} />);
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('should render with large size', () => {
    render(<StreakBadge days={10} size="large" />);
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByTestId('streak-badge')).toBeTruthy();
  });

  it('should have an accessibility label', () => {
    render(<StreakBadge days={5} />);
    const badge = screen.getByTestId('streak-badge');
    expect(badge.props.accessibilityLabel).toContain('5');
  });
});

describe('StreakCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with testID', () => {
    render(<StreakCard currentStreak={5} longestStreak={10} />);
    expect(screen.getByTestId('streak-card')).toBeTruthy();
  });

  it('should display the current streak count', () => {
    render(<StreakCard currentStreak={7} longestStreak={14} />);
    expect(screen.getByText('7')).toBeTruthy();
  });

  it('should display the longest streak', () => {
    render(<StreakCard currentStreak={3} longestStreak={21} />);
    // The longest streak is displayed as "{longestStreak} {t('home.days')}"
    // t('home.days') = 'dager'
    expect(screen.getByText(/21/)).toBeTruthy();
  });

  it('should display motivation text when current streak is greater than 0', () => {
    render(<StreakCard currentStreak={5} longestStreak={10} />);
    // t('streak.keepItUp') = 'Fortsett sånn!'
    expect(screen.getByText('Fortsett sånn!')).toBeTruthy();
  });

  it('should not display motivation text when current streak is 0', () => {
    render(<StreakCard currentStreak={0} longestStreak={10} />);
    expect(screen.queryByText('Fortsett sånn!')).toBeNull();
  });

  it('should display the fire icon', () => {
    render(<StreakCard currentStreak={3} longestStreak={5} />);
    expect(screen.getByText('local-fire-department')).toBeTruthy();
  });

  it('should render "dager" label', () => {
    render(<StreakCard currentStreak={5} longestStreak={10} />);
    // t('home.days') = 'dager'
    expect(screen.getAllByText('dager').length).toBeGreaterThan(0);
  });

  it('should render longest streak label', () => {
    render(<StreakCard currentStreak={5} longestStreak={10} />);
    // t('profile.longestStreak') = 'Lengste streak'
    expect(screen.getByText('Lengste streak')).toBeTruthy();
  });
});
