# Information Architecture - Football Training App

## Overview

The Football Training App uses a dual-interface architecture with separate experiences for **Players** and **Admins**. This document defines the navigation structure, screen hierarchy, and content organization for both user types.

## Navigation Strategy

### Player Interface: Bottom Tab Navigation
Players use a **bottom tab bar** with 4 primary sections for quick access to core features. This pattern follows both iOS and Android conventions for primary navigation and is optimal for the target age group (8-18 years) who are familiar with this pattern from social media and gaming apps.

### Admin Interface: Drawer + Stack Navigation
Admins use a **navigation drawer** (hamburger menu) for accessing management features, combined with stack navigation for hierarchical flows. This pattern accommodates more complex administrative tasks while keeping the interface clean.

---

## Player Information Architecture

### Primary Navigation (Bottom Tabs)

#### 1. Home Tab 🏠
**Purpose**: Central hub for daily engagement, quick actions, and personalized content

**Content Hierarchy**:
```
Home
├── Welcome Header (Name, Points, Streak)
├── Today's Challenge Card
├── Quick Stats (Exercises completed today/week)
├── Recent Achievements (Last 3)
├── Suggested Exercises (3-5 personalized)
└── Continue Exercise (if in progress)
```

**Key Features**:
- Personalized greeting with player name
- Current streak display with fire emoji animation
- Today's challenge with progress indicator
- Quick access to continue incomplete exercises
- Celebration animations for achievements
- Pull-to-refresh for latest data

#### 2. Exercises Tab 💪
**Purpose**: Browse, search, and access all available exercises

**Content Hierarchy**:
```
Exercises
├── Search Bar
├── Filter Chips (Category, Difficulty)
├── Exercise Categories
│   ├── Warm-up
│   ├── Strength
│   ├── Agility
│   ├── Skill Development
│   ├── Endurance
│   └── Cool-down
├── Exercise List (by category)
│   └── Exercise Card
│       ├── Thumbnail Image
│       ├── Title
│       ├── Duration
│       ├── Difficulty Badge
│       ├── Points Value
│       └── Favorite Icon
└── Favorites Section (top)
```

**Exercise Detail Screen** (Stack Navigation):
```
Exercise Detail
├── Hero Image/Video
├── Title & Difficulty
├── Duration & Points
├── Description
├── Instructions (Numbered Steps)
├── Media Gallery (Images/Videos)
├── Start Exercise Button (Primary CTA)
├── Favorite Button
└── Related Exercises
```

**Exercise Execution Screen** (Modal):
```
Exercise Execution
├── Exercise Title
├── Timer/Counter (large, prominent)
├── Current Step Indicator
├── Pause/Resume Button
├── Complete Button (appears when timer done)
└── Exit Button (with confirmation)
```

#### 3. Leaderboard Tab 🏆
**Purpose**: View rankings, compete with teammates, and track position

**Content Hierarchy**:
```
Leaderboard
├── Time Period Selector (Weekly, Monthly, All-Time)
├── Filter Options
│   ├── My Club
│   ├── My Year Group
│   ├── My Gender
│   └── All Players
├── My Position Card (highlighted)
│   ├── Rank
│   ├── Name
│   ├── Points
│   ├── Exercises Completed
│   └── Trend Indicator (↑↓)
├── Top 3 Podium (Visual)
│   ├── 1st Place (Gold)
│   ├── 2nd Place (Silver)
│   └── 3rd Place (Bronze)
└── Ranked List (from 4th)
    └── Player Card
        ├── Rank Number
        ├── Player Name
        ├── Points
        └── Exercises Count
```

**Key Features**:
- Current user always visible (sticky header or highlighted)
- Smooth scrolling to user's position
- Pull-to-refresh for latest rankings
- Visual indicators for rank changes (up/down arrows)
- Celebration animation when reaching top 3
- Empty state encouragement if no completions yet

#### 4. Profile Tab 👤
**Purpose**: Personal statistics, achievements, settings, and account management

