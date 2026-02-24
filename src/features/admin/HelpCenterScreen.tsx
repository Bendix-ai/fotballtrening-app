import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card } from '../../components';

interface FAQItem {
    question: string;
    answer: string;
    icon: keyof typeof MaterialIcons.glyphMap;
}

const faqItems: FAQItem[] = [
    {
        question: 'helpCenter.faqAddPlayers',
        answer: 'helpCenter.faqAddPlayersAnswer',
        icon: 'people',
    },
    {
        question: 'helpCenter.faqAddExercises',
        answer: 'helpCenter.faqAddExercisesAnswer',
        icon: 'fitness-center',
    },
    {
        question: 'helpCenter.faqStore',
        answer: 'helpCenter.faqStoreAnswer',
        icon: 'store',
    },
    {
        question: 'helpCenter.faqReports',
        answer: 'helpCenter.faqReportsAnswer',
        icon: 'bar-chart',
    },
    {
        question: 'helpCenter.faqPlayerLogin',
        answer: 'helpCenter.faqPlayerLoginAnswer',
        icon: 'login',
    },
    {
        question: 'helpCenter.faqResetPassword',
        answer: 'helpCenter.faqResetPasswordAnswer',
        icon: 'lock-reset',
    },
];

export function HelpCenterScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    {t('helpCenter.title')}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Getting started */}
                <Card style={styles.introCard}>
                    <MaterialIcons name="lightbulb" size={32} color={colors.primary} />
                    <Text style={[styles.introTitle, { color: colors.text }]}>
                        {t('helpCenter.gettingStarted')}
                    </Text>
                    <Text style={[styles.introDesc, { color: colors.textSecondary }]}>
                        {t('helpCenter.gettingStartedDesc')}
                    </Text>
                </Card>

                {/* Quick steps */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {t('helpCenter.quickSteps')}
                </Text>
                <Card style={styles.stepsCard}>
                    {['helpCenter.step1', 'helpCenter.step2', 'helpCenter.step3', 'helpCenter.step4'].map((key, i) => (
                        <View key={key} style={[styles.stepRow, i < 3 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                            <View style={[styles.stepNumber, { backgroundColor: colors.primaryLight }]}>
                                <Text style={[styles.stepNumberText, { color: colors.primary }]}>{i + 1}</Text>
                            </View>
                            <Text style={[styles.stepText, { color: colors.text }]}>
                                {t(key)}
                            </Text>
                        </View>
                    ))}
                </Card>

                {/* FAQ */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {t('helpCenter.faq')}
                </Text>
                {faqItems.map((item, index) => {
                    const isExpanded = expandedIndex === index;
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setExpandedIndex(isExpanded ? null : index)}
                            activeOpacity={0.7}
                        >
                            <Card style={styles.faqCard}>
                                <View style={styles.faqHeader}>
                                    <MaterialIcons name={item.icon} size={20} color={colors.primary} />
                                    <Text style={[styles.faqQuestion, { color: colors.text }]}>
                                        {t(item.question)}
                                    </Text>
                                    <MaterialIcons
                                        name={isExpanded ? 'expand-less' : 'expand-more'}
                                        size={24}
                                        color={colors.textSecondary}
                                    />
                                </View>
                                {isExpanded && (
                                    <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                                        {t(item.answer)}
                                    </Text>
                                )}
                            </Card>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    introCard: {
        alignItems: 'center',
        paddingVertical: 24,
        marginBottom: 24,
    },
    introTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 12,
    },
    introDesc: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
        paddingHorizontal: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    stepsCard: {
        padding: 0,
        marginBottom: 24,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        fontSize: 14,
        fontWeight: '700',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    faqCard: {
        marginBottom: 8,
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    faqQuestion: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
    },
    faqAnswer: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 12,
        paddingLeft: 30,
    },
});
