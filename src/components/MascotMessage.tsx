import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Mascot } from './Mascot';
import { useTheme } from '../lib/theme';
import { MascotState } from '../types';

interface MascotMessageProps {
    message: string;
    state: MascotState;
    onDismiss?: () => void;
    testID?: string;
}

const MASCOT_SIZE = 60;
const TRIANGLE_SIZE = 10;

export function MascotMessage({
    message,
    state,
    onDismiss,
    testID = 'mascot-message',
}: MascotMessageProps) {
    const { colors } = useTheme();
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [slideAnim]);

    return (
        <Animated.View
            testID={testID}
            style={[
                styles.container,
                { transform: [{ translateX: slideAnim }] },
            ]}
        >
            <View style={styles.mascotWrapper}>
                <Mascot state={state} size={MASCOT_SIZE} />
            </View>

            <View style={styles.bubbleContainer}>
                {/* Triangle pointer */}
                <View
                    style={[
                        styles.triangle,
                        { borderRightColor: colors.card },
                    ]}
                />

                {/* Speech bubble */}
                <View
                    style={[
                        styles.bubble,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Text
                        testID="mascot-message-text"
                        style={[styles.messageText, { color: colors.text }]}
                    >
                        {message}
                    </Text>

                    {onDismiss && (
                        <TouchableOpacity
                            testID="mascot-message-dismiss"
                            style={styles.dismissButton}
                            onPress={onDismiss}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <MaterialIcons
                                name="close"
                                size={16}
                                color={colors.textTertiary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    mascotWrapper: {
        marginRight: 4,
        zIndex: 1,
    },
    bubbleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    triangle: {
        width: 0,
        height: 0,
        borderTopWidth: TRIANGLE_SIZE,
        borderBottomWidth: TRIANGLE_SIZE,
        borderRightWidth: TRIANGLE_SIZE,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    bubble: {
        flex: 1,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        position: 'relative',
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
        paddingRight: 20,
    },
    dismissButton: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});
