# Fotballtrening App - Design Mockups & Mascot

**Target Audience**: Children aged 8-13 (girls and boys)  
**Design Philosophy**: Gamified, vibrant, and motivating — inspired by Duolingo, kids learning apps, and sports games  
**Last Updated**: March 2026

---

## Maskot: "Bolt"

Bolt is a friendly, animated soccer ball character with arms, legs, white gloves, and sneakers. The lightning bolt logo on the ball represents energy and speed. Bolt appears across the app to guide, celebrate, and motivate players.

### Mascot Files

| File | Situation | When to Use |
|---|---|---|
| `mascot/bolt_neutral.png` | Standing, friendly smile | Home screen hero banner, onboarding |
| `mascot/bolt_celebrating.png` | Arms raised, confetti | Exercise completion, achievements unlocked |
| `mascot/bolt_running.png` | Sprinting with speed lines | Sprint exercises, loading screens |
| `mascot/bolt_pointing.png` | Pointing at viewer | Calls to action, tips, empty states |
| `mascot/bolt_trophy.png` | Holding trophy, eyes squinting with joy | Leaderboard #1, weekly winner |

### Implementation Notes

All mascot files are 2048x2048px PNG with transparent backgrounds. Import them at appropriate sizes:
- Hero banner: 120x120pt
- Celebration overlay: 200x200pt
- Small inline: 40x40pt

---

## Screen 1: Hjemskjerm (Home)

**File**: `screen_home.png`

### Design Decisions

The home screen is designed to answer the child's first question when opening the app: "What should I do today?" Everything above the fold communicates the daily challenge and current progress.

**Hero Banner**: The mascot Bolt appears here in the neutral/celebrating pose with a warm greeting and streak information. This creates an emotional connection and rewards returning users immediately.

**Daily Challenge Card**: The orange gradient card with "2x POENG I DAG!" is the most important element. The double-points mechanic creates urgency and excitement. The progress bar with football icons (0/3) makes the goal concrete and achievable.

**Quick Stats Row**: Three compact cards showing streak, level, and leaderboard position give the child a quick sense of their standing without overwhelming them.

### Key Colors
- Header background: `#1B5E20` (deep forest green)
- Hero banner gradient: `#2E7D32` → `#4CAF50`
- Daily challenge card: `#FF9800` → `#FFB74D` (orange)
- Start button: `#2E7D32`

### Implementation Priority
This is the most important screen. Build this first as it sets the tone for the entire app experience.

---

## Screen 2: Øvelser (Exercises)

**File**: `screen_exercises.png`

### Design Decisions

The exercises screen is designed to be browsable and visually scannable. Children should be able to find an exercise they want to do within 3 seconds.

**Category Filter Pills**: Colorful, emoji-enhanced pills at the top make filtering intuitive. Each category has a distinct color (green=all, orange=sprint, blue=passing, red=shooting, purple=balance) so children associate colors with exercise types over time.

**Featured Exercise Card**: The large hero card with a cartoon illustration of a child doing the exercise is the most important element. Children respond to seeing other children doing activities. The "START NÅ" button is large and orange — impossible to miss.

**Exercise List Cards**: Each card has a colored illustration thumbnail, difficulty dots (not stars, to avoid confusion with ratings), time estimate, and points value. The "Utfordre venn" button in orange outline encourages social engagement.

**"Utfordre venn" Feature**: This is a key differentiator. Children are motivated by social competition. This button should open a share sheet to challenge a specific teammate.

### Key Colors
- Featured card background: `#4CAF50` (bright green)
- Sprint category pill: `#FF9800` (orange)
- Passing category pill: `#2196F3` (blue)
- Shooting category pill: `#F44336` (red)
- Balance category pill: `#9C27B0` (purple)

### Implementation Notes
The featured card illustration should be updated daily to match the daily challenge. Consider using Lottie animations for the exercise illustrations to make them more engaging.

---

## Screen 3: Toppliste (Leaderboard)

**File**: `screen_leaderboard.png`

### Design Decisions

The leaderboard is designed to be exciting and motivating, not discouraging. The key insight is that children need to feel close to the top — even if they're not #1.

**Podium Design**: The three-column podium with gold/silver/bronze is instantly recognizable from the Olympics and sports culture. The gold #1 position is taller and more dramatic, creating aspiration. The podium uses cartoon avatar faces rather than photos for privacy and consistency.

**"Du er #3!" Banner**: The orange banner showing the current user's position with "+120 poeng til #2!" is critical. This tells the child exactly how far they are from the next position, making the goal feel achievable. This is the same technique used by Duolingo's leaderboard.

