import Constants from 'expo-constants';

export function getAppVersion(): string {
    return Constants.expoConfig?.version ?? '1.0.3';
}

export function getBuildNumber(): string {
    return Constants.expoConfig?.ios?.buildNumber ?? '3';
}

export function getFullVersion(): string {
    return `${getAppVersion()} (${getBuildNumber()})`;
}
