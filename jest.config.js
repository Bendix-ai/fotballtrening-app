module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|native-base|react-native-svg|nativewind|react-native-css-interop|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@supabase/.*|react-native-url-polyfill|react-native-chart-kit|react-native-worklets|zustand|@tanstack)',
  ],
  setupFiles: ['./jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**/*',
    '!src/data/**/*',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  fakeTimers: {
    enableGlobally: false,
  },
  forceExit: true,
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 35,
      lines: 30,
      statements: 30,
    },
  },
};
