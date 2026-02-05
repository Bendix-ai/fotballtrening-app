import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Supabase configuration
// TODO: Replace with your actual Supabase URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Custom storage adapter using SecureStore for sensitive data
const ExpoSecureStoreAdapter = {
    getItem: async (key: string) => {
        try {
            return await SecureStore.getItemAsync(key);
        } catch {
            // SecureStore can fail on some devices, fallback to AsyncStorage
            return await AsyncStorage.getItem(key);
        }
    },
    setItem: async (key: string, value: string) => {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch {
            await AsyncStorage.setItem(key, value);
        }
    },
    removeItem: async (key: string) => {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch {
            await AsyncStorage.removeItem(key);
        }
    },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabaseUrl !== 'https://your-project.supabase.co' &&
        supabaseAnonKey !== 'your-anon-key';
};
