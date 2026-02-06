import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { AdminHeader, Card } from '../../components';
import { AdminStackParamList, ClubYearGroup } from '../../types';
import { mockClubStructure } from '../../data/mockData';

type ClubStructureNavProp = NativeStackNavigationProp<AdminStackParamList>;

export function ClubStructureScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation<ClubStructureNavProp>();

    const renderYearGroup = (item: ClubYearGroup) => (
        <Card key={item.year} style={styles.yearCard}>
            <Text style={[styles.yearText, { color: colors.text }]}>
                {item.year}
            </Text>
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Gutter:
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {item.boys_count}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Jenter:
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {item.girls_count}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Totalt:
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {item.total_count}
                    </Text>
                </View>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <AdminHeader title={t('admin.clubStructure')} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Club info card */}
                <Card style={styles.clubCard}>
                    <View style={styles.clubRow}>
                        <View style={[styles.clubIcon, { backgroundColor: colors.primaryLight }]}>
                            <MaterialIcons name="sports-soccer" size={28} color={colors.primary} />
                        </View>
                        <View style={styles.clubInfo}>
                            <Text style={[styles.clubName, { color: colors.text }]}>
                                Våganes IL
                            </Text>
                            <Text style={[styles.clubMeta, { color: colors.textSecondary }]}>
                                {mockClubStructure.length} årganger
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Year groups section */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Årganger
                </Text>

                {mockClubStructure.map(renderYearGroup)}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                onPress={() => navigation.navigate('AddYearGroup')}
                style={[styles.fab, { backgroundColor: colors.primary }]}
            >
                <MaterialIcons name="add" size={28} color="#ffffff" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    clubCard: {
        marginBottom: 20,
    },
    clubRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clubIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clubInfo: {
        marginLeft: 14,
        flex: 1,
    },
    clubName: {
        fontSize: 18,
        fontWeight: '700',
    },
    clubMeta: {
        fontSize: 14,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    yearCard: {
        marginBottom: 10,
    },
    yearText: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statLabel: {
        fontSize: 14,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
