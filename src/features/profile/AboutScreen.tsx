import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card } from '../../components';

export function AboutScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('about.title')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* App icon & name */}
                <View style={styles.appInfo}>
                    <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
                        <MaterialIcons name="sports-soccer" size={48} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.appName, { color: colors.text }]}>
                        FotballTrening
                    </Text>
                    <Text style={[styles.version, { color: colors.textSecondary }]}>
                        {t('about.version')} 1.0.0
                    </Text>
                </View>

                {/* Description */}
                <Card style={styles.descriptionCard}>
                    <Text style={[styles.description, { color: colors.text }]}>
                        {t('about.description')}
                    </Text>
                </Card>

                {/* Info rows */}
                <Card style={styles.infoCard}>
                    <View style={[styles.infoRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                        <MaterialIcons name="code" size={20} color={colors.textSecondary} />
                        <Text style={[styles.infoLabel, { color: colors.text }]}>
                            {t('about.developer')}
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                            FotballTrening AS
                        </Text>
                    </View>
                    <View style={[styles.infoRow, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                        <MaterialIcons name="verified" size={20} color={colors.textSecondary} />
                        <Text style={[styles.infoLabel, { color: colors.text }]}>
                            {t('about.version')}
                        </Text>
                        <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                            1.0.0 (1)
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.infoRow}
                        onPress={() => Linking.openURL('https://fotballtrening.no/privacy')}
                    >
                        <MaterialIcons name="privacy-tip" size={20} color={colors.textSecondary} />
                        <Text style={[styles.infoLabel, { color: colors.text }]}>
                            {t('about.privacy')}
                        </Text>
                        <MaterialIcons name="chevron-right" size={24} color={colors.textTertiary} />
                    </TouchableOpacity>
                </Card>

                <Text style={[styles.copyright, { color: colors.textTertiary }]}>
                    {t('about.copyright')}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    appInfo: {
        alignItems: 'center',
        marginVertical: 24,
    },
    appIcon: {
        width: 88,
        height: 88,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: '700',
    },
    version: {
        fontSize: 14,
        marginTop: 4,
    },
    descriptionCard: {
        marginHorizontal: 20,
        marginBottom: 16,
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
    },
    infoCard: {
        marginHorizontal: 20,
        padding: 0,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
    },
    infoLabel: {
        flex: 1,
        fontSize: 16,
    },
    infoValue: {
        fontSize: 14,
    },
    copyright: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 24,
    },
});
