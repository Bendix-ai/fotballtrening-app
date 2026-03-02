# Sound Assets

This directory should contain the following MP3 files:

- `coin.mp3` — Short coin/point sound effect (played when earning points)
- `complete.mp3` — Exercise completion sound (played when finishing an exercise)
- `achievement.mp3` — Achievement unlock fanfare (played when unlocking an achievement)
- `levelup.mp3` — Level up celebration sound (played when reaching a new level)

## Requirements

- Format: MP3
- Duration: 0.5–2 seconds recommended
- Loudness: Normalized to similar levels across all files

## How to activate

Once you add the MP3 files here, update `src/lib/sounds.ts` to reference them:

```typescript
const soundMap: Record<SoundName, ReturnType<typeof require> | null> = {
    coin: require('../../assets/sounds/coin.mp3'),
    complete: require('../../assets/sounds/complete.mp3'),
    achievement: require('../../assets/sounds/achievement.mp3'),
    levelup: require('../../assets/sounds/levelup.mp3'),
};
```
