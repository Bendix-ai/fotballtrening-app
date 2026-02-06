# Design System - Football Training App

## Overview

This design system defines the visual language, components, and patterns for the Football Training App. It ensures consistency across iOS and Android platforms while respecting platform-specific conventions.

---

## Brand Identity

### Brand Values
- **Energetic**: Vibrant, motivating, action-oriented
- **Inclusive**: Welcoming to all skill levels and genders
- **Competitive**: Encourages healthy competition and achievement
- **Trustworthy**: Safe, reliable, and professional
- **Fun**: Engaging, playful, and enjoyable

### Design Principles
1. **Clarity First**: Information should be immediately understandable
2. **Motivate Action**: Design should encourage exercise completion
3. **Celebrate Success**: Prominently recognize achievements
4. **Reduce Friction**: Minimize steps to complete key actions
5. **Platform Native**: Respect iOS and Android conventions

---

## Color System

### Primary Colors

**Primary Green** (Football Field)
- Light: `#4CAF50` (rgb(76, 175, 80))
- Default: `#2E7D32` (rgb(46, 125, 50))
- Dark: `#1B5E20` (rgb(27, 94, 32))
- **Usage**: Primary actions, active states, success messages, branding

**Secondary Orange** (Energy)
- Light: `#FFB74D` (rgb(255, 183, 77))
- Default: `#FF9800` (rgb(255, 152, 0))
- Dark: `#F57C00` (rgb(245, 124, 0))
- **Usage**: Streaks, achievements, highlights, call-to-action

### Semantic Colors

**Success**
- `#4CAF50` (Green)
- **Usage**: Completed exercises, positive feedback, success messages

**Warning**
- `#FFC107` (Amber)
- **Usage**: Streak warnings, important notices, caution states

**Error**
- `#F44336` (Red)
- **Usage**: Error messages, destructive actions, validation errors

**Info**
- `#2196F3` (Blue)
- **Usage**: Informational messages, links, neutral highlights

### Neutral Colors

**Text Colors**
- Primary Text: `#212121` (Light mode), `#FFFFFF` (Dark mode)
- Secondary Text: `#757575` (Light mode), `#B0B0B0` (Dark mode)
- Tertiary Text: `#9E9E9E` (Light mode), `#808080` (Dark mode)
- Disabled Text: `#BDBDBD` (Light mode), `#606060` (Dark mode)

**Background Colors**
- Primary Background: `#FFFFFF` (Light mode), `#121212` (Dark mode)
- Secondary Background: `#F5F5F5` (Light mode), `#1E1E1E` (Dark mode)
- Tertiary Background: `#EEEEEE` (Light mode), `#2C2C2C` (Dark mode)

**Border Colors**
- Default Border: `#E0E0E0` (Light mode), `#3A3A3A` (Dark mode)
- Focus Border: `#2E7D32` (Primary Green)
- Error Border: `#F44336` (Error Red)

### Gradient Colors

**Primary Gradient** (Header backgrounds, cards)
- Start: `#2E7D32`
- End: `#4CAF50`

**Achievement Gradient** (Badges, celebrations)
- Start: `#FF9800`
- End: `#FFB74D`

### Leaderboard Colors

**Podium Colors**
- 1st Place (Gold): `#FFD700`
- 2nd Place (Silver): `#C0C0C0`
- 3rd Place (Bronze): `#CD7F32`

---

## Typography

### Font Families

**iOS**: San Francisco (SF Pro)
- System default, optimized for iOS

**Android**: Roboto
- System default, Material Design standard

