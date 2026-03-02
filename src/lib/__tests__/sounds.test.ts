import { playSound } from '../sounds';
import { useAppStore } from '../../stores/appStore';

describe('playSound', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAppStore.setState({ soundEnabled: true });
    });

    it('should not throw when called', async () => {
        await expect(playSound('coin')).resolves.not.toThrow();
    });

    it('should not play when soundEnabled is false', async () => {
        useAppStore.setState({ soundEnabled: false });
        await expect(playSound('complete')).resolves.not.toThrow();
    });

    it('should handle all sound names', async () => {
        for (const name of ['coin', 'complete', 'achievement', 'levelup'] as const) {
            await expect(playSound(name)).resolves.not.toThrow();
        }
    });
});
