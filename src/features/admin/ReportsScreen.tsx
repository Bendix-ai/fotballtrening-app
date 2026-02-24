import React, { Component, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { MaterialIcons } from '@expo/vector-icons';
import { AdminHeader, Card, Button, useToast } from '../../components';
import { useDashboardMetrics, useReportData } from '../../hooks/useAdmin';
import { useAuthStore } from '../../stores';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

class ChartErrorBoundary extends Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return (
                <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#999', fontSize: 14 }}>Kunne ikke laste diagram</Text>
                </View>
            );
        }
        return this.props.children;
    }
}

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
    const { data: metrics } = useDashboardMetrics();
    const { data: reportData } = useReportData(selectedRange);
    const report = reportData ?? {
        weeklyActivity: [],
        monthlyPoints: [],
        categoryDistribution: [],
        difficultyDistribution: [],
    };
    const dashboardMetrics = metrics ?? { totalCompletions: 0, engagementRate: 0 };

    const hasData = report.weeklyActivity.length > 0 ||
        report.monthlyPoints.length > 0 ||
        report.categoryDistribution.length > 0;

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
        labels: report.weeklyActivity.map((d) => d.label),
        datasets: [{ data: report.weeklyActivity.map((d) => d.value) }],
    };

    const pointsData = {
        labels: report.monthlyPoints.map((d) => d.label),
        datasets: [{ data: report.monthlyPoints.map((d) => d.value) }],
    };

    const pieColors = ['#2E7D32', '#FF9800', '#2196F3', '#E91E63', '#9C27B0'];
    const pieData = report.categoryDistribution.map((d, i) => ({
        name: d.label,
        value: d.value,
        color: pieColors[i % pieColors.length],
        legendFontColor: colors.textSecondary,
        legendFontSize: 12,
    }));

    const difficultyData = {
        labels: report.difficultyDistribution.map((d) => d.label),
        datasets: [{ data: report.difficultyDistribution.map((d) => d.value) }],
    };

    const { club } = useAuthStore();
    const [exporting, setExporting] = useState(false);

    const handleExportPDF = async () => {
        setExporting(true);
        try {
            const rangeLabelMap: Record<DateRange, string> = {
                '7d': t('admin.last7Days'),
                '30d': t('admin.last30Days'),
                '90d': t('admin.last90Days'),
            };

            const tableRows = (data: { label: string; value: number }[], header: string) =>
                data.length === 0
                    ? ''
                    : `<h3>${header}</h3><table><tr><th>Periode</th><th>Verdi</th></tr>${data
                          .map((d) => `<tr><td>${d.label}</td><td>${d.value}</td></tr>`)
                          .join('')}</table>`;

            const html = `
                <html><head><style>
                    body { font-family: -apple-system, sans-serif; padding: 20px; }
                    h1 { color: #2E7D32; } h3 { margin-top: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background: #f5f5f5; font-weight: 600; }
                    .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
                </style></head><body>
                    <h1>${club?.name ?? 'Club'} — ${t('admin.reports')}</h1>
                    <p class="meta">${rangeLabelMap[selectedRange]} | ${new Date().toLocaleDateString()}</p>
                    <p><strong>${t('admin.totalCompletions')}:</strong> ${dashboardMetrics.totalCompletions}</p>
                    <p><strong>${t('admin.engagementRate')}:</strong> ${dashboardMetrics.engagementRate}%</p>
                    ${tableRows(report.weeklyActivity, t('admin.weeklyActivity'))}
                    ${tableRows(report.monthlyPoints, t('admin.monthlyPoints'))}
                    ${tableRows(report.categoryDistribution, t('admin.categoryDistribution'))}
                    ${tableRows(report.difficultyDistribution, t('admin.difficultyDistribution'))}
                </body></html>`;

            const { uri } = await Print.printToFileAsync({ html });
            await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
            showToast(t('admin.exportSuccess'), 'success');
        } catch (err) {
            console.error('PDF export error:', err);
        }
        setExporting(false);
    };

    const handleExportCSV = async () => {
        setExporting(true);
        try {
            const sections: string[] = [];

            const addSection = (title: string, data: { label: string; value: number }[]) => {
                if (data.length === 0) return;
                sections.push(`\n${title}`);
                sections.push('Periode,Verdi');
                data.forEach((d) => sections.push(`${d.label},${d.value}`));
            };

            sections.push(`${club?.name ?? 'Club'} — ${t('admin.reports')}`);
            sections.push(`${t('admin.totalCompletions')},${dashboardMetrics.totalCompletions}`);
            sections.push(`${t('admin.engagementRate')},${dashboardMetrics.engagementRate}%`);

            addSection(t('admin.weeklyActivity'), report.weeklyActivity);
            addSection(t('admin.monthlyPoints'), report.monthlyPoints);
            addSection(t('admin.categoryDistribution'), report.categoryDistribution);
            addSection(t('admin.difficultyDistribution'), report.difficultyDistribution);

            const csvContent = sections.join('\n');
            // Use expo-print to generate a file, then share as CSV
            const html = `<html><body><pre>${csvContent}</pre></body></html>`;
            const { uri } = await Print.printToFileAsync({ html });
            // Rename by sharing with CSV mime type
            await Sharing.shareAsync(uri, { mimeType: 'text/csv', UTI: 'public.comma-separated-values-text' });
            showToast(t('admin.exportSuccess'), 'success');
        } catch (err) {
            console.error('CSV export error:', err);
        }
        setExporting(false);
    };

    const chartWidth = screenWidth - 80;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
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
                            {dashboardMetrics.totalCompletions}
                        </Text>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                            {t('admin.totalCompletions')}
                        </Text>
                    </Card>
                    <Card style={styles.metricCard}>
                        <Text style={[styles.metricValue, { color: colors.accent }]}>
                            {dashboardMetrics.engagementRate}%
                        </Text>
                        <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                            {t('admin.engagementRate')}
                        </Text>
                    </Card>
                </View>

                {hasData ? (
                    <>
                        {/* Weekly Activity Chart */}
                        <Card style={styles.chartCard}>
                            <Text style={[styles.chartTitle, { color: colors.text }]}>
                                {t('admin.weeklyActivity')}
                            </Text>
                            <ChartErrorBoundary>
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
                            </ChartErrorBoundary>
                        </Card>

                        {/* Monthly Points Chart */}
                        <Card style={styles.chartCard}>
                            <Text style={[styles.chartTitle, { color: colors.text }]}>
                                {t('admin.monthlyPoints')}
                            </Text>
                            <ChartErrorBoundary>
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
                            </ChartErrorBoundary>
                        </Card>

                        {/* Category Distribution */}
                        <Card style={styles.chartCard}>
                            <Text style={[styles.chartTitle, { color: colors.text }]}>
                                {t('admin.categoryDistribution')}
                            </Text>
                            <ChartErrorBoundary>
                                <PieChart
                                    data={pieData}
                                    width={chartWidth}
                                    height={200}
                                    chartConfig={chartConfig}
                                    accessor="value"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                />
                            </ChartErrorBoundary>
                        </Card>

                        {/* Difficulty Distribution */}
                        <Card style={styles.chartCard}>
                            <Text style={[styles.chartTitle, { color: colors.text }]}>
                                {t('admin.difficultyDistribution')}
                            </Text>
                            <ChartErrorBoundary>
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
                            </ChartErrorBoundary>
                        </Card>

                        {/* Export Buttons */}
                        <View style={styles.exportSection}>
                            <Button
                                title={t('admin.exportPDF')}
                                onPress={handleExportPDF}
                                loading={exporting}
                                fullWidth
                                variant="outline"
                                testID="export-pdf-button"
                            />
                            <View style={{ height: 12 }} />
                            <Button
                                title={t('admin.exportCSV')}
                                onPress={handleExportCSV}
                                loading={exporting}
                                fullWidth
                                variant="outline"
                                testID="export-csv-button"
                            />
                        </View>
                    </>
                ) : (
                    <Card style={styles.emptyCard}>
                        <MaterialIcons name="bar-chart" size={48} color={colors.textTertiary} />
                        <Text style={[styles.emptyTitle, { color: colors.text }]}>
                            {t('admin.noReportData')}
                        </Text>
                        <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                            {t('admin.noReportDataDesc')}
                        </Text>
                    </Card>
                )}
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
    emptyCard: {
        alignItems: 'center',
        paddingVertical: 48,
        marginTop: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
    },
    emptyDesc: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 20,
        lineHeight: 20,
    },
});