**Cross-Platform**: System font stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Type Scale

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1** | 32pt | Bold (700) | 40pt | Page titles, main headings |
| **H2** | 24pt | Bold (700) | 32pt | Section headings |
| **H3** | 20pt | Semibold (600) | 28pt | Subsection headings |
| **H4** | 18pt | Semibold (600) | 24pt | Card titles |
| **Body Large** | 17pt | Regular (400) | 24pt | Primary body text (iOS standard) |
| **Body** | 16pt | Regular (400) | 22pt | Standard body text |
| **Body Small** | 14pt | Regular (400) | 20pt | Secondary body text |
| **Caption** | 12pt | Regular (400) | 16pt | Captions, labels, metadata |
| **Button** | 16pt | Semibold (600) | 20pt | Button labels |
| **Label** | 14pt | Medium (500) | 18pt | Form labels, tags |

### Dynamic Type Support

Support iOS Dynamic Type and Android font scaling:
- Minimum scale: 100%
- Maximum scale: 200%
- Test all screens at 150% and 200% scaling
- Use flexible layouts that accommodate text growth

---

## Spacing System

### 8pt Grid System

All spacing uses multiples of 8pt for consistency:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4pt | Tight spacing, icon padding |
| `sm` | 8pt | Compact spacing, list item padding |
| `md` | 16pt | Standard spacing, card padding |
| `lg` | 24pt | Section spacing, large gaps |
| `xl` | 32pt | Major section spacing |
| `2xl` | 48pt | Extra large spacing, hero sections |

### Component Spacing

**Screen Padding**
- Horizontal: 16pt (standard), 24pt (tablet)
- Vertical: 16pt (top), 8pt (between sections)

**Card Padding**
- Internal: 16pt all sides
- Between cards: 12pt vertical gap

**List Items**
- Height: 56pt minimum (Android), 44pt minimum (iOS)
- Padding: 16pt horizontal, 12pt vertical
- Between items: 1pt separator or 8pt gap

---

## Component Library

### Buttons

#### Primary Button
**Visual Style**:
- Background: Primary Green (`#2E7D32`)
- Text: White (`#FFFFFF`)
- Border Radius: 8pt
- Height: 48pt (minimum touch target)
- Padding: 16pt horizontal
- Shadow: Elevation 2dp (Android), subtle shadow (iOS)

**States**:
- Hover: Background `#4CAF50` (10% lighter)
- Pressed: Background `#1B5E20` (darker), scale 0.98
- Disabled: Background `#BDBDBD`, Text `#757575`
- Loading: Spinner replaces text

**Usage**: Primary actions (Start Exercise, Login, Save)

#### Secondary Button
**Visual Style**:
- Background: Transparent
- Border: 2pt solid Primary Green
- Text: Primary Green
- Border Radius: 8pt
- Height: 48pt
- Padding: 16pt horizontal

**States**:
- Hover: Background `#E8F5E9` (light green tint)
- Pressed: Background `#C8E6C9`, scale 0.98
- Disabled: Border `#BDBDBD`, Text `#BDBDBD`

**Usage**: Secondary actions (Cancel, Skip, View Details)

#### Text Button
**Visual Style**:
- Background: Transparent
- Text: Primary Green
- No border
- Height: 40pt
- Padding: 12pt horizontal

**States**:
- Hover: Background `#E8F5E9`
- Pressed: Background `#C8E6C9`
- Disabled: Text `#BDBDBD`

**Usage**: Tertiary actions (Learn More, Forgot Password)

#### Floating Action Button (FAB) - Android
**Visual Style**:
- Background: Primary Green
- Icon: White
- Size: 56pt diameter (standard), 40pt (mini)
- Shadow: Elevation 6dp
- Position: Bottom right, 16pt from edges

**Usage**: Primary action on screen (Add Player, Add Exercise)

### Cards

#### Standard Card
**Visual Style**:
- Background: White (light mode), `#1E1E1E` (dark mode)
- Border Radius: 12pt
- Shadow: Elevation 1dp (Android), subtle shadow (iOS)
- Padding: 16pt

**Content Structure**:
```
┌─────────────────────────────┐
│ [Thumbnail/Icon]            │
│                             │
│ Title (H4)                  │
│ Subtitle (Body Small)       │
│                             │
│ [Action Buttons]            │
└─────────────────────────────┘
```

