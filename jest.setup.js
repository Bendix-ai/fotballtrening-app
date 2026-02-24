// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

// Mock expo-blur
jest.mock('expo-blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    BlurView: (props) => React.createElement(View, props),
  };
});

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: true, assets: [] }),
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  MediaTypeOptions: { Images: 'Images' },
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiGet: jest.fn().mockResolvedValue([]),
  multiSet: jest.fn().mockResolvedValue(undefined),
}));

// Mock react-native-url-polyfill
jest.mock('react-native-url-polyfill/auto', () => {});

// Mock @sentry/react-native
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: jest.fn((component) => component),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  withScope: jest.fn((callback) => callback({ setExtra: jest.fn() })),
  setUser: jest.fn(),
  Severity: { Error: 'error', Warning: 'warning', Info: 'info' },
}));

// Mock expo-font
jest.mock('expo-font', () => ({
  isLoaded: jest.fn().mockReturnValue(true),
  loadAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const MockIcon = (props) => React.createElement(Text, { testID: props.testID }, props.name);
  return {
    MaterialIcons: MockIcon,
    Ionicons: MockIcon,
  };
});

// Mock theme
jest.mock('./src/lib/theme', () => ({
  useTheme: () => ({
    colors: {
      background: '#FFFFFF',
      surface: '#F5F5F5',
      card: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      textTertiary: '#A0AEC0',
      textDisabled: '#CBD5E0',
      border: '#E2E8F0',
      primary: '#2E7D32',
      primaryLight: '#E8F5E9',
      primaryDark: '#1B5E20',
      secondary: '#F57C00',
      secondaryLight: '#FFF3E0',
      accent: '#1976D2',
      info: '#1976D2',
      success: '#2E7D32',
      warning: '#F57C00',
      error: '#C62828',
      streak: '#F57C00',
      leaderboardGold: '#FFD700',
      leaderboardSilver: '#C0C0C0',
      leaderboardBronze: '#CD7F32',
    },
    isDark: false,
  }),
  ThemeProvider: ({ children }) => children,
  lightColors: {},
  darkColors: {},
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: require('react-native').ScrollView,
    Slider: require('react-native').View,
    Switch: require('react-native').Switch,
    TextInput: require('react-native').TextInput,
    ToolbarAndroid: require('react-native').View,
    ViewPagerAndroid: require('react-native').View,
    DrawerLayoutAndroid: require('react-native').View,
    WebView: require('react-native').View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: require('react-native').FlatList,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
    TouchableOpacity: require('react-native').TouchableOpacity,
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => insets,
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
      push: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
  };
});

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Mock Supabase client
jest.mock('./src/lib/supabase', () => {
  const mockChain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    then: jest.fn(),
  };

  // Make the chain return a promise-like object
  const mockFrom = jest.fn(() => mockChain);

  return {
    supabase: {
      from: mockFrom,
      auth: {
        signUp: jest.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
        signInWithPassword: jest.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
        signOut: jest.fn().mockResolvedValue({ error: null }),
        getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
      },
      rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
      _mockChain: mockChain,
      _mockFrom: mockFrom,
    },
    isSupabaseConfigured: jest.fn().mockReturnValue(true),
  };
});

// Mock analytics (uses console.log in dev, which is fine for tests)
jest.mock('./src/lib/analytics', () => ({
  logEvent: jest.fn(),
  logScreenView: jest.fn(),
  setUserId: jest.fn(),
  logLogin: jest.fn(),
  logLogout: jest.fn(),
  logExerciseComplete: jest.fn(),
  logExerciseStart: jest.fn(),
  logAchievementUnlocked: jest.fn(),
  logStoreDownload: jest.fn(),
  logPlayerAdded: jest.fn(),
}));

// Silence console warnings in tests
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('act(') || args[0].includes('NativeWind'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};
