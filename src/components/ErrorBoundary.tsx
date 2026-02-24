import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { captureError } from '../lib/sentry';
import { useTheme } from '../lib/theme';
import { t } from '../lib/i18n';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
    const { colors } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <MaterialIcons name="error-outline" size={64} color={colors.error} />
            <Text style={[styles.title, { color: colors.text }]}>{t('common.error')}</Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>
                {t('common.errorDesc')}
            </Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onRetry}>
                <MaterialIcons name="refresh" size={20} color="#fff" />
                <Text style={styles.buttonText}>{t('common.retry')}</Text>
            </TouchableOpacity>
        </View>
    );
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        captureError(error, { componentStack: errorInfo.componentStack ?? '' });
    }

    handleRetry = () => {
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            return <ErrorFallback onRetry={this.handleRetry} />;
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