**Usage**: Exercise cards, player cards, achievement cards

#### Elevated Card (Highlighted)
**Visual Style**:
- Background: White (light mode), `#2C2C2C` (dark mode)
- Border: 2pt solid Primary Green
- Border Radius: 12pt
- Shadow: Elevation 2dp
- Padding: 16pt

**Usage**: Current user on leaderboard, featured exercises, today's challenge

### Input Fields

#### Text Input
**Visual Style**:
- Border: 1pt solid `#E0E0E0`
- Border Radius: 8pt
- Height: 48pt
- Padding: 12pt horizontal
- Font: Body (16pt)

**States**:
- Focus: Border Primary Green (2pt), shadow
- Error: Border Error Red (2pt)
- Disabled: Background `#F5F5F5`, Text `#BDBDBD`

**Components**:
- Label (above input): Label style (14pt Medium)
- Placeholder: Tertiary Text color
- Helper text (below): Caption style (12pt)
- Error message (below): Caption style, Error Red
- Character counter (right): Caption style

#### Password Input
Same as Text Input with:
- Show/Hide password toggle icon (right side)
- Masked characters by default

#### Dropdown/Select
**Visual Style**:
- Same as Text Input
- Chevron down icon (right side)
- Opens native picker (iOS) or bottom sheet (Android)

### Lists

#### List Item
**Visual Style**:
- Height: 56pt minimum
- Padding: 16pt horizontal, 12pt vertical
- Separator: 1pt line `#E0E0E0` (optional)

**Content Structure**:
```
┌──────────────────────────────────┐
│ [Icon] Title          [Action]  │
│        Subtitle       [Badge]    │
└──────────────────────────────────┘
```

**States**:
- Hover/Press: Background `#F5F5F5` (light mode)
- Selected: Background `#E8F5E9` (light green)

**Usage**: Player lists, exercise lists, settings options

#### Swipe Actions (iOS)
- Swipe left: Reveal destructive action (Delete - Red)
- Swipe right: Reveal primary action (Edit - Primary Green)

### Badges

#### Status Badge
**Visual Style**:
- Padding: 4pt horizontal, 2pt vertical
- Border Radius: 12pt (pill shape)
- Font: Caption (12pt Medium)

**Variants**:
- **Difficulty Beginner**: Background `#E8F5E9`, Text `#2E7D32`
- **Difficulty Intermediate**: Background `#FFF3E0`, Text `#F57C00`
- **Difficulty Advanced**: Background `#FFEBEE`, Text `#C62828`
- **Category**: Background `#E3F2FD`, Text `#1976D2`
- **Points**: Background `#FFF8E1`, Text `#F57C00`

#### Achievement Badge
**Visual Style**:
- Size: 64pt x 64pt (large), 40pt x 40pt (small)
- Border Radius: 50% (circular)
- Border: 3pt solid gold/silver/bronze
- Background: Gradient (Achievement Gradient)
- Icon: White, centered

**States**:
- Locked: Grayscale, 50% opacity
- Unlocked: Full color, subtle pulse animation on unlock

### Modals

#### Bottom Sheet (Android) / Modal (iOS)
**Visual Style**:
- Background: White (light mode), `#1E1E1E` (dark mode)
- Border Radius: 16pt (top corners only for bottom sheet)
- Padding: 24pt
- Handle (Android): 32pt x 4pt rounded bar at top

**Content Structure**:
```
┌─────────────────────────────┐
│ ━━━ (Handle - Android)      │
│                             │
│ Title (H3)         [X]      │
│                             │
│ Content                     │
│                             │
│ [Primary Button]            │
│ [Secondary Button]          │
└─────────────────────────────┘
```

**Usage**: Exercise details, confirmations, forms

### Navigation

#### Bottom Tab Bar (Player)
**Visual Style**:
- Height: 56pt (Android), 49pt + safe area (iOS)
- Background: White (light mode), `#1E1E1E` (dark mode)
- Shadow: Elevation 8dp (Android), subtle shadow (iOS)

