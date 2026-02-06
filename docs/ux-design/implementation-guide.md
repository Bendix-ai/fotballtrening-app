# UI Implementation Guide - Football Training App

## Introduction

This guide provides developers with a comprehensive plan for implementing the user interface of the Football Training App. It translates the UX design, information architecture, and design system into actionable steps and code examples for a React Native + Expo application.

**Key Technologies**:
- **Framework**: React Native with Expo SDK 52+
- **Language**: TypeScript
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Navigation**: React Navigation 7+
- **State Management**: Zustand & React Query

---

## 1. Project Setup

### Initializing the Project

Start by creating a new Expo project with the TypeScript template.

```bash
npx create-expo-app@latest football-training-app --template
cd football-training-app
```

### Installing Core Dependencies

Install all necessary packages for styling, navigation, and state management.

```bash
# Styling with NativeWind
npm install nativewind
npm install --save-dev tailwindcss

# Navigation
npx expo install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
npx expo install react-native-screens react-native-safe-area-context

# State Management
npm install zustand @tanstack/react-query

# Icons
npx expo install @expo/vector-icons
```

### Configuration

**1. Configure TailwindCSS**:
Initialize Tailwind configuration:
```bash
npx tailwindcss init
```

Update `tailwind.config.js` to include your source files and design system tokens:

```javascript
// tailwind.config.js
const { colors, spacing, borderRadius, typography } = require("./src/theme/design-tokens");

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius,
      fontSize: Object.keys(typography).reduce((acc, key) => {
        acc[key] = [typography[key].fontSize, { lineHeight: typography[key].lineHeight + "px" }];
        return acc;
      }, {}),
    },
  },
  plugins: [],
};
```

**2. Configure Babel**:
Update `babel.config.js` to include the NativeWind plugin:

```javascript
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};
```

---

## 2. Project Structure

Organize the project directory for scalability and maintainability.

```
/src
├── api/             # API integration (React Query hooks)
├── assets/          # Images, fonts, icons
├── components/      # Reusable UI components (atoms, molecules)
│   ├── common/      # General components (Button, Card, Input)
│   └── layout/      # Layout components (Container, Header)
├── features/        # Feature-specific components and logic
│   ├── auth/
│   ├── exercises/
│   └── leaderboard/
├── hooks/           # Custom React hooks
├── navigation/      # Navigation stacks and configuration
├── screens/         # Top-level screen components
│   ├── player/
│   └── admin/
├── services/        # Business logic, utility functions
├── store/           # Zustand state management stores
└── theme/           # Design system tokens and theme provider
    ├── design-tokens.js
    └── ThemeProvider.tsx
```

---

## 3. Styling Approach

We will use **NativeWind** as the primary styling method. This allows for rapid development using utility classes while leveraging the design system tokens for consistency.

### Design Tokens

Create a `design-tokens.js` file to store all design system values.

```javascript
// src/theme/design-tokens.js

export const colors = { /* ... from design system ... */ };
export const spacing = { /* ... from design system ... */ };
export const borderRadius = { /* ... from design system ... */ };
export const typography = { /* ... from design system ... */ };
// ... and so on
```

### Usage in Components

Apply styles directly in the `className` prop.

```jsx
import { Text, View, TouchableOpacity } from "react-native";

const MyComponent = () => {
  return (
    <View className="p-md bg-background-primary">
      <Text className="text-h1 text-text-primary">Welcome</Text>
      <TouchableOpacity className="bg-primary-main rounded-medium h-12 justify-center items-center mt-lg">
        <Text className="text-white text-button font-semibold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};
```

For platform-specific styles, use the `platform:` modifier.

```jsx
<View className="pt-lg ios:pt-xl android:pt-md" />
```

---

## 4. Component Implementation

Build a library of reusable components based on the design system.

### Primary Button Component

```tsx
// src/components/common/Button.tsx
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { styled } from "nativewind";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledActivityIndicator = styled(ActivityIndicator);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = "primary", 
  isLoading = false, 
  disabled = false 
}) => {
  const baseClasses = "h-12 rounded-medium justify-center items-center px-md";
  const primaryClasses = "bg-primary-main";
  const secondaryClasses = "border-2 border-primary-main";
  const disabledClasses = "bg-neutral-300 dark:bg-neutral-700";

  const textPrimaryClasses = "text-white";
  const textSecondaryClasses = "text-primary-main";
  const textDisabledClasses = "text-neutral-500";

  const getVariantClasses = () => {
    if (disabled) return disabledClasses;
    return variant === "primary" ? primaryClasses : secondaryClasses;
  };

  const getTextVariantClasses = () => {
    if (disabled) return textDisabledClasses;
    return variant === "primary" ? textPrimaryClasses : textSecondaryClasses;
  };

  return (
    <StyledTouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${getVariantClasses()}`}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <StyledActivityIndicator color={variant === "primary" ? "white" : "#2E7D32"} />
      ) : (
        <StyledText className={`text-button font-semibold ${getTextVariantClasses()}`}>
          {title}
        </StyledText>
      )}
    </StyledTouchableOpacity>
  );
};
```

### Card Component

```tsx
// src/components/common/Card.tsx
import React from "react";
import { View } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <StyledView
      className={`bg-background-secondary dark:bg-neutral-800 rounded-large p-md shadow-sm ${className}`}
    >
      {children}
    </StyledView>
  );
};
```

### Text Input Component

```tsx
// src/components/common/Input.tsx
import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

