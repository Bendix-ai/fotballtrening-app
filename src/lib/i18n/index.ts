import no, { Translations } from './no';
import en from './en';

export type Language = 'no' | 'en';

const translations: Record<Language, Translations> = {
    no,
    en,
};

let currentLanguage: Language = 'no';

/**
 * Set the current language
 */
export function setLanguage(lang: Language): void {
    currentLanguage = lang;
}

/**
 * Get the current language
 */
export function getCurrentLanguage(): Language {
    return currentLanguage;
}

/**
 * Get all supported languages with display names
 */
export function getSupportedLanguages(): { code: Language; label: string }[] {
    return [
        { code: 'no', label: 'Norsk' },
        { code: 'en', label: 'English' },
    ];
}

/**
 * Get a translation by key path
 * Example: t('exercises.title') returns 'Øvelser' (in Norwegian)
 */
export function t(keyPath: string, params?: Record<string, string | number>): string {
    const keys = keyPath.split('.');
    let value: unknown = translations[currentLanguage];

    for (const key of keys) {
        if (typeof value === 'object' && value !== null && key in value) {
            value = (value as Record<string, unknown>)[key];
        } else {
            console.warn(`Translation key not found: ${keyPath}`);
            return keyPath;
        }
    }

    if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${keyPath}`);
        return keyPath;
    }

    // Replace parameters like {points} with actual values
    if (params) {
        let result = value;
        for (const [key, val] of Object.entries(params)) {
            result = result.replace(`{${key}}`, String(val));
        }
        return result;
    }

    return value;
}

export { no, en };
export type { Translations };
