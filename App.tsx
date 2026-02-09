import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from './src/lib/theme';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ToastProvider, ErrorBoundary } from './src/components';
import { useAuthStore } from './src/stores';
import { initSentry, Sentry } from './src/lib/sentry';

// Initialize Sentry for crash reporting
initSentry();

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AppContent() {
  const { isDark } = useTheme();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ToastProvider>
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </ToastProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