**Content Hierarchy**:
```
Profile
├── Profile Header
│   ├── Avatar/Initials
│   ├── Player Name
│   ├── Club / Year / Gender
│   └── Total Points
├── Statistics Section
│   ├── Total Exercises Completed
│   ├── Current Streak
│   ├── Longest Streak
│   ├── Favorite Category
│   └── Total Time Exercised
├── Achievements Section
│   ├── Achievement Grid
│   │   └── Achievement Badge
│   │       ├── Icon
│   │       ├── Title
│   │       ├── Progress (if locked)
│   │       └── Date Earned (if unlocked)
│   └── View All Link
├── Activity History
│   ├── Calendar View (optional)
│   └── Recent Activity List
│       └── Activity Item
│           ├── Exercise Name
│           ├── Date/Time
│           └── Points Earned
└── Settings Section
    ├── Change Password
    ├── Notifications Settings
    ├── Theme (Light/Dark)
    ├── Language (future)
    ├── Help & Support
    └── Logout
```

**Achievement Detail Screen** (Modal):
```
Achievement Detail
├── Large Badge Icon
├── Achievement Title
├── Description
├── Date Earned (or Progress)
├── Rarity Indicator
└── Share Button
```

---

## Admin Information Architecture

### Primary Navigation (Drawer)

**Drawer Menu Structure**:
```
Navigation Drawer
├── Admin Profile Header
│   ├── Name
│   ├── Role
│   └── Club Name
├── Dashboard (Home)
├── Players Management
├── Club Structure
├── Exercises Management
├── Exercise Store
├── Reports & Analytics
├── Settings
└── Logout
```

### Screen Details

#### 1. Dashboard (Home)
**Purpose**: Overview of club engagement and key metrics

**Content Hierarchy**:
```
Dashboard
├── Club Summary Cards
│   ├── Total Players
│   ├── Active Players (Last 7 Days)
│   ├── Total Exercises Completed
│   └── Average Engagement Rate
├── Recent Activity Feed
│   └── Activity Item
│       ├── Player Name
│       ├── Action (completed exercise, earned achievement)
│       ├── Timestamp
│       └── Points Earned
├── Top Performers (This Week)
│   └── Player Card (Top 5)
├── Quick Actions
│   ├── Add Player
│   ├── Add Exercise
│   └── View Reports
└── Alerts/Notifications
    └── Low engagement warnings
    └── New achievements earned
```

#### 2. Players Management
**Purpose**: Create, edit, and manage player accounts

**Content Hierarchy**:
```
Players Management
├── Search & Filter Bar
│   ├── Search by Name
│   └── Filter by Year/Gender
├── Add Player Button (FAB)
├── Player List
│   └── Player Card
│       ├── Name
│       ├── Username
│       ├── Year / Gender
│       ├── Last Active
│       ├── Total Points
│       └── Actions Menu (Edit, Reset Password, Delete)
└── Bulk Actions
    ├── Import Players (CSV)
    └── Export Player List
```

**Add/Edit Player Screen** (Modal or Stack):
```
Add/Edit Player
├── Form Fields
│   ├── Full Name *
│   ├── Username *
│   ├── Password *
│   ├── Confirm Password *
│   ├── Year Group * (Dropdown)
│   └── Gender * (Dropdown)
├── Save Button
└── Cancel Button
```

#### 3. Club Structure
**Purpose**: Define and manage club hierarchy (Club → Year → Gender)

**Content Hierarchy**:
```
Club Structure
├── Club Information
│   ├── Club Name
│   ├── Location
│   └── Admin Count
├── Hierarchy Tree View
│   └── Club (Root)
│       └── Year Group (e.g., 2015)
│           ├── Boys
│           │   └── Player Count
│           └── Girls
│               └── Player Count
├── Add Year Group Button
└── Edit Structure Button
```

**Add Year Group Screen**:
```
Add Year Group
├── Year Input (e.g., 2015)
├── Gender Options
│   ├── Boys (Checkbox)
│   └── Girls (Checkbox)
├── Create Button
└── Cancel Button
```

#### 4. Exercises Management
**Purpose**: View, add, edit, and assign exercises to club

