import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/theme';
import { t } from '../lib/i18n';

interface StreakBadgeProps {
    days: number;
    size?: 'small' | 'medium' | 'large';
}

export function StreakBadge({ days, size = 'medium' }: StreakBadgeProps) {
    const { colors } = useTheme();

    const getSize = () => {
        switch (size) {
            case 'small':
                return { padding: 6, fontSize: 12, iconSize: 14 };
            case 'large':
                return { padding: 12, fontSize: 20, iconSize: 28 };
            default:
                return { padding: 8, fontSize: 16, iconSize: 20 };
        }
    };

    const sizeConfig = getSize();

    if (days === 0) {
        return null;
    }

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.streak + '20', // 20% opacity
                    padding: sizeConfig.padding,
                },
            ]}
        >
            <MaterialIcons name="local-fire-department" size={sizeConfig.iconSize} color={colors.streak} />
            <Text
                style={[
                    styles.days,
                    {
                        color: colors.streak,
                        fontSize: sizeConfig.fontSize,
                    },
                ]}
            >
                {days}
            </Text>
        </View>
    );
}

interface StreakCardProps {
    currentStreak: number;
    longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
            ]}
        >
            <View style={styles.cardContent}>
                <View style={styles.streakMain}>
                    <MaterialIcons name="local-fire-department" size={40} color={colors.streak} />
                    <View>
                        <Text style={[styles.streakCount, { color: colors.streak }]}>
                            {currentStreak}
                        </Text>
                        <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
                            {t('home.days')}
                        </Text>
                    </View>
                </View>
                <View style={styles.streakInfo}>
                    <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>
                        {t('profile.longestStreak')}
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                        {longestStreak} {t('home.days')}
                    </Text>
                </View>
            </View>
            {currentStreak > 0 && (
                <Text style={[styles.motivation, { color: colors.primary }]}>
                    {t('streak.keepItUp')}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        gap: 4,
    },
    days: {
        fontWeight: '700',
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    streakMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    flameIcon: {
        fontSize: 40,
    },
    streakCount: {
        fontSize: 32,
        fontWeight: '700',
    },
    streakLabel: {
        fontSize: 14,
    },
    streakInfo: {
        alignItems: 'flex-end',
    },
    infoLabel: {
        fontSize: 12,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    motivation: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});
