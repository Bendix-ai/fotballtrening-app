// Design tokens from docs/ux-design/design-system.md
// Centralized source of truth for all visual design values

export const colors = {
  primary: {
    light: '#4CAF50',
    main: '#2E7D32',
    dark: '#1B5E20',
  },
  secondary: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#9E9E9E',
    disabled: '#BDBDBD',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#EEEEEE',
  },
  border: {
    default: '#E0E0E0',
    focus: '#2E7D32',
    error: '#F44336',
  },
  leaderboard: {
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  },
  gradient: {
    primary: { start: '#2E7D32', end: '#4CAF50' },
    achievement: { start: '#FF9800', end: '#FFB74D' },
  },
  dark: {
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      tertiary: '#808080',
      disabled: '#606060',
    },
    background: {
      primary: '#121212',
      secondary: '#1E1E1E',
      tertiary: '#2C2C2C',
    },
    border: {
      default: '#3A3A3A',
      focus: '#4CAF50',
      error: '#F44336',
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  bodyLarge: { fontSize: 17, fontWeight: '400' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 18 },
} as const;

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: 9999,
} as const;

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 3.0,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 5.0,
    elevation: 4,
  },
} as const;
