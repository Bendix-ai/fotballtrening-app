import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { AchievementDefinition } from '../../types';

interface AchievementDetailModalProps {
    visible: boolean;
    achievement: AchievementDefinition | null;
    unlocked: boolean;
    onClose: () => void;
}

export function AchievementDetailModal({
    visible,
    achievement,
    unlocked,
    onClose,
}: AchievementDetailModalProps) {
    const { colors } = useTheme();

    if (!achievement) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modal, { backgroundColor: colors.card }]}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    {
                                        backgroundColor: unlocked
                                            ? colors.primaryLight
                                            : colors.surface,
                                        borderColor: unlocked
                                            ? colors.primary
                                            : colors.border,
                                    },
                                ]}
                            >
                                <MaterialIcons
                                    name={unlocked ? (achievement.icon as any) : 'lock'}
                                    size={40}
                                    color={unlocked ? colors.primary : colors.textTertiary}
                                />
                            </View>

                            <Text style={[styles.title, { color: colors.text }]}>
                                {achievement.title}
                            </Text>

                            <Text style={[styles.description, { color: colors.textSecondary }]}>
                                {achievement.description}
                            </Text>

                            <View style={[styles.bonusRow, { backgroundColor: colors.surface }]}>
                                <MaterialIcons name="star" size={18} color={colors.accent} />
                                <Text style={[styles.bonusText, { color: colors.text }]}>
                                    +{achievement.points_bonus} {t('exercises.points')}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        backgroundColor: unlocked
                                            ? colors.success + '20'
                                            : colors.surface,
                                    },
                                ]}
                            >
                                <MaterialIcons
                                    name={unlocked ? 'check-circle' : 'lock-outline'}
                                    size={16}
                                    color={unlocked ? colors.success : colors.textTertiary}
                                />
                                <Text
                                    style={[
                                        styles.statusText,
                                        {
                                            color: unlocked
                                                ? colors.success
                                                : colors.textTertiary,
                                        },
                                    ]}
                                >
                                    {unlocked ? t('achievements.unlocked') : t('achievements.locked')}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={onClose}
                                style={[styles.closeButton, { backgroundColor: colors.primary }]}
                            >
                                <Text style={styles.closeButtonText}>
                                    {t('common.ok')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    modal: {
        width: '100%',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 16,
    },
    bonusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 16,
    },
    bonusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 20,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    closeButton: {
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 12,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
