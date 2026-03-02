import { Audio } from 'expo-av';
import { useAppStore } from '../stores/appStore';

export type SoundName = 'coin' | 'complete' | 'achievement' | 'levelup';

export async function playSound(name: SoundName): Promise<void> {
    try {
        const { soundEnabled } = useAppStore.getState();
        if (!soundEnabled) return;

        const soundMap: Record<SoundName, ReturnType<typeof require> | null> = {
            coin: require('../../assets/sounds/coin.mp3'),
            complete: require('../../assets/sounds/complete.mp3'),
            achievement: require('../../assets/sounds/achievement.mp3'),
            levelup: require('../../assets/sounds/levelup.mp3'),
        };

        const file = soundMap[name];
        if (!file) return;

        const { sound } = await Audio.Sound.createAsync(file);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
            if ('didJustFinish' in status && status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    } catch {
        // Silently fail - sound is non-critical
    }
}
