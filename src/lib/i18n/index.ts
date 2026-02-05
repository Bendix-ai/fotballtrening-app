import no, { Translations } from './no';

// For now, we only support Norwegian
// This structure allows easy addition of more languages later
const translations: Record<string, Translations> = {
    no,
};

// Current language (Norwegian only for now)
const currentLanguage = 'no';

/**
 * Get a translation by key path
 * Example: t('exercises.title') returns 'Øvelser'
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

export { no };
export type { Translations };