**Tab Item**:
- Icon: 24pt x 24pt
- Label: Caption (12pt)
- Active: Primary Green
- Inactive: `#757575`
- Indicator (Android): 3pt bar above tab

**Tabs**: Home, Exercises, Leaderboard, Profile

#### Navigation Drawer (Admin)
**Visual Style**:
- Width: 280pt
- Background: White (light mode), `#1E1E1E` (dark mode)
- Shadow: Elevation 16dp

**Header**:
- Height: 160pt
- Background: Primary Gradient
- Content: Admin name, role, club name (white text)

**Menu Items**:
- Height: 48pt
- Padding: 16pt horizontal
- Icon: 24pt x 24pt (left)
- Text: Body (16pt)
- Active: Background `#E8F5E9`, Text Primary Green
- Inactive: Text Primary Text color

### Loading States

#### Spinner
**Visual Style**:
- Size: 40pt x 40pt (large), 24pt x 24pt (small)
- Color: Primary Green
- Animation: Smooth rotation

**Usage**: Button loading, full-screen loading

#### Skeleton Screen
**Visual Style**:
- Background: `#E0E0E0` (light mode), `#3A3A3A` (dark mode)
- Border Radius: Matches content shape
- Animation: Shimmer effect left to right

**Usage**: Loading lists, cards, content areas

#### Progress Bar
**Visual Style**:
- Height: 4pt
- Background: `#E0E0E0`
- Fill: Primary Green
- Border Radius: 2pt

**Usage**: Exercise timer, upload progress, streak progress

### Empty States

**Visual Style**:
- Centered content
- Illustration: 120pt x 120pt (simple, friendly)
- Title: H3
- Description: Body
- Action Button: Primary Button

**Content**:
- Friendly, encouraging message
- Clear explanation of why empty
- Clear call-to-action

**Examples**:
- No exercises completed yet: "Start your first exercise!"
- No players added: "Add your first player to get started"
- No achievements yet: "Complete exercises to earn badges"

---

## Iconography

### Icon Style
- **Style**: Outlined (default), Filled (selected/active states)
- **Size**: 24pt x 24pt (standard), 20pt (small), 32pt (large)
- **Stroke Width**: 2pt
- **Color**: Inherits from context (text color, primary color)

### Icon Library
Use **Material Icons** (Android) and **SF Symbols** (iOS) for consistency

**Common Icons**:
- Home: `home`
- Exercises: `fitness_center`
- Leaderboard: `leaderboard`
- Profile: `person`
- Add: `add`
- Edit: `edit`
- Delete: `delete`
- Search: `search`
- Filter: `filter_list`
- Settings: `settings`
- Logout: `logout`
- Check: `check_circle`
- Close: `close`
- Arrow Back: `arrow_back`
- Arrow Forward: `arrow_forward`
- Star: `star` (filled for ratings)
- Timer: `timer`
- Trophy: `emoji_events`
- Fire (Streak): `local_fire_department`

---

## Animations and Transitions

### Timing

| Duration | Usage |
|----------|-------|
| 100ms | Micro-interactions (button press) |
| 200ms | Quick transitions (tab switch) |
| 300ms | Standard transitions (screen navigation) |
| 500ms | Complex animations (success celebration) |

### Easing Curves

**Standard Easing**: `cubic-bezier(0.4, 0.0, 0.2, 1)`
- Use for most transitions

**Deceleration**: `cubic-bezier(0.0, 0.0, 0.2, 1)`
- Use for elements entering screen

**Acceleration**: `cubic-bezier(0.4, 0.0, 1, 1)`
- Use for elements leaving screen

**Spring**: Natural bounce effect
- Use for playful interactions (achievement unlocks)

### Common Animations

**Button Press**
- Scale: 0.98
- Duration: 100ms
- Easing: Standard