interface InputProps {
  label: string;
  placeholder?: string;
  error?: string;
  // ... other TextInput props
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  const focusClasses = isFocused ? "border-primary-main border-2" : "border-border-default";
  const errorClasses = error ? "border-error border-2" : "";

  return (
    <StyledView className="w-full">
      <StyledText className="text-label font-medium mb-sm text-text-secondary">
        {label}
      </StyledText>
      <StyledTextInput
        className={`h-12 rounded-medium px-md bg-background-tertiary border ${focusClasses} ${errorClasses}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#9E9E9E"
        {...props}
      />
      {error && (
        <StyledText className="text-caption text-error mt-xs">{error}</StyledText>
      )}
    </StyledView>
  );
};
```

---

## 5. Navigation Setup

Structure the navigation using React Navigation.

### Player Navigation

```tsx
// src/navigation/PlayerNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen, ExercisesScreen, LeaderboardScreen, ProfileScreen } from "../screens/player";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export const PlayerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Exercises") iconName = "fitness-center";
          else if (route.name === "Leaderboard") iconName = "leaderboard";
          else if (route.name === "Profile") iconName = "person";
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "#757575",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
```

### Main App Navigator

```tsx
// src/navigation/AppNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../store/authStore";
import { AuthNavigator } from "./AuthNavigator";
import { PlayerNavigator } from "./PlayerNavigator";
import { AdminNavigator } from "./AdminNavigator";

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { user, role } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : role === "admin" ? (
          <Stack.Screen name="AdminApp" component={AdminNavigator} />
        ) : (
          <Stack.Screen name="PlayerApp" component={PlayerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

---

## 6. State Management

### Global State with Zustand

Manage user authentication and theme settings.

```tsx
// src/store/authStore.ts
import create from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  user: { id: string; username: string } | null;
  role: "player" | "admin" | null;
  token: string | null;
  login: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,
      login: (user, token) => set({ user, token, role: user.role }),
      logout: () => set({ user: null, token: null, role: null }),
    }),
    {
      name: "auth-storage",
      getStorage: () => AsyncStorage,
    }
  )
);
```

### Server State with React Query

Fetch, cache, and update server data.

```tsx
// src/api/hooks/useExercises.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../apiClient";

const fetchExercises = async () => {
  const { data } = await api.get("/exercises");
  return data;
};

export const useExercises = () => {
  return useQuery({ queryKey: ["exercises"], queryFn: fetchExercises });
};
```

---

## 7. Theme Implementation

Create a theme provider to handle light and dark modes.

```tsx
// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { useAuthStore } from "../store/authStore"; // Example of persisting theme choice

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme || "light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Add `dark` class to root element for NativeWind
  useEffect(() => {
    // This part is conceptual for React Native. 
    // NativeWind v4 will have better theme support.
    // For now, we pass theme context down.
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

## 8. Platform-Specific Adaptations

Use the `Platform` API for minor adjustments and platform-specific files for major differences.

### Minor Adjustments

```jsx
import { Platform } from "react-native";

const Header = () => (
  <View style={{ height: Platform.OS === "ios" ? 44 : 56 }} />
);

// With NativeWind
<View className="h-14 ios:h-11" />
```

### Major Differences

Use file extensions for platform-specific components.

- `MyComponent.ios.tsx`
- `MyComponent.android.tsx`

React Native will automatically pick the correct file.

**Example**: Use `ActionSheetIOS` on iOS and a custom bottom sheet on Android.

```tsx
// src/components/common/ActionSheet.ios.tsx
import { ActionSheetIOS } from "react-native";

export const showActionSheet = (options, onSelect) => {
  ActionSheetIOS.showActionSheetWithOptions(options, onSelect);
};

// src/components/common/ActionSheet.android.tsx
// ... implementation with a custom bottom sheet component
```

---

## 9. Accessibility Checklist

Ensure the app is usable by everyone.

- [ ] **Labels**: All interactive elements have an `accessibilityLabel`.
- [ ] **Roles**: Use `accessibilityRole` (e.g., `button`, `header`).
- [ ] **Hints**: Provide `accessibilityHint` for complex interactions.
- [ ] **Contrast**: Check all text has a minimum 4.5:1 contrast ratio.
- [ ] **Touch Targets**: Ensure all touch targets are at least 44x44pt.
- [ ] **Text Scaling**: Test all screens with font scaling up to 200%.
- [ ] **Screen Readers**: Test critical flows with VoiceOver (iOS) and TalkBack (Android).

**Example**:

```jsx
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Start Exercise"
  accessibilityHint="Begins the selected exercise timer"
  onPress={onStart}
>
  <Text>Start</Text>
</TouchableOpacity>
```

---

## 10. Asset Management

### Icons

Use `@expo/vector-icons` for a wide range of scalable icons.

```jsx
import { MaterialIcons } from "@expo/vector-icons";

<MaterialIcons name="fitness-center" size={24} color="#2E7D32" />
```

### Images

- Provide images in `@1x`, `@2x`, and `@3x` resolutions.
- Name them `image.png`, `image@2x.png`, `image@3x.png`.
- Use `expo-image` for optimized loading and caching.

```jsx
import { Image } from "expo-image";

<Image
  source={{ uri: "https://example.com/image.png" }}
  style={{ width: 100, height: 100 }}
  placeholder={require("../assets/placeholder.png")}
  transition={300}
/>
```

### Splash Screen & App Icon

Configure these in `app.json`.

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

---

This guide provides the foundation for building a consistent, high-quality UI. Refer to the **Design System** document for specific visual details and the **Information Architecture** for screen flows. Happy coding!
