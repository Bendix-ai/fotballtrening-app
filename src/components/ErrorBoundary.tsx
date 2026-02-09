import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { captureError } from '../lib/sentry';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
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
            return (
                <View style={styles.container}>
                    <MaterialIcons name="error-outline" size={64} color="#E53E3E" />
                    <Text style={styles.title}>Noe gikk galt</Text>
                    <Text style={styles.message}>
                        En uventet feil oppstod. Vennligst prøv igjen.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
                        <MaterialIcons name="refresh" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Prøv igjen</Text>
                    </TouchableOpacity>
                </View>
            );
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
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A202C',
        marginTop: 16,
        marginBottom: 8,
    },
    message: {
        fontSize: 15,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#2E7D32',
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
