import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';
import { t } from '../../lib/i18n';
import { Button } from '../../components';
import { useAppStore } from '../../stores';

const { width } = Dimensions.get('window');

interface OnboardingPage {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    description: string;
}

const pages: OnboardingPage[] = [
    {
        icon: 'sports-soccer',
        title: 'Velkommen til FotballTrening!',
        description: 'Tren smartere, konkurrer med lagkamerater, og bli en bedre fotballspiller.',
    },
    {
        icon: 'fitness-center',
        title: 'Slik fungerer det',
        description: 'Velg en ovelse, fullfor den, og tjen poeng! Ovelses er tilpasset ditt niva.',
    },
    {
        icon: 'emoji-events',
        title: 'Konkurrer og vinn',
        description: 'Klatr pa topplisten, las opp prestasjoner, og hold streaken din i gang!',
    },
];

export function OnboardingScreen() {
    const { colors } = useTheme();
    const { setOnboardingComplete } = useAppStore();
    const flatListRef = useRef<FlatList>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const isLastPage = currentPage === pages.length - 1;

    const handleNext = () => {
        if (isLastPage) {
            setOnboardingComplete(true);
        } else {
            flatListRef.current?.scrollToOffset({
                offset: (currentPage + 1) * width,
                animated: true,
            });
        }
    };

    const handleSkip = () => {
        setOnboardingComplete(true);
    };

    const renderPage = ({ item }: { item: OnboardingPage }) => (
        <View style={[styles.page, { width }]}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
                <MaterialIcons name={item.icon} size={80} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
                {item.description}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Skip button */}
            <View style={styles.header}>
                {!isLastPage ? (
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={[styles.skipText, { color: colors.textSecondary }]}>
                            {t('onboarding.skip')}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View />
                )}
            </View>

            {/* Pages */}
            <FlatList
                ref={flatListRef}
                data={pages}
                renderItem={renderPage}
                keyExtractor={(_, index) => String(index)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const page = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentPage(page);
                }}
            />

            {/* Page indicators */}
            <View style={styles.indicators}>
                {pages.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor:
                                    index === currentPage ? colors.primary : colors.border,
                                width: index === currentPage ? 24 : 8,
                            },
                        ]}
                    />
                ))}
            </View>

            {/* Action button */}
            <View style={styles.buttonContainer}>
                <Button
                    title={isLastPage ? t('onboarding.getStarted') : t('common.next')}
                    onPress={handleNext}
                    fullWidth
                    size="large"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '500',
    },
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    indicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 32,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
});