**Success Celebration**
- Confetti animation
- Scale pulse: 1.0 → 1.1 → 1.0
- Duration: 500ms
- Easing: Spring

**Achievement Unlock**
- Fade in + Scale up
- Start: opacity 0, scale 0.8
- End: opacity 1, scale 1.0
- Duration: 300ms
- Easing: Deceleration

**Screen Transitions**
- iOS: Slide from right (push), slide to right (pop)
- Android: Fade + slight vertical movement
- Duration: 300ms

**Loading Spinner**
- Continuous rotation
- Duration: 1000ms per rotation
- Easing: Linear

---

## Platform-Specific Adaptations

### iOS Specific

**Navigation**
- Large title in navigation bar
- Swipe from left edge to go back
- Tab bar at bottom with icons + labels
- Modal sheets slide up from bottom

**Interactions**
- Haptic feedback on important actions
- Context menus on long press
- Pull to refresh with native spinner

**Visual Style**
- Subtle shadows
- Translucent backgrounds with blur
- Rounded corners: 10-12pt

### Android Specific

**Navigation**
- Top app bar with elevation
- Back button in top left
- Bottom navigation with ripple effects
- Navigation drawer from left edge

**Interactions**
- Ripple effect on touch
- FAB for primary actions
- Snackbar for notifications
- Bottom sheets for actions

**Visual Style**
- Material elevation (shadows)
- Bolder, more pronounced shadows
- Rounded corners: 4-8pt
- Material You dynamic colors (future)

---

## Accessibility

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text (18pt+): Minimum 3:1 ratio
- Icons and UI elements: Minimum 3:1 ratio
- Test all color combinations in both light and dark modes

### Touch Targets
- Minimum size: 44pt x 44pt (iOS), 48pt x 48pt (Android)
- Spacing between targets: Minimum 8pt
- Larger targets for primary actions

### Screen Reader Support
- All interactive elements have accessibility labels
- Images have alt text
- Headings properly structured (H1 → H2 → H3)
- Form inputs have associated labels
- State changes announced (loading, success, error)

### Keyboard Navigation
- Logical tab order
- Focus indicators visible
- All actions accessible via keyboard
- Skip links for long content

### Text Scaling
- Support up to 200% text scaling
- Flexible layouts that accommodate text growth
- No fixed heights for text containers
- Test all screens at 150% and 200%

---

## Design Tokens (for Development)

### Colors
```javascript
const colors = {
  primary: {
    light: '#4CAF50',
    main: '#2E7D32',
    dark: '#1B5E20',
  },
  secondary: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#9E9E9E',
    disabled: '#BDBDBD',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#EEEEEE',
  },
  border: {
    default: '#E0E0E0',
    focus: '#2E7D32',
    error: '#F44336',
  },
};
```

### Spacing
```javascript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### Typography
```javascript
const typography = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  bodyLarge: { fontSize: 17, fontWeight: '400', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600', lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '500', lineHeight: 18 },
};
```

### Border Radius
```javascript
const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xlarge: 16,
  round: 9999, // Fully rounded
};
```

### Shadows (iOS)
```javascript
const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 3.0,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 5.0,
  },
};
```

### Elevation (Android)
```javascript
const elevation = {
  level1: 1, // Cards
  level2: 2, // Buttons
  level4: 4, // App bar
  level6: 6, // FAB
  level8: 8, // Bottom navigation
  level16: 16, // Drawer
};
```

---

## Implementation Guidelines

### React Native StyleSheet
```javascript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.medium,
    height: 48,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
});
```

### NativeWind (TailwindCSS)
```jsx
<TouchableOpacity className="bg-primary-main rounded-lg h-12 px-4 justify-center items-center">
  <Text className="text-white text-base font-semibold">
    Start Exercise
  </Text>
</TouchableOpacity>
```

### Theme Provider
Implement a theme context for light/dark mode switching:
```javascript
const ThemeContext = React.createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: colors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

This design system should be referenced throughout development to ensure visual consistency and adherence to mobile best practices.