**Content Hierarchy**:
```
Exercises Management
├── Tabs
│   ├── Club Exercises (Assigned to club)
│   └── Custom Exercises (Created by admin)
├── Search & Filter
│   ├── Search by Name
│   ├── Filter by Category
│   └── Filter by Difficulty
├── Add Exercise Button (FAB)
├── Exercise List
│   └── Exercise Card
│       ├── Thumbnail
│       ├── Title
│       ├── Category Badge
│       ├── Difficulty Badge
│       ├── Duration
│       ├── Source (Custom/Store)
│       └── Actions Menu
│           ├── Edit
│           ├── Remove from Club
│           ├── Share to Store (if custom)
│           └── Delete (if custom)
└── Bulk Actions
    └── Remove Selected
```

**Add/Edit Exercise Screen** (Stack):
```
Add/Edit Exercise
├── Form Fields
│   ├── Title *
│   ├── Description *
│   ├── Category * (Dropdown)
│   ├── Difficulty * (Dropdown)
│   ├── Duration (minutes) *
│   ├── Points Value (auto-calculated)
│   ├── Instructions (Rich Text)
│   ├── Media Upload
│   │   ├── Add Images
│   │   └── Add Video
│   └── Visibility
│       ├── Club-Specific (Radio)
│       └── Share to Store (Radio)
├── Preview Button
├── Save Button
└── Cancel Button
```

#### 5. Exercise Store
**Purpose**: Browse and add exercises from global library

**Content Hierarchy**:
```
Exercise Store
├── Search Bar
├── Filter Options
│   ├── Category
│   ├── Difficulty
│   └── Rating
├── Featured Exercises Section
├── Popular Exercises Section
├── New Exercises Section
└── All Exercises List
    └── Exercise Card
        ├── Thumbnail
        ├── Title
        ├── Category & Difficulty
        ├── Rating (Stars)
        ├── Creator Club
        ├── Preview Button
        └── Add to Club Button
```

**Exercise Store Detail** (Modal):
```
Exercise Store Detail
├── Exercise Information (same as player view)
├── Rating & Reviews
│   └── Review Item
│       ├── Club Name
│       ├── Rating
│       └── Comment
├── Add to Club Button (Primary)
└── Close Button
```

#### 6. Reports & Analytics
**Purpose**: View detailed engagement metrics and export reports

**Content Hierarchy**:
```
Reports & Analytics
├── Date Range Selector
├── Overview Metrics
│   ├── Total Completions
│   ├── Active Players
│   ├── Average Session Duration
│   └── Engagement Rate
├── Charts Section
│   ├── Completions Over Time (Line Chart)
│   ├── Exercises by Category (Pie Chart)
│   ├── Top Performers (Bar Chart)
│   └── Engagement by Day of Week (Bar Chart)
├── Detailed Tables
│   ├── Player Engagement Table
│   │   └── Player, Exercises, Points, Last Active
│   ├── Exercise Popularity Table
│   │   └── Exercise, Completions, Avg Rating
│   └── Achievement Distribution Table
├── Export Options
│   ├── Export as PDF
│   ├── Export as CSV
│   └── Share Report
└── Schedule Report (Future)
```

#### 7. Settings
**Purpose**: Admin account and app configuration

**Content Hierarchy**:
```
Settings
├── Admin Profile
│   ├── Name
│   ├── Email
│   └── Change Password
├── Club Settings
│   ├── Club Name
│   ├── Club Logo (Upload)
│   └── Club Colors
├── Notification Settings
│   ├── Email Notifications
│   ├── Push Notifications
│   └── Notification Frequency
├── App Preferences
│   ├── Theme (Light/Dark/Auto)
│   └── Language (Future)
├── Support & Help
│   ├── Help Documentation
│   ├── Contact Support
│   └── Report Issue
└── About
    ├── App Version
    ├── Terms of Service
    └── Privacy Policy
```

---

## Cross-Cutting Screens

### Authentication Flow

**Login Screen**:
```
Login
├── Club Selection (Dropdown)
├── Year Group Selection (Dropdown)
├── Gender Selection (Dropdown)
├── Username Input
├── Password Input
├── Show/Hide Password Toggle
├── Login Button
├── Forgot Password Link
└── Admin Login Link
```

