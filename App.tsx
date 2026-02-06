import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from './src/lib/theme';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ToastProvider } from './src/components';
import { useAuthStore } from './src/stores';

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
  const { setLoading } = useAuthStore();

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      // In production, this would check Supabase session
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
