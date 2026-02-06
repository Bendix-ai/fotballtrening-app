import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { AdminHeader, Card, Button, useToast } from '../../components';
import { mockReportData, mockDashboardMetrics } from '../../data/mockData';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type DateRange = '7d' | '30d' | '90d';

const dateRanges: { key: DateRange; label: string }[] = [
    { key: '7d', label: 'last7Days' },
    { key: '30d', label: 'last30Days' },
    { key: '90d', label: 'last90Days' },
];

export function ReportsScreen() {
    const { colors } = useTheme();
    const { showToast } = useToast();
    const [selectedRange, setSelectedRange] = useState<DateRange>('30d');

    const chartConfig = {
        backgroundColor: colors.card,
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        decimalCount: 0,
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
        labelColor: () => colors.textSecondary,
        propsForLabels: {
            fontSize: 11,
        },
        propsForDots: {
            r: '4',
        },
    };

    const activityData = {
        labels: mockReportData.weeklyActivity.map((d) => d.label),
        datasets: [{ data: mockReportData.weeklyActivity.map((d) => d.value) }],
    };

    const pointsData = {
        labels: mockReportData.monthlyPoints.map((d) => d.label),
        datasets: [{ data: mockReportData.monthlyPoints.map((d) => d.value) }],
    };

    const pieColors = ['#2E7D32', '#FF9800', '#2196F3', '#E91E63', '#9C27B0'];
    const pieData = mockReportData.categoryDistribution.map((d, i) => ({
        name: d.label,
        value: d.value,
        color: pieColors[i % pieColors.length],
        legendFontColor: colors.textSecondary,
        legendFontSize: 12,
    }));

    const difficultyData = {
        labels: mockReportData.difficultyDistribution.map((d) => d.label),
        datasets: [{ data: mockReportData.difficultyDistribution.map((d) => d.value) }],
    };

    const handleExport = (format: string) => {
        showToast(t('admin.exportSuccess'), 'success');
    };

    const chartWidth = screenWidth - 80;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <AdminHeader title={t('admin.reports')} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Date Range Filter */}
                <View style={[styles.rangeFilter, { backgroundColor: colors.surface }]}>
                    {dateRanges.map((range) => (
                        <TouchableOpacity
                            key={range.key}
                            onPress={() => setSelectedRange(range.key)}
                            style={[
                                styles.rangeButton,
                                {
                                    backgroundColor: selectedRange === range.key ? colors.primary : 'transparent',
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.rangeText,
                                    { color: selectedRange === range.key ? '#ffffff' : colors.textSecondary },
                                ]}
                            >
                                {t(`admin.${range.label}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Summary Metrics */}
                <View style={styles.metricsRow}>
                    <Card style={styles.metricCard}>
                        <Text style={[styles.metricValue, { color: colors.primary }]}>
                            {mockDashboardMetrics.totalCompletions}
                        </Text>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                            {t('admin.totalCompletions')}
                        </Text>
                    </Card>
                    <Card style={styles.metricCard}>
                        <Text style={[styles.metricValue, { color: colors.accent }]}>
                            {mockDashboardMetrics.engagementRate}%
                        </Text>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                            {t('admin.engagementRate')}
                        </Text>
                    </Card>
                </View>

                {/* Weekly Activity Chart */}
                <Card style={styles.chartCard}>
                    <Text style={[styles.chartTitle, { color: colors.text }]}>
                        {t('admin.weeklyActivity')}
                    </Text>
                    <BarChart
                        data={activityData}
                        width={chartWidth}
                        height={200}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={chartConfig}
                        style={styles.chart}
                        fromZero
                    />
                </Card>

                {/* Monthly Points Chart */}
                <Card style={styles.chartCard}>
                    <Text style={[styles.chartTitle, { color: colors.text }]}>
                        {t('admin.monthlyPoints')}
                    </Text>
                    <LineChart
                        data={pointsData}
                        width={chartWidth}
                        height={200}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={chartConfig}
                        style={styles.chart}
                        bezier
                    />
                </Card>

                {/* Category Distribution */}
                <Card style={styles.chartCard}>
                    <Text style={[styles.chartTitle, { color: colors.text }]}>
                        {t('admin.categoryDistribution')}
                    </Text>
                    <PieChart
                        data={pieData}
                        width={chartWidth}
                        height={200}
                        chartConfig={chartConfig}
                        accessor="value"
                        backgroundColor="transparent"
                        paddingLeft="15"
                    />
                </Card>

                {/* Difficulty Distribution */}
                <Card style={styles.chartCard}>
                    <Text style={[styles.chartTitle, { color: colors.text }]}>
                        {t('admin.difficultyDistribution')}
                    </Text>
                    <BarChart
                        data={difficultyData}
                        width={chartWidth}
                        height={200}
                        yAxisLabel=""
                        yAxisSuffix="%"
                        chartConfig={{
                            ...chartConfig,
                            color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
                        }}
                        style={styles.chart}
                        fromZero
                    />
                </Card>

                {/* Export Buttons */}
                <View style={styles.exportSection}>
                    <Button
                        title={t('admin.exportPDF')}
                        onPress={() => handleExport('pdf')}
                        fullWidth
                        variant="outline"
                    />
                    <View style={{ height: 12 }} />
                    <Button
                        title={t('admin.exportCSV')}
                        onPress={() => handleExport('csv')}
                        fullWidth
                        variant="outline"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    rangeFilter: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    rangeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    rangeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    metricCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    metricValue: {
        fontSize: 28,
        fontWeight: '700',
    },
    metricLabel: {
        fontSize: 11,
        marginTop: 4,
        textAlign: 'center',
    },
    chartCard: {
        marginBottom: 16,
        paddingVertical: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    chart: {
        borderRadius: 12,
    },
    exportSection: {
        marginTop: 8,
    },
});
