import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Card, Button, Input, useToast } from '../../components';

export function AddYearGroupScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { showToast } = useToast();

    const [year, setYear] = useState('');
    const [hasBoys, setHasBoys] = useState(false);
    const [hasGirls, setHasGirls] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!year.trim()) {
            setError('Fyll inn årstall');
            return;
        }
        if (!hasBoys && !hasGirls) {
            setError('Velg minst ett kjønn');
            return;
        }

        setIsLoading(true);
        setError('');

        await new Promise((resolve) => setTimeout(resolve, 500));

        showToast('Årgang lagt til!', 'success');
        setIsLoading(false);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {t('admin.addYearGroup')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Card style={styles.formCard}>
                        <Input
                            label={t('admin.yearGroup')}
                            value={year}
                            onChangeText={(text) => { setYear(text); setError(''); }}
                            placeholder="f.eks. 2017"
                            keyboardType="numeric"
                        />

                        <Text style={[styles.checkboxLabel, { color: colors.textSecondary }]}>
                            {t('admin.gender')}
                        </Text>

                        <TouchableOpacity
                            onPress={() => { setHasBoys(!hasBoys); setError(''); }}
                            style={styles.checkboxRow}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons
                                name={hasBoys ? 'check-box' : 'check-box-outline-blank'}
                                size={24}
                                color={hasBoys ? colors.primary : colors.textTertiary}
                            />
                            <Text style={[styles.checkboxText, { color: colors.text }]}>
                                Gutter
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { setHasGirls(!hasGirls); setError(''); }}
                            style={styles.checkboxRow}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons
                                name={hasGirls ? 'check-box' : 'check-box-outline-blank'}
                                size={24}
                                color={hasGirls ? colors.primary : colors.textTertiary}
                            />
                            <Text style={[styles.checkboxText, { color: colors.text }]}>
                                Jenter
                            </Text>
                        </TouchableOpacity>

                        {error ? (
                            <Text style={[styles.error, { color: colors.error }]}>
                                {error}
                            </Text>
                        ) : null}

                        <Button
                            title={t('common.save')}
                            onPress={handleSave}
                            loading={isLoading}
                            fullWidth
                            size="large"
                            style={styles.saveButton}
                        />
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
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
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    formCard: {
        marginBottom: 24,
    },
    checkboxLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 8,
    },
    checkboxText: {
        fontSize: 16,
    },
    error: {
        fontSize: 14,
        marginBottom: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    saveButton: {
        marginTop: 16,
    },
});