**Trend Arrows**: Green up-arrows, red down-arrows, and gray dashes next to each player's score show movement since last week. Children love seeing they're "climbing" the leaderboard.

**Laget / Alle klubber Tabs**: The tab system allows children to see their team leaderboard (most relevant) and a broader club-wide leaderboard. Start with "Laget" as the default since this is the most motivating context.

### Key Colors
- Header background: `#1B5E20` (deep forest green)
- Podium background: `#0D3320` (very dark green)
- Gold #1: `#FFD700` with shimmer effect
- Silver #2: `#C0C0C0`
- Bronze #3: `#CD7F32`
- Current user banner: `#FF9800` (orange)

### Implementation Notes
Animate the podium on screen entry — have the three columns rise up from the bottom with a satisfying bounce. This makes opening the leaderboard feel like an event. Use `react-native-reanimated` for this.

---

## Screen 4: Profil (Profile)

**File**: `screen_profile.png`

### Design Decisions

The profile screen is designed to feel like a personal trophy room. It celebrates what the child has achieved, not just what they haven't done yet.

**Hero Section**: The circular avatar with a glowing gold ring, name, club, and three quick-stat badges creates a "player card" feel. Children love having their own card — it feels official and important.

**Stats Grid**: Four key stats in a 2x2 grid with large numbers and colored icons. The numbers are the hero — large, bold, and easy to read. Labels are small and secondary. This mirrors how sports statistics are displayed in real football.

**"Min Utvikling" Chart**: A simple line chart showing points earned over the last 7 days. The upward trend is motivating. The "Denne uken: +340 poeng" summary below the chart gives context. Keep the chart simple — no axes labels beyond day names.

**Achievements**: Unlocked achievements are shown in full color; locked ones are grayed out with a lock icon. This creates aspiration without being discouraging. The "Se alle" link leads to a full achievements screen.

**"Visste du?" Fun Facts Card**: The orange card with a fun fact about the child's activity (e.g., "You've run 12km this month — that's like running from the city center to the airport!") is a delightful surprise. These facts make the data feel personal and impressive. Rotate these weekly.

### Key Colors
- Profile hero background: `#2E7D32` → `#1B5E20` (green gradient)
- Avatar ring: `#FFD700` (gold glow)
- Stats grid cards: white with colored icons
- Fun facts card: `#FF9800` (orange)

### Implementation Notes
The avatar should be selectable from a set of pre-designed cartoon avatars (boy/girl options, different hair colors and styles). Do not use real photos for privacy reasons, especially for children.

---

## Design System Summary

### Typography
Use **Nunito** (Google Fonts) as the primary typeface. It's rounded, friendly, and highly legible for children. Available via `@expo-google-fonts/nunito`.

```typescript
// Font weights used
Nunito_400Regular  // Body text
Nunito_600SemiBold // Labels, secondary headings
Nunito_700Bold     // Section headings, stats
Nunito_800ExtraBold // Screen titles, hero numbers
```

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `primary.main` | `#2E7D32` | Headers, active states, buttons |
| `primary.light` | `#4CAF50` | Backgrounds, gradients |
| `secondary.main` | `#FF9800` | CTAs, daily challenge, alerts |
| `secondary.light` | `#FFB74D` | Gradient ends, badges |
| `gold` | `#FFD700` | #1 position, achievements |
| `silver` | `#C0C0C0` | #2 position |
| `bronze` | `#CD7F32` | #3 position |

### Spacing
All spacing follows the 8pt grid: 8, 16, 24, 32, 48px. Card padding is always 16px. Section gaps are always 24px.

### Border Radius
All cards use `borderRadius: 16`. Buttons use `borderRadius: 12`. Pills/badges use `borderRadius: 9999` (fully rounded).

### Animations to Implement
- **Podium rise**: Leaderboard podium columns animate up on screen entry
- **Points counter**: Numbers count up when points are awarded
- **Streak flame**: Flame icon pulses gently on home screen
- **Achievement unlock**: Burst animation when a new achievement is unlocked
- **Exercise completion**: Confetti + Bolt celebrating animation

---

## Next Steps for Developers

1. Install Nunito font: `npx expo install @expo-google-fonts/nunito expo-font`
2. Update `design-tokens.ts` with the colors from this document
3. Implement the Home screen first as it's the highest priority
4. Add Bolt mascot images to `assets/mascot/` directory
5. Implement the Leaderboard podium animation using `react-native-reanimated`
6. Add the "Visste du?" fun facts to a static data file with 20+ facts
