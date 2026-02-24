declare module 'expo-constants' {
    interface ExpoConfig {
        version?: string;
        ios?: { buildNumber?: string };
        android?: { versionCode?: number };
    }
    const Constants: {
        expoConfig?: ExpoConfig | null;
    };
    export default Constants;
}
