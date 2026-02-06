import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../lib/theme';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
    showToast: () => {},
});

export function useToast() {
    return useContext(ToastContext);
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }) {
    const { colors } = useTheme();
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();

        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
            ]).start(() => onDismiss(toast.id));
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const getIcon = (): keyof typeof MaterialIcons.glyphMap => {
        switch (toast.type) {
            case 'success': return 'check-circle';
            case 'error': return 'error';
            case 'info': return 'info';
        }
    };

    const getColor = () => {
        switch (toast.type) {
            case 'success': return colors.success;
            case 'error': return colors.error;
            case 'info': return colors.info;
        }
    };

    return (
        <Animated.View
            style={[
                styles.toast,
                {
                    backgroundColor: colors.card,
                    borderLeftColor: getColor(),
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        >
            <MaterialIcons name={getIcon()} size={20} color={getColor()} />
            <Text style={[styles.toastText, { color: colors.text }]} numberOfLines={2}>
                {toast.message}
            </Text>
        </Animated.View>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const idCounter = useRef(0);
    const insets = useSafeAreaInsets();

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = ++idCounter.current;
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View style={[styles.container, { bottom: insets.bottom + 90 }]}>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
                ))}
            </View>
        </ToastContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        alignItems: 'center',
        gap: 8,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        width: '100%',
    },
    toastText: {
        fontSize: 14,
        flex: 1,
    },
});