**Admin Login Screen**:
```
Admin Login
├── Username/Email Input
├── Password Input
├── Show/Hide Password Toggle
├── Login Button
├── Forgot Password Link
└── Back to Player Login Link
```

**Forgot Password Screen**:
```
Forgot Password
├── Instruction Text
├── Username Input
├── Submit Button
└── Back to Login Link
```

### Onboarding Flow (First-Time Users)

**Onboarding Screens** (3-5 screens):
```
Onboarding
├── Screen 1: Welcome
│   ├── App Logo
│   ├── Welcome Message
│   └── "Get Started" Button
├── Screen 2: How It Works
│   ├── Illustration
│   ├── Explanation of exercises
│   └── Next Button
├── Screen 3: Compete & Win
│   ├── Illustration
│   ├── Explanation of leaderboards
│   └── Next Button
├── Screen 4: Earn Achievements
│   ├── Illustration
│   ├── Explanation of badges
│   └── Next Button
└── Screen 5: Let's Go
    ├── Motivational Message
    └── "Start Training" Button
```

### Common Modals

**Confirmation Dialog**:
```
Confirmation Dialog
├── Title
├── Message
├── Primary Action Button
└── Cancel Button
```

**Success/Error Toast**:
```
Toast Notification
├── Icon (Success/Error)
├── Message
└── Auto-dismiss (3 seconds)
```

**Loading State**:
```
Loading Overlay
├── Spinner/Skeleton Screen
└── Loading Message (optional)
```

---

## Navigation Patterns Summary

### Player Navigation Flow
```
Bottom Tabs (Persistent)
├── Home → Exercise Detail → Exercise Execution (Modal)
├── Exercises → Exercise Detail → Exercise Execution (Modal)
├── Leaderboard → (No sub-navigation)
└── Profile → Achievement Detail (Modal)
              → Settings → Change Password
              → Activity History
```

### Admin Navigation Flow
```
Drawer (Accessible from all screens)
├── Dashboard → Player Detail
├── Players → Add/Edit Player (Modal/Stack)
├── Club Structure → Add Year Group (Modal)
├── Exercises → Add/Edit Exercise (Stack)
│            → Exercise Detail (Modal)
├── Exercise Store → Store Exercise Detail (Modal)
├── Reports → Export Options
└── Settings → Sub-settings screens
```

---

## Content Organization Principles

### Hierarchy
1. **Primary Actions**: Bottom tabs (players), drawer menu (admins)
2. **Secondary Actions**: FABs, header buttons, card actions
3. **Tertiary Actions**: Overflow menus, swipe actions

### Grouping
- Related content grouped in cards or sections
- Clear visual separation between groups
- Consistent spacing using 8pt grid system

### Prioritization
- Most important content above the fold
- Progressive disclosure for advanced features
- Quick actions prominently placed

### Consistency
- Same content types use same layouts across screens
- Navigation patterns consistent throughout app
- Terminology consistent (e.g., "exercises" not "workouts")

---

## Screen Count Summary

### Player Screens
- **Primary**: 4 (Home, Exercises, Leaderboard, Profile)
- **Secondary**: 8 (Exercise Detail, Exercise Execution, Achievement Detail, Settings, Change Password, Activity History, Onboarding x3)
- **Total**: ~12 unique screens

### Admin Screens
- **Primary**: 7 (Dashboard, Players, Club Structure, Exercises, Store, Reports, Settings)
- **Secondary**: 10 (Add/Edit Player, Add Year Group, Add/Edit Exercise, Store Detail, Export Options, various settings screens)
- **Total**: ~17 unique screens

### Shared Screens
- **Authentication**: 3 (Login, Admin Login, Forgot Password)
- **Total Unique Screens**: ~32

---

## Next Steps

This information architecture will be used to:
1. Create detailed user journey maps for critical flows
2. Design wireframes for each screen
3. Define interaction patterns and transitions
4. Build the component library and design system
5. Create implementation specifications for developers
