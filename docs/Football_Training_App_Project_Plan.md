# Football Training App - Comprehensive Project Plan & Tech Stack Guide

**Project**: Football Training App for Youth Athletes  
**Generated**: February 5, 2026  
**Platform**: iOS and Android  
**Technology Stack**: React Native + Expo  
**Estimated Duration**: 21 weeks  
**Author**: Manus AI

---

## Executive Summary

This comprehensive project plan outlines the development of a mobile application designed to engage young football players during training breaks through gamified exercises, leaderboards, and community-based competition. The application targets youth football clubs across Norway and features a hierarchical club structure with admin-managed communities and player accounts.

The project will utilize **React Native with Expo** as the primary technology stack, ensuring compatibility with both the Manus sandbox environment and Antigravity (Claude) development workflows. The estimated timeline spans 21 weeks from planning to public launch, with a clear MVP focus followed by iterative enhancement phases.

This document serves as both a strategic planning guide and a technical reference for building the application, with special emphasis on **tech stack compatibility** between development environments and best practices for mobile app development targeting App Store and Google Play.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack Recommendations](#tech-stack-recommendations)
3. [Environment Compatibility Guide](#environment-compatibility-guide)
4. [Feature Roadmap](#feature-roadmap)
5. [Technical Architecture](#technical-architecture)
6. [Development Timeline](#development-timeline)
7. [Risk Assessment](#risk-assessment)
8. [Success Metrics](#success-metrics)
9. [Getting Started](#getting-started)

---

## Project Overview

### Problem Statement

Young football players need structured, engaging activities during training breaks to maintain motivation and improve their skills. Current solutions lack the gamification and community-based competition that resonates with youth athletes, particularly in the context of Norwegian football clubs where team cohesion and friendly competition are highly valued.

### Target Audience

The application serves two distinct user groups with different needs and interaction patterns.

**Primary Users: Youth Football Players**

The primary users are boys and girls aged 8-18 who are members of football clubs. These players seek engaging activities during training breaks, opportunities to compete with peers, and ways to track their progress. They value social recognition through leaderboards and achievements, and they respond well to gamification elements that make exercise completion feel rewarding and fun.

**Secondary Users: Club Administrators**

Club administrators, including coaches and team managers, need tools to organize their club structure, manage player accounts, curate exercise content, and monitor engagement. They require simple administrative interfaces that don't demand technical expertise, along with the ability to customize content for their specific club while also benefiting from a shared exercise library.

**Geographic Focus**

The initial launch targets Norwegian football clubs, with plans to expand to other Nordic countries and eventually broader European markets. The application will initially support Norwegian language only, with internationalization planned for future phases.

### Business Model

The application will operate on a **freemium model** where basic features are available to all clubs at no cost, while premium features require subscription. This approach lowers the barrier to entry for clubs while creating a sustainable revenue stream as the platform grows.

**Subscription Tiers**

Individual clubs can subscribe for premium features including advanced analytics, custom branding, and unlimited exercise creation. Regional football associations can purchase organization-wide licenses covering multiple clubs at discounted rates. The exercise marketplace will allow clubs to share premium exercise content, with potential revenue sharing for popular content creators.

**Future Revenue Opportunities**

As the platform matures, sponsorship opportunities within the app could provide additional revenue. Local sports brands, equipment suppliers, and nutrition companies may be interested in targeted advertising to engaged youth athletes and their families.

### Key Success Metrics

Success will be measured through multiple dimensions that capture both user engagement and business growth.

**User Engagement Metrics**

Daily active users (DAU) per club should reach 60% or higher, indicating that the majority of registered players are using the app regularly. Exercise completion rate should exceed 70%, demonstrating that users find the exercises accessible and motivating. Average session duration should fall between 5-10 minutes, appropriate for training break activities.

**Growth Metrics**

The platform should onboard 10 clubs within the first three months, growing to 50-100 clubs by the end of year one. Player base should reach 500 active users in the first quarter, scaling to 2,000-5,000 by year end. Month-over-month growth should maintain at least 20% during the first year.

**Feature Adoption Metrics**

Leaderboard engagement should reach 80% of users viewing leaderboards weekly, confirming that competitive elements drive engagement. At least 50% of admins should add exercises from the shared store, validating the community-driven content model. Custom exercise creation should be adopted by 30% of clubs, indicating strong ownership of the platform.

**Technical Health Metrics**

App crash rate must remain below 1% to ensure reliability. API response times should stay under 500ms at the 95th percentile. App store ratings should target 4.5+ stars, reflecting high user satisfaction.

---

## Tech Stack Recommendations

### Why React Native + Expo?

React Native with Expo represents the optimal choice for this project based on several key factors. The need to launch simultaneously on both iOS and Android makes a cross-platform solution essential, and React Native offers the best balance of development speed, performance, and ecosystem maturity.

**Development Efficiency**

A single codebase dramatically reduces development time and maintenance overhead compared to native development. The team can iterate quickly on features and deploy updates to both platforms simultaneously. Expo's managed workflow further streamlines development by handling native configuration and providing over-the-air updates.

**Performance Characteristics**

For this application's use case—displaying exercise content, managing leaderboards, and tracking user progress—React Native provides more than adequate performance. The app doesn't require intensive graphics rendering, complex animations, or real-time processing that would necessitate native development.

**Ecosystem and Community**

React Native has the largest ecosystem among cross-platform frameworks, with extensive libraries for navigation, state management, UI components, and platform integrations. The active community ensures that solutions exist for most common challenges, and the framework receives strong backing from Meta and Microsoft.

**Team Expertise**

React Native leverages JavaScript/TypeScript skills that are widely available and transferable from web development. This makes hiring easier and allows developers to work across the full stack if needed.

### Complete Technology Stack

The following technology stack has been carefully selected to ensure compatibility with both Manus sandbox and Antigravity development environments while following mobile app best practices.

#### Frontend Framework

**React Native with Expo (Managed Workflow)**

React Native version 0.76+ with Expo SDK 52+ provides the foundation. The managed workflow simplifies configuration and deployment while still allowing custom native code when needed through Expo Dev Client. TypeScript will be used throughout for type safety and improved developer experience.

**UI and Styling**

NativeWind (TailwindCSS for React Native) enables rapid UI development with utility-first styling. This approach provides consistency with modern web development practices while maintaining excellent performance. For performance-critical components or complex animations, React Native's built-in StyleSheet API will be used. A custom component library will be developed to ensure design consistency across the application.

**Navigation**

React Navigation 7+ provides the navigation infrastructure with Stack, Tab, and Drawer navigators. Deep linking support will enable sharing of achievements and specific content. The navigation structure will support the three-level club hierarchy (Club → Year → Gender) with appropriate access controls.

#### State Management

**Global State: Zustand**

Zustand manages global application state including user authentication, app settings, and UI state. Its minimal boilerplate and excellent TypeScript support make it ideal for this project's complexity level. The simple API reduces cognitive overhead compared to Redux while providing all necessary functionality.

**Server State: React Query (TanStack Query)**

React Query handles all server state management including data fetching, caching, synchronization, and background updates. This separation of concerns keeps server data management clean and provides automatic loading, error, and success states. Optimistic updates will create a responsive user experience even on slower connections.

**Context API**

React Context will handle theme preferences (light/dark mode) and localization settings. These infrequently-changing values are well-suited to Context without the performance concerns that arise from overuse.

#### Backend and Database

**Backend API**

A custom backend API built with either Node.js + Express or Python + FastAPI provides full control over business logic and scalability. The API will be RESTful with potential GraphQL endpoints for complex queries. JWT-based authentication provides stateless, scalable user sessions.

**Database**

PostgreSQL serves as the primary database for relational data including users, clubs, exercises, scores, and achievements. Its robust feature set, excellent performance, and strong consistency guarantees make it ideal for this application. Drizzle ORM provides type-safe database queries with excellent TypeScript integration.

If using the Manus web-db-user scaffold, MySQL/TiDB can be substituted with minimal changes to the data model. The schema design remains compatible across both database systems.

**Local Database**

expo-sqlite provides offline data caching on the device. Exercise library content, user statistics, and leaderboard snapshots will be cached locally to enable offline viewing. A synchronization strategy will handle conflict resolution when the device reconnects.

#### Authentication and Security

**Authentication System**

Custom JWT-based authentication provides a simple username/password system appropriate for the target audience. Since players are youth athletes, the system avoids email requirements while maintaining security. Tokens are stored securely using expo-secure-store, which leverages iOS Keychain and Android Keystore.

If using the Manus web-db-user scaffold, Manus-OAuth integration is available as an alternative authentication provider. The modular authentication design allows switching between providers with minimal code changes.

**Security Measures**

All API communication uses HTTPS with certificate pinning for critical endpoints. Passwords are hashed using bcrypt with appropriate salt rounds. Rate limiting prevents brute force attacks. Input validation and sanitization protect against injection attacks. GDPR compliance measures include minimal data collection, clear privacy policies, and user data export capabilities.

#### Media Storage and Delivery

**Cloud Storage**

AWS S3 or Cloudflare R2 stores exercise images and videos. CloudFront or Cloudflare CDN provides fast global delivery with edge caching. Media files are optimized before upload with appropriate compression and multiple resolutions for different device sizes.

**Media Handling**

expo-image provides optimized image loading with automatic caching, placeholder support, and progressive loading. expo-av handles video playback with controls for play, pause, and seek. Lazy loading ensures that only visible content is loaded, improving performance and reducing data usage.

#### Push Notifications

Expo Push Notifications provides a simple, unified API for both iOS and Android. Notifications will be sent for new challenges, achievement unlocks, and leaderboard position changes. Firebase Cloud Messaging serves as an alternative if more advanced features are needed.

#### Analytics and Monitoring

**Usage Analytics**

Expo Analytics tracks basic usage patterns including screen views, session duration, and feature usage. PostHog or Mixpanel provides advanced user behavior analytics with funnels, cohorts, and retention analysis. Events are tracked for all key user actions to understand engagement patterns.

**Error Tracking**

Sentry captures and reports errors and crashes with full stack traces, device information, and user context. Source maps enable readable stack traces even in production builds. Performance monitoring identifies slow API calls and rendering bottlenecks.

#### Testing Infrastructure

**Unit Testing**

Jest provides the testing framework for utility functions, custom hooks, and business logic. Tests achieve 80%+ code coverage with focus on critical paths and edge cases.

**Component Testing**

React Native Testing Library tests components by simulating user interactions rather than testing implementation details. This approach creates more maintainable tests that don't break with refactoring.

**End-to-End Testing**

Detox or Maestro tests critical user flows including authentication, exercise completion, and leaderboard viewing. E2E tests run on both iOS and Android to catch platform-specific issues.

**Manual Testing**

Expo Go enables rapid manual testing during development. A device test lab with various iOS and Android devices ensures compatibility across the target device matrix.

#### CI/CD Pipeline

**Build System**

EAS Build creates production builds for both iOS and Android with consistent configuration. Cloud-based builds eliminate "works on my machine" issues and enable building iOS apps without a Mac.

**Automated Testing**

GitHub Actions runs automated tests on every pull request. Tests must pass before merging to main branch. Code quality checks include ESLint, Prettier, and TypeScript compilation.

**Deployment**

EAS Submit automates submission to App Store and Google Play. TestFlight provides iOS beta testing with up to 10,000 external testers. Google Play Internal Testing enables Android beta distribution.

**Development Tools**

Expo Dev Client allows testing custom native code without ejecting from managed workflow. React Native Debugger or Flipper provides debugging capabilities including network inspection, Redux state inspection, and performance profiling. ESLint and Prettier enforce code quality and consistency. Husky runs pre-commit hooks to catch issues before they reach the repository.

---

## Environment Compatibility Guide

### Developing in Antigravity (Claude)

When starting development in Antigravity, you'll want to initialize the project with Expo's standard tooling and then configure it for eventual migration to Manus.

**Project Initialization**

Use the Expo CLI to create a new project with TypeScript template. The command `npx create-expo-app@latest football-training-app --template` will prompt you to select the TypeScript template. This creates a clean project structure with TypeScript configuration already in place.

**Essential Dependencies**

Install the core dependencies immediately after project creation. React Navigation provides routing with `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`, and required dependencies `react-native-screens` and `react-native-safe-area-context`. Zustand handles state management. React Query manages server state. NativeWind provides Tailwind styling.

**Configuration Files**

Ensure all configuration is stored in version-controlled files rather than environment-specific settings. The `app.json` or `app.config.js` file should contain all Expo configuration. Environment variables should be managed through `.env` files with `.env.example` checked into version control. TypeScript configuration in `tsconfig.json` should match the Manus environment settings.

**Testing in Expo**

Use Expo Go for rapid testing during development. The iOS Simulator and Android Emulator provide more realistic testing environments. EAS Build creates development builds when you need to test custom native code or features not supported in Expo Go.

### Migrating to Manus Sandbox

The Manus sandbox provides a pre-configured environment that supports React Native development with some specific considerations.

**Sandbox Environment**

The Manus sandbox runs Ubuntu 22.04 with Node.js 22.13.0 and pnpm pre-installed. The React Native development environment is ready to use. Expo CLI and EAS Build are available. iOS Simulator and Android emulator can be used for testing.

**Project Transfer**

Transfer your project by pushing to a GitHub repository and cloning into the Manus sandbox. All dependencies should be listed in `package.json` so `pnpm install` recreates the environment. Environment variables should be configured through the Manus secrets management system.

**Using Manus Scaffolds**

If starting fresh in Manus, the `mobile-app` scaffold from `webdev_init_project` provides a pre-configured setup. This scaffold includes Expo, React Native, TypeScript, TailwindCSS, Drizzle ORM, MySQL/TiDB database, and Manus-OAuth authentication. The scaffold provides a complete starting point but can be customized to match your specific requirements.

**Build and Deployment**

EAS Build works identically in both environments. Configure EAS credentials for App Store and Google Play. Use EAS Submit for automated store submissions. TestFlight and Google Play Internal Testing provide beta distribution.

### Ensuring Compatibility

To ensure smooth transitions between environments, follow these best practices.

**Use Standard Packages**

Stick to well-maintained npm packages that work across environments. Avoid platform-specific tools or packages that require native compilation outside of Expo's supported modules. Test any new dependencies in both environments before committing to them.

**Version Control Everything**

All configuration files should be in version control. Use `.env.example` to document required environment variables without exposing secrets. Document any manual setup steps in a `SETUP.md` file.

**Environment Variables**

Use `expo-constants` to access environment variables consistently. Never hardcode API endpoints, keys, or configuration. Maintain separate configurations for development, staging, and production.

**Database Compatibility**

Design your database schema to work with both PostgreSQL (preferred) and MySQL/TiDB (Manus scaffold). Avoid database-specific features that don't translate between systems. Use Drizzle ORM to abstract database differences.

**Testing Across Environments**

Regularly test in both Expo and Manus environments during development. Automated tests should run in CI/CD regardless of where development occurs. Manual testing should cover both iOS Simulator and Android Emulator.

---

## Feature Roadmap

### Phase 1: MVP (Must Have)

The MVP focuses on core functionality that delivers immediate value to users while establishing the foundation for future features. This phase must be completed before any public launch.

#### User Management

**Admin Capabilities**

Admins can create their account and log in to access administrative functions. They can create player accounts by providing username and password, without requiring email addresses. Admins assign players to the appropriate club, year group, and gender category. Basic profile management allows admins to update player information and reset passwords when needed.

**Player Capabilities**

Players begin by selecting their club, year group, and gender from available options. They then log in using the username and password provided by their admin. Basic profile viewing allows players to see their information and statistics. Password change functionality enables players to update their credentials for security.

#### Club Hierarchy Management

**Structure Creation**

Admins create the three-level hierarchy starting with the club (e.g., "Våganes"), then year groups (e.g., "2015"), and finally gender categories ("Boys" or "Girls"). The system supports multiple clubs, each with their own hierarchy. New clubs can connect to existing structures, making it easy for clubs to onboard without duplicating setup work.

**Player Assignment**

Players are assigned to specific positions in the hierarchy, determining which leaderboards they appear on and which exercises they can access. The flexible structure accommodates different organizational models while maintaining simplicity for most use cases.

**Member Viewing**

Admins can view all members within their club structure, organized by year and gender. This provides visibility into the community and helps with player management.

#### Exercise Library

**Admin Exercise Management**

Admins view a pool of available exercises with details including name, description, duration, and difficulty. They can add exercises from this pool to their club, making them available to their players. Exercise details include clear instructions, media (images or videos), and expected duration.

**Player Exercise Access**

Players view exercises assigned to their club, organized by category or difficulty. Exercise details provide clear instructions with supporting media. Players can mark exercises as favorites for quick access.

#### Exercise Execution

**Completion Workflow**

Players select an exercise to begin. Instructions and media guide them through the exercise. A timer or counter helps track exercise duration. Upon completion, players self-report by tapping a "Complete" button. The system awards points based on the exercise difficulty and duration.

**Progress Tracking**

Players see their total points and completed exercises. A simple history shows recent completions. Streak tracking encourages daily engagement.

#### Leaderboard System

**Leaderboard Views**

Leaderboards display at multiple levels including club-wide, year group, and gender category. Individual rankings show each player's position, points, and completed exercises. The current user's position is highlighted for easy reference.

**Ranking Logic**

Rankings are based on total points earned from completed exercises. Ties are broken by number of exercises completed, then by most recent activity. Leaderboards update in real-time as exercises are completed.

### Phase 2: Enhanced Features (Should Have)

Phase 2 builds on the MVP with features that significantly enhance the user experience and increase engagement. These features should be developed within 3-6 months after MVP launch.

#### Enhanced Exercise Management

**Custom Exercise Creation**

Admins can create custom exercises specific to their club's training needs. The creation interface includes fields for name, description, instructions, duration, difficulty, and category. Admins can upload images or videos to illustrate the exercise. Custom exercises can be marked as club-specific or shared to the global store.

**Exercise Organization**

Exercises are organized by categories such as "Warm-up," "Strength," "Agility," "Skill Development," and "Cool-down." Tags enable more granular organization and searching. Difficulty levels (Beginner, Intermediate, Advanced) help players choose appropriate exercises.

#### Exercise Store

**Global Exercise Sharing**

Admins can share their custom exercises to a global store accessible to all clubs. The store displays exercises with preview images, descriptions, difficulty ratings, and user reviews. Admins browse the store and add exercises to their club with a single tap.

**Quality Control**

Exercise ratings and reviews help surface high-quality content. Popular exercises are featured prominently. A reporting system allows flagging inappropriate content. Moderation ensures the store maintains quality standards.

#### Advanced Gamification

**Achievement System**

Achievements reward specific accomplishments such as "Complete 10 exercises," "7-day streak," "Try all exercise categories," and "Reach 1000 points." Each achievement has a badge icon and description. Achievement notifications celebrate player accomplishments.

**Streak Tracking**

The system tracks consecutive days of exercise completion. Streak milestones (7, 30, 100 days) award bonus points. Streak recovery allows one missed day without breaking the streak. Visual indicators show current streak and longest streak.

**Challenge System**

Weekly challenges encourage specific behaviors such as "Complete 5 agility exercises this week" or "Earn 500 points this week." Monthly challenges provide longer-term goals. Challenge completion awards bonus points and special badges.

#### Enhanced Leaderboards

**Multiple Time Periods**

Leaderboards can be viewed for different time periods including weekly, monthly, and all-time. This allows players to compete on fresh terms each week while still recognizing long-term achievement. Time period selection is prominent in the UI.

**Filtering Options**

Users can filter leaderboards by age group, gender, or specific year groups. This enables more relevant comparisons and encourages participation from all skill levels.

**Team Leaderboards**

Clubs can create teams within their organization. Team leaderboards aggregate points from team members. This encourages collaboration and team spirit.

#### Push Notifications

**Notification Types**

New challenge notifications alert players when weekly or monthly challenges begin. Achievement notifications celebrate when players earn badges or reach milestones. Leaderboard notifications inform players when they move up in rankings. Reminder notifications encourage players to maintain their streak.

**Notification Settings**

Players can customize which notifications they receive. Quiet hours prevent notifications during specified times. Notification frequency can be adjusted from immediate to daily digest.

### Phase 3: Advanced Features (Could Have)

Phase 3 features represent longer-term enhancements that add significant value but aren't critical for initial success. These should be considered 6-12 months after launch based on user feedback and engagement metrics.

#### Social Features

**Enhanced Player Profiles**

Player profiles display detailed statistics including total points, exercises completed, achievements earned, current streak, and favorite exercises. Activity feeds show recent accomplishments. Profile customization allows players to add avatars and personal information.

**Social Sharing**

Players can share achievements to social media platforms like Instagram and Facebook. Shareable graphics highlight accomplishments with club branding. Deep links bring friends directly to the app download page.

**Exercise Comments**

Players can comment on exercises to share tips, ask questions, or provide encouragement. Comments are moderated to maintain a positive environment. Popular comments are highlighted.

**Following System**

Players can follow friends and teammates to see their activity. A feed shows recent accomplishments from followed players. This creates social motivation and friendly competition.

#### Advanced Analytics

**Personal Progress Charts**

Visual charts show exercise completion over time. Category breakdowns reveal which exercise types players prefer. Progress toward goals is visualized with progress bars and projections.

**Club Dashboard**

Admins access a dashboard showing club-wide statistics including total exercises completed, most popular exercises, engagement trends, and leaderboard highlights. Export functionality allows sharing reports with club leadership.

**Exercise Insights**

Analytics show which exercises are most popular, have highest completion rates, and receive best ratings. This data informs content curation decisions.

#### Exercise Verification

**Photo/Video Proof**

Players can optionally submit photo or video proof of exercise completion. The camera interface guides proper framing and lighting. Submissions are stored securely and associated with the exercise completion record.

**Admin Review**

Admins can review submitted proof and approve or reject completions. Approved completions award bonus points. Verification badges indicate verified players on leaderboards.

**Automated Verification**

Computer vision could eventually verify certain exercises automatically. This reduces admin burden while maintaining integrity. Human review remains available for edge cases.

#### Wearable Integration

**Fitness Tracker Connection**

Players can connect fitness trackers and smartwatches to automatically track certain exercises. Step counts, heart rate, and workout duration can be imported. Supported platforms include Apple Health, Google Fit, and Fitbit.

**Auto-Tracking**

When connected devices detect workouts matching exercise descriptions, the app can suggest marking those exercises as complete. Players confirm or reject the suggestion. This reduces friction for exercise logging.

**Enhanced Metrics**

Wearable data provides richer insights including heart rate during exercises, calories burned, and workout intensity. These metrics can inform personalized recommendations.

### Features Explicitly Out of Scope

The following features have been considered but are explicitly excluded from the current roadmap. They may be reconsidered in future planning cycles based on user demand and strategic priorities.

**Live Video Coaching**

Real-time video coaching would require significant infrastructure investment and ongoing content creation. The complexity and cost don't align with the MVP focus on self-directed exercise during training breaks.

**In-App Messaging**

Direct messaging between players raises moderation concerns given the youth audience. The potential for inappropriate communication outweighs the benefits. Social features will focus on public, moderated interactions.

**Payment Processing**

In-app payment processing adds complexity and regulatory requirements. The initial freemium model will use external payment processing for subscriptions. In-app purchases may be considered for Phase 3 if needed.

**Multi-Language Support**

The initial launch targets Norwegian clubs exclusively. Internationalization infrastructure would slow MVP development. Language support will be added when expanding to new markets.

**Web Application**

A web version would require significant additional development effort. The mobile-first approach aligns with the target audience's device preferences. A web admin portal may be considered for Phase 2 to simplify club management.

---

## Technical Architecture

### System Architecture Overview

The application follows a client-server architecture with clear separation between the mobile client, backend API, and data storage layers. This architecture supports the scalability requirements while maintaining simplicity for the MVP phase.

#### Mobile Application Layer

The React Native mobile application runs on iOS and Android devices. It handles all user interface rendering, local state management, and offline data caching. The app communicates with the backend API over HTTPS for authentication, data synchronization, and real-time updates.

**Module Organization**

The codebase is organized into feature-based modules including Authentication, Club Management, Exercise Library, Exercise Execution, Leaderboards, and Gamification. Each module contains its own components, hooks, services, and types. Shared utilities and components live in a common directory.

**Offline Capabilities**

The app uses expo-sqlite to cache exercise content, user statistics, and leaderboard snapshots. When offline, users can view cached content and mark exercises as complete. Completions are queued locally and synchronized when connectivity returns. Conflict resolution handles cases where the same data was modified on multiple devices.

**State Management Architecture**

Zustand stores manage global state including authentication status, user profile, and UI preferences. React Query manages all server state with automatic caching, background refetching, and optimistic updates. The separation between global state and server state prevents common pitfalls and improves performance.

#### Backend API Layer

The backend API provides RESTful endpoints for all client operations. It handles authentication, authorization, business logic, and data persistence. The API is stateless, enabling horizontal scaling as user base grows.

**Service Architecture**

The backend is organized into services including Auth Service (registration, login, token management), User Service (profile management, player creation), Club Service (hierarchy management, member assignment), Exercise Service (exercise CRUD, store management), Score Service (completion tracking, leaderboard calculation), and Notification Service (push notification delivery).

**Authentication Flow**

Players and admins authenticate using username and password. The server validates credentials and returns a JWT token. Tokens include user ID, role (admin/player), and club hierarchy position. Tokens expire after 7 days, requiring re-authentication. Refresh tokens enable silent re-authentication without requiring password entry.

**Authorization Model**

Role-based access control enforces permissions. Admins can manage their club hierarchy and create players. Players can view exercises, complete exercises, and view leaderboards within their hierarchy. The exercise store is readable by all admins but writable only for exercises they created.

#### Data Layer

PostgreSQL stores all persistent data with a normalized schema optimized for the application's query patterns. Regular backups ensure data durability. Read replicas can be added as read traffic grows.

**Database Schema**

The Users table stores authentication credentials and profile information with columns for id, username, password_hash, role, club_id, year_group, gender, created_at, and last_login. The Clubs table contains club information with id, name, created_by_admin_id, settings (JSON), and created_at. The Exercises table stores exercise content with id, title, description, instructions, media_url, duration, difficulty, created_by_club_id, is_public, category, and tags. The Scores table tracks completions with id, user_id, exercise_id, points, completed_at, and verification_status. The Achievements table records earned achievements with id, user_id, achievement_type, earned_at, and metadata (JSON).

**Indexing Strategy**

Indexes are created on frequently queried columns including user_id, club_id, exercise_id, and completed_at. Composite indexes support common query patterns like leaderboard generation. Index usage is monitored and optimized based on actual query patterns.

**Caching Strategy**

Redis caches frequently accessed data including leaderboards, exercise lists, and user profiles. Cache invalidation occurs when underlying data changes. Time-based expiration provides a fallback for cache consistency. The caching layer reduces database load and improves response times.

#### Media Storage Layer

Exercise images and videos are stored in AWS S3 or Cloudflare R2. CloudFront or Cloudflare CDN provides fast global delivery with edge caching. Media files are organized by exercise ID with multiple resolutions for different device sizes.

**Upload Pipeline**

Admins upload media through the mobile app. Files are uploaded directly to S3 using pre-signed URLs, bypassing the API server. After upload, the app notifies the API to update the exercise record with the media URL. Image processing generates thumbnails and multiple resolutions. Video processing creates adaptive bitrate streams for smooth playback.

**Delivery Optimization**

The CDN caches media files at edge locations for fast delivery. Appropriate cache headers ensure efficient client-side caching. Lazy loading prevents loading media until it's needed. Progressive loading shows low-resolution placeholders while full images load.

### Security Architecture

Security is built into every layer of the application to protect user data and prevent unauthorized access.

#### Transport Security

All communication between the mobile app and backend uses HTTPS with TLS 1.3. Certificate pinning prevents man-in-the-middle attacks on critical endpoints. API requests include authentication tokens in the Authorization header, never in URLs.

#### Authentication Security

Passwords are hashed using bcrypt with a cost factor of 12. Salts are unique per user and stored with the hash. JWT tokens are signed using RS256 with private keys stored securely. Token payloads include expiration times and user context. Refresh tokens use a separate signing key and longer expiration.

#### Authorization Enforcement

Every API endpoint validates the authentication token and checks authorization rules. Users can only access data within their club hierarchy. Admins can only manage their own club. The principle of least privilege guides all permission decisions.

#### Data Protection

Sensitive data is encrypted at rest in the database. Personal information is minimized to only what's necessary. GDPR compliance includes data export, deletion, and consent management. Regular security audits identify and address vulnerabilities.

#### Input Validation

All user input is validated on both client and server. SQL injection is prevented through parameterized queries. XSS attacks are prevented through proper output encoding. File uploads are validated for type, size, and content. Rate limiting prevents abuse and brute force attacks.

### Scalability Considerations

The architecture is designed to scale from the initial pilot clubs to thousands of clubs with hundreds of thousands of users.

#### Horizontal Scaling

The stateless API design enables running multiple API server instances behind a load balancer. Database read replicas handle read-heavy workloads. The caching layer reduces database load. Media delivery through CDN eliminates media serving from API servers.

#### Database Scaling

PostgreSQL handles the expected scale for year one with a single instance. Read replicas can be added as read traffic grows. Partitioning by club_id enables sharding if needed. Connection pooling prevents connection exhaustion.

#### Performance Optimization

Database queries are optimized with appropriate indexes. N+1 query problems are avoided through eager loading. API responses are paginated to limit data transfer. Background jobs handle non-critical processing. Monitoring identifies performance bottlenecks before they impact users.

---

## Development Timeline

### Overview

The project spans 21 weeks from initial planning to public launch. This timeline balances the need for a robust MVP with the urgency of bringing the product to market. The schedule includes buffer time for unexpected challenges and assumes a team of 5-6 people working full-time.

### Phase 1: Planning & Design (Weeks 1-3)

**Week 1: Requirements and Research**

The first week focuses on finalizing requirements and understanding the competitive landscape. Stakeholder interviews with club administrators and coaches clarify needs and priorities. User research with youth players validates the gamification approach and identifies motivational factors. Competitive analysis examines existing fitness and training apps to identify differentiation opportunities. Technical research evaluates specific libraries and services for the tech stack.

**Week 2: Information Architecture and Wireframes**

The second week translates requirements into concrete designs. Information architecture defines the navigation structure and content organization. User flow diagrams map out key journeys including onboarding, exercise completion, and leaderboard viewing. Wireframes provide low-fidelity layouts for all major screens. Usability testing with paper prototypes identifies navigation issues early.

**Week 3: Visual Design and Prototyping**

The third week produces high-fidelity designs ready for development. Visual design creates the look and feel including color palette, typography, iconography, and component styling. A design system documents reusable components and patterns. Interactive prototypes enable stakeholder review and user testing. Technical architecture documentation specifies the system design, API contracts, and database schema.

### Phase 2: MVP Development (Weeks 4-13)

**Week 4-5: Project Setup and Authentication**

Development begins with project initialization and foundational features. The React Native project is created with Expo and configured with TypeScript, ESLint, and Prettier. The backend API project is initialized with chosen framework and database. CI/CD pipelines are configured for automated testing and deployment. Authentication endpoints are implemented for registration and login. The mobile app implements login screens and authentication flow. JWT token management and secure storage are configured.

**Week 6-7: Club Hierarchy and User Management**

The club management system takes shape. Database schema is implemented for clubs, users, and hierarchy relationships. Admin screens enable creating club structure and managing players. Player assignment to club/year/gender is implemented. The mobile app implements club selection during login. Member listing and management screens are built.

**Week 8-9: Exercise Library**

Exercise content management is developed. The exercise database schema and API endpoints are created. Admin screens enable viewing and adding exercises from the pool. The exercise store backend infrastructure is built. Player screens display assigned exercises with details. Exercise detail views include media playback and instructions.

**Week 10-11: Exercise Execution and Scoring**

The core user experience of completing exercises is implemented. Exercise completion workflow with timer/counter is built. Score calculation and storage are implemented. The points system awards appropriate points for completions. Progress tracking shows user statistics and history. Streak tracking encourages daily engagement.

**Week 12-13: Leaderboards and Polish**

Competitive features and final MVP polish are completed. Leaderboard calculation generates rankings efficiently. Leaderboard screens display rankings at multiple hierarchy levels. Real-time updates refresh leaderboards as exercises are completed. UI polish improves animations, loading states, and error handling. Performance optimization addresses any identified bottlenecks. Bug fixes address issues found during development testing.

### Phase 3: Testing & QA (Weeks 14-16)

**Week 14: Automated Testing**

Comprehensive test coverage is developed. Unit tests cover utility functions, hooks, and business logic. Component tests verify UI behavior and user interactions. Integration tests validate API endpoints and database operations. End-to-end tests cover critical user flows on both iOS and Android.

**Week 15: Manual Testing and Bug Fixing**

Thorough manual testing identifies issues that automated tests miss. Device testing covers various iOS and Android devices and OS versions. Usability testing with target users identifies UX issues. Performance testing measures app launch time, screen transitions, and API response times. Accessibility testing ensures the app is usable by all players. Bug fixing addresses all identified issues with priority based on severity.

**Week 16: Security Audit and Documentation**

Final validation ensures the app is secure and well-documented. Security audit reviews authentication, authorization, and data protection. Penetration testing attempts to exploit vulnerabilities. Code review ensures quality and maintainability. Documentation includes API documentation, deployment guides, admin user guides, and player onboarding materials.

### Phase 4: Beta Testing (Weeks 17-19)

**Week 17: Beta Preparation and Recruitment**

The beta program is launched with a pilot club. TestFlight and Google Play Internal Testing are configured. Beta tester recruitment identifies an enthusiastic pilot club. Onboarding materials prepare beta testers for the experience. Feedback mechanisms enable easy bug reporting and feature requests. Analytics and monitoring are configured to track beta usage.

**Week 18-19: Beta Testing and Iteration**

Active beta testing provides real-world validation. User feedback is collected through surveys, interviews, and in-app feedback. Usage analytics reveal actual engagement patterns. Bug fixes address issues reported by beta testers. Feature refinements improve UX based on feedback. Performance optimization addresses any issues observed in production environment.

### Phase 5: Launch Preparation (Weeks 20-21)

**Week 20: Store Submission and Marketing**

Final preparations for public launch begin. App Store submission includes screenshots, descriptions, and metadata. Google Play submission follows similar process. App Store Optimization ensures discoverability. Marketing materials include website, social media content, and demo videos. Press outreach targets sports and technology media. Support infrastructure includes help documentation and support email.

**Week 21: Launch and Monitoring**

The app goes live to the public. Phased rollout starts with beta testers then expands to new clubs. Launch announcement reaches target audience through multiple channels. Active monitoring watches for crashes, errors, and performance issues. Support team responds to user questions and issues. Post-launch review assesses metrics against success criteria and plans next iteration.

### Timeline Summary Table

| Phase | Duration | Start Date | End Date | Key Deliverables |
|-------|----------|------------|----------|------------------|
| Planning & Design | 3 weeks | Feb 5, 2026 | Feb 26, 2026 | Requirements, wireframes, designs, architecture |
| MVP Development | 10 weeks | Feb 27, 2026 | May 8, 2026 | Functional app with core features |
| Testing & QA | 3 weeks | May 9, 2026 | May 30, 2026 | Test coverage, bug fixes, documentation |
| Beta Testing | 3 weeks | May 31, 2026 | Jun 21, 2026 | Beta validation, user feedback, refinements |
| Launch Preparation | 2 weeks | Jun 22, 2026 | Jul 6, 2026 | Store approval, marketing, public launch |

---

## Risk Assessment

### Technical Risks

Technical risks could impact the project timeline, quality, or feasibility. Each risk has been assessed for impact and likelihood, with mitigation strategies defined.

#### Backend Scalability Issues

**Risk Description**: The backend infrastructure may not handle growth in users and data volume, leading to slow response times or outages.

**Impact**: High - Poor performance drives user churn and damages reputation.

**Likelihood**: Medium - The initial scale is manageable, but rapid growth could expose issues.

**Mitigation Strategy**: Design for scalability from the start with stateless API architecture, database indexing, and caching. Conduct load testing before launch to identify bottlenecks. Monitor performance metrics continuously. Plan for horizontal scaling with load balancers and multiple API instances. Use database read replicas for read-heavy workloads. Implement rate limiting to prevent abuse.

#### Offline Sync Conflicts

**Risk Description**: When users complete exercises offline on multiple devices, synchronization could create conflicts or data loss.

**Impact**: Medium - Data loss frustrates users, but the impact is limited to individual completions.

**Likelihood**: Medium - Multi-device usage is common, especially if players share devices.

**Mitigation Strategy**: Implement a robust conflict resolution strategy that favors user data. Use timestamps and device IDs to detect conflicts. Queue offline actions and apply them in order when online. Provide user feedback when conflicts occur. Test offline scenarios extensively. Consider eventual consistency model where appropriate.

#### Media Storage Costs

**Risk Description**: Storing and delivering exercise videos could become expensive as content library grows.

**Impact**: Medium - High costs could impact profitability, but won't break the application.

**Likelihood**: High - Video content is inherently large and expensive to store and deliver.

**Mitigation Strategy**: Optimize media compression to reduce file sizes without sacrificing quality. Use CDN to reduce bandwidth costs through caching. Implement lazy loading so only viewed content is delivered. Consider tiered storage with older content on cheaper storage. Monitor costs closely and adjust strategy as needed. Potentially limit video uploads for free tier clubs.

#### Third-Party Service Outages

**Risk Description**: Dependencies on services like Expo, AWS, or push notification providers could cause outages.

**Impact**: Medium - Outages prevent some functionality but core features may still work.

**Likelihood**: Low - Major providers have high uptime, but outages do occur.

**Mitigation Strategy**: Implement graceful degradation so core features work even if some services are down. Use fallback providers where feasible. Monitor service status and communicate proactively with users during outages. Maintain status page showing system health. Cache data locally to enable offline functionality.

#### Platform-Specific Bugs

**Risk Description**: Differences between iOS and Android could cause bugs that only appear on one platform.

**Impact**: Medium - Platform-specific bugs frustrate users and create support burden.

**Likelihood**: Medium - React Native reduces but doesn't eliminate platform differences.

**Mitigation Strategy**: Test on both platforms regularly throughout development. Maintain a device test lab with various iOS and Android devices. Use platform-specific code sparingly and test it thoroughly. Monitor crash reports by platform to quickly identify platform-specific issues. Engage beta testers on both platforms.

### Business Risks

Business risks could impact adoption, revenue, or market position.

#### Low User Adoption

**Risk Description**: Clubs or players may not adopt the app due to lack of awareness, poor onboarding, or insufficient value proposition.

**Impact**: High - Without users, the business cannot succeed.

**Likelihood**: Medium - New products always face adoption challenges.

**Mitigation Strategy**: Beta test with pilot clubs to validate value proposition before broad launch. Gather feedback and iterate quickly based on user input. Provide excellent onboarding to demonstrate value immediately. Offer free tier to reduce adoption barriers. Invest in marketing to build awareness. Provide admin training and support to ensure successful club onboarding. Monitor engagement metrics and address drop-off points.

#### Competition from Existing Apps

**Risk Description**: Established fitness or training apps could add similar features or compete directly.

**Impact**: Medium - Competition could slow growth but doesn't prevent success.

**Likelihood**: Medium - The market has many fitness apps, though few target youth football specifically.

**Mitigation Strategy**: Focus on football-specific features and community building that generic apps can't replicate. Build strong relationships with clubs to create switching costs. Iterate quickly to stay ahead of competitors. Emphasize the club hierarchy and leaderboard features that create network effects. Consider partnerships with football associations to establish legitimacy.

#### Club Admin Churn

**Risk Description**: If admins stop using the app, their entire club community is lost.

**Impact**: High - Admin churn has multiplied impact due to their role managing player communities.

**Likelihood**: Low - Admins are motivated by player engagement, but could churn if the app is too difficult to use.

**Mitigation Strategy**: Provide excellent onboarding with training materials and personal support. Make admin tasks as simple as possible with intuitive interfaces. Regularly communicate with admins to gather feedback and address concerns. Provide analytics showing player engagement to demonstrate value. Consider admin community where admins can share best practices. Offer premium features that make admin work easier.

#### Data Privacy Concerns

**Risk Description**: Parents or clubs may have concerns about data collection and privacy, especially for youth users.

**Impact**: High - Privacy concerns could prevent adoption or create legal issues.

**Likelihood**: Low - The app collects minimal data, but concerns could still arise.

**Mitigation Strategy**: Implement GDPR compliance from the start with clear privacy policies. Collect only essential data and explain why it's needed. Provide data export and deletion capabilities. Obtain appropriate parental consent for users under 13. Be transparent about data practices. Conduct privacy impact assessment. Respond quickly to any privacy concerns.

#### Monetization Challenges

**Risk Description**: The freemium model may not generate sufficient revenue, or clubs may resist paying for premium features.

**Impact**: Medium - Insufficient revenue impacts sustainability but doesn't prevent initial launch.

**Likelihood**: Medium - Monetization is challenging for any new product.

**Mitigation Strategy**: Validate pricing with pilot clubs before launch. Offer generous free tier to build user base. Ensure premium features provide clear value. Consider multiple pricing tiers for different club sizes. Monitor conversion rates and adjust pricing strategy. Explore alternative revenue sources like sponsorships. Focus on building engaged user base before aggressive monetization.

### Security Risks

Security risks could compromise user data or system integrity.

#### Unauthorized Account Access

**Risk Description**: Weak passwords or stolen credentials could allow unauthorized access to accounts.

**Impact**: High - Account compromise damages trust and could expose personal information.

**Likelihood**: Medium - Youth users may choose weak passwords, and credential stuffing attacks are common.

**Mitigation Strategy**: Enforce strong password requirements with minimum length and complexity. Implement rate limiting on login attempts to prevent brute force attacks. Monitor for suspicious login patterns. Provide password reset functionality. Consider two-factor authentication for admin accounts. Educate users about password security. Use secure token storage with expo-secure-store.

#### Data Breach

**Risk Description**: A security vulnerability could expose user data to unauthorized parties.

**Impact**: High - Data breaches have severe legal, financial, and reputational consequences.

**Likelihood**: Low - Proper security practices reduce risk, but breaches can still occur.

**Mitigation Strategy**: Encrypt sensitive data at rest and in transit. Follow security best practices for authentication and authorization. Conduct regular security audits and penetration testing. Keep dependencies updated to patch known vulnerabilities. Implement intrusion detection and monitoring. Have incident response plan ready. Maintain appropriate insurance coverage.

#### Inappropriate Content in Exercises

**Risk Description**: Users could upload inappropriate images or videos as exercise content.

**Impact**: Medium - Inappropriate content damages the app's reputation and could harm young users.

**Likelihood**: Medium - User-generated content always carries this risk.

**Mitigation Strategy**: Implement content moderation with admin review before exercises are published. Provide reporting mechanism for inappropriate content. Use automated content filtering to flag potentially inappropriate media. Maintain clear community guidelines. Respond quickly to reports. Consider requiring admin approval for all custom exercises initially.

#### API Abuse

**Risk Description**: Malicious actors could abuse API endpoints to scrape data, spam the system, or cause outages.

**Impact**: Medium - API abuse could degrade performance or expose data.

**Likelihood**: Medium - Public APIs are frequently targeted by automated attacks.

**Mitigation Strategy**: Implement rate limiting on all API endpoints. Require authentication for all sensitive operations. Monitor for unusual traffic patterns. Use CAPTCHA for registration if bot activity is detected. Implement IP blocking for abusive sources. Log all API access for security analysis. Consider API gateway with DDoS protection.

---

## Success Metrics

### User Engagement Metrics

User engagement metrics reveal how actively users interact with the app and whether it delivers value.

#### Daily Active Users (DAU) per Club

**Target**: 60% or higher

**Measurement**: Count unique players who open the app and complete at least one action each day, calculated as a percentage of total registered players per club.

**Rationale**: High DAU indicates the app is part of players' daily routines. The 60% target accounts for the fact that not all players train every day.

**Action Threshold**: If DAU falls below 40%, investigate engagement barriers through user research and analytics. Consider push notification campaigns or new features to drive engagement.

#### Exercise Completion Rate

**Target**: 70% or higher

**Measurement**: Percentage of exercises started that are marked as complete.

**Rationale**: High completion rate indicates exercises are accessible and motivating. Low completion suggests exercises are too difficult, unclear, or uninteresting.

**Action Threshold**: If completion rate falls below 50%, review exercise difficulty levels, instruction clarity, and exercise variety. Consider adding more beginner-friendly exercises.

#### Average Session Duration

**Target**: 5-10 minutes

**Measurement**: Average time from app open to app close or background.

**Rationale**: This range is appropriate for training break activities. Too short suggests users aren't engaging deeply. Too long could indicate confusion or difficulty finding content.

**Action Threshold**: If session duration falls below 3 minutes, improve content discovery and reduce friction. If above 15 minutes, investigate whether users are stuck or if the app is being used differently than intended.

#### Leaderboard Engagement

**Target**: 80% of users view leaderboards weekly

**Measurement**: Percentage of active users who view leaderboard screen at least once per week.

**Rationale**: Leaderboards are a core engagement driver. High viewership indicates competitive elements are motivating.

**Action Threshold**: If engagement falls below 60%, make leaderboards more prominent in navigation, add push notifications for ranking changes, or introduce new leaderboard categories.

### Growth Metrics

Growth metrics track the expansion of the user base and platform adoption.

#### Clubs Onboarded

**Target**: 10 clubs in first 3 months, 50-100 clubs by end of year one

**Measurement**: Count of clubs with active admin accounts and at least 10 registered players.

**Rationale**: Club onboarding is the primary growth driver. Each club brings multiple players.

**Action Threshold**: If onboarding lags target by 30%, increase marketing efforts, improve admin onboarding experience, or offer incentives for early adopters.

#### Active Players

**Target**: 500 players in first 3 months, 2,000-5,000 by end of year one

**Measurement**: Count of player accounts that have completed at least one exercise in the past 30 days.

**Rationale**: Active players represent the engaged user base that creates value and potential revenue.

**Action Threshold**: If active players fall below target, focus on retention initiatives, improve onboarding, or expand to more clubs.

#### Month-over-Month Growth

**Target**: 20% or higher

**Measurement**: Percentage increase in active players from one month to the next.

**Rationale**: Sustained growth indicates product-market fit and effective user acquisition.

**Action Threshold**: If growth falls below 10% for two consecutive months, reassess marketing strategy, product positioning, or feature priorities.

### Feature Adoption Metrics

Feature adoption metrics reveal which features users find valuable and which need improvement.

#### Exercise Store Usage

**Target**: 50% of admins add exercises from store

**Measurement**: Percentage of admin users who have added at least one exercise from the global store to their club.

**Rationale**: Store usage validates the community-driven content model and reduces admin burden.

**Action Threshold**: If adoption falls below 30%, improve store discovery, add search and filtering, or feature high-quality exercises more prominently.

#### Custom Exercise Creation

**Target**: 30% of clubs create custom exercises

**Measurement**: Percentage of clubs that have created at least one custom exercise.

**Rationale**: Custom exercise creation indicates strong ownership and investment in the platform.

**Action Threshold**: If adoption falls below 15%, simplify the creation interface, provide templates, or offer training on creating effective exercises.

#### Streak Maintenance

**Target**: 40% of active users maintain 7+ day streaks

**Measurement**: Percentage of users who have completed exercises on 7 or more consecutive days.

**Rationale**: Streaks indicate habit formation and long-term engagement.

**Action Threshold**: If streak maintenance falls below 25%, add streak recovery features, send reminder notifications, or increase streak milestone rewards.

### Technical Health Metrics

Technical health metrics ensure the app is reliable and performant.

#### App Crash Rate

**Target**: Less than 1%

**Measurement**: Percentage of app sessions that end in a crash.

**Rationale**: Crashes frustrate users and drive uninstalls. Industry standard for quality apps is under 1%.

**Action Threshold**: If crash rate exceeds 1%, prioritize crash fixes above new features. Analyze crash reports to identify and fix root causes.

#### API Response Time

**Target**: Less than 500ms at 95th percentile

**Measurement**: Time from API request to response for 95% of requests.

**Rationale**: Fast response times create a responsive user experience. The 95th percentile captures typical performance while allowing for occasional slow requests.

**Action Threshold**: If response time exceeds 500ms, optimize slow queries, add caching, or scale infrastructure.

#### App Store Rating

**Target**: 4.5+ stars

**Measurement**: Average rating across App Store and Google Play.

**Rationale**: High ratings drive organic discovery and downloads. Ratings below 4.0 significantly hurt visibility.

**Action Threshold**: If rating falls below 4.0, aggressively address top user complaints. Implement in-app feedback to catch issues before they reach store reviews.

### Business Metrics

Business metrics track financial sustainability and market position.

#### Customer Acquisition Cost (CAC)

**Target**: To be defined based on lifetime value

**Measurement**: Total marketing and sales expenses divided by number of new clubs acquired.

**Rationale**: CAC must be significantly lower than customer lifetime value for sustainable growth.

**Action Threshold**: Monitor CAC closely and optimize marketing channels. If CAC exceeds lifetime value, adjust marketing strategy or improve retention to increase lifetime value.

#### Conversion Rate (Free to Paid)

**Target**: 15% of clubs convert to paid within 6 months

**Measurement**: Percentage of clubs that upgrade to paid subscription within 6 months of registration.

**Rationale**: Conversion rate indicates whether premium features provide sufficient value.

**Action Threshold**: If conversion falls below 10%, reassess premium feature value proposition, adjust pricing, or improve conversion funnel.

#### Monthly Recurring Revenue (MRR)

**Target**: To be defined based on business model

**Measurement**: Total subscription revenue per month.

**Rationale**: MRR indicates business sustainability and growth trajectory.

**Action Threshold**: Track MRR growth rate and compare to targets. Adjust pricing or features based on market response.

---

## Getting Started

### For Development in Antigravity (Claude)

If you're starting development in Antigravity before moving to Manus, follow these steps to initialize your project with the right foundation.

#### Step 1: Initialize Expo Project

Create a new Expo project with TypeScript template using the Expo CLI. Open your terminal and run:

```bash
npx create-expo-app@latest football-training-app --template
```

When prompted, select the "blank (TypeScript)" template. This creates a clean project structure with TypeScript already configured.

Navigate into your project directory:

```bash
cd football-training-app
```

#### Step 2: Install Core Dependencies

Install the essential dependencies for navigation, state management, and styling:

```bash
npx expo install react-navigation/native react-navigation/stack react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npm install zustand
npm install @tanstack/react-query
npm install nativewind
npm install --save-dev tailwindcss
```

#### Step 3: Configure NativeWind

Initialize Tailwind CSS configuration:

```bash
npx tailwindcss init
```

Update your `tailwind.config.js` to include your component paths:

```javascript
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update your `babel.config.js` to include NativeWind:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel"],
  };
};
```

#### Step 4: Set Up Project Structure

Create a clean project structure that will work well in both Antigravity and Manus:

```bash
mkdir -p src/{components,screens,navigation,services,hooks,types,utils}
mkdir -p src/features/{auth,clubs,exercises,leaderboard}
```

This structure organizes code by feature while keeping shared utilities accessible.

#### Step 5: Configure Environment Variables

Create a `.env.example` file to document required environment variables:

```
API_BASE_URL=https://api.example.com
EXPO_PUBLIC_API_KEY=your_api_key_here
```

Create a `.env` file for your actual values (this file should be in `.gitignore`):

```
API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_API_KEY=dev_key_12345
```

Install dotenv for environment variable management:

```bash
npm install react-native-dotenv
```

#### Step 6: Initialize Git Repository

Initialize Git and make your first commit:

```bash
git init
git add .
git commit -m "Initial project setup with Expo and TypeScript"
```

Create a repository on GitHub and push your code:

```bash
git remote add origin https://github.com/yourusername/football-training-app.git
git branch -M main
git push -u origin main
```

#### Step 7: Test Your Setup

Start the development server:

```bash
npx expo start
```

Test on iOS Simulator (macOS only):

```bash
npx expo start --ios
```

Test on Android Emulator:

```bash
npx expo start --android
```

Test with Expo Go on a physical device by scanning the QR code.

### For Development in Manus Sandbox

If you're starting fresh in Manus or migrating from Antigravity, follow these steps.

#### Step 1: Clone Your Repository (If Migrating)

If you've already started development in Antigravity, clone your repository into the Manus sandbox:

```bash
gh repo clone yourusername/football-training-app
cd football-training-app
```

Install dependencies using pnpm (pre-installed in Manus):

```bash
pnpm install
```

#### Step 2: Use Mobile App Scaffold (If Starting Fresh)

If starting fresh in Manus, use the mobile-app scaffold which provides a pre-configured setup:

The scaffold will prompt you for project details. Provide:
- Name: football-training-app
- Title: Football Training App
- Description: Gamified training exercises for youth football players

This creates a complete project structure with Expo, React Native, TypeScript, TailwindCSS, Drizzle ORM, MySQL/TiDB, and Manus-OAuth pre-configured.

#### Step 3: Configure Environment Variables

Set up environment variables through the Manus secrets management system. The following variables should be configured:

- `API_BASE_URL`: Your backend API endpoint
- `DATABASE_URL`: Database connection string (provided by scaffold)
- `JWT_SECRET`: Secret key for JWT token signing
- `AWS_ACCESS_KEY_ID`: AWS credentials for S3 (if using AWS)
- `AWS_SECRET_ACCESS_KEY`: AWS secret key

These can be accessed in your code through `expo-constants`.

#### Step 4: Set Up EAS Build

Configure EAS Build for creating production builds:

```bash
npx eas-cli login
npx eas build:configure
```

This creates an `eas.json` configuration file. Update it with your build profiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

#### Step 5: Test in Manus Environment

Start the Expo development server:

```bash
pnpm start
```

Test on iOS Simulator:

```bash
pnpm ios
```

Test on Android Emulator:

```bash
pnpm android
```

#### Step 6: Create Development Build

Create a development build for testing custom native code:

```bash
npx eas build --profile development --platform ios
npx eas build --profile development --platform android
```

Download and install the development build on your test devices.

### Next Steps After Setup

Once your development environment is configured, you're ready to begin implementing features.

#### Implement Authentication

Start with the authentication system as it's foundational for all other features. Create login and registration screens, implement JWT token management, set up secure token storage with expo-secure-store, and create authentication context with Zustand.

#### Build Club Hierarchy

Implement the club management system including database schema for clubs and hierarchy, admin screens for creating club structure, player assignment to club/year/gender, and club selection during player login.

#### Develop Exercise Library

Create the exercise content management system with exercise database schema and API, admin screens for managing exercises, player screens for viewing exercises, and exercise detail views with media playback.

#### Implement Core Features

Continue with exercise execution, scoring, and leaderboards following the feature roadmap outlined earlier in this document.

#### Set Up Testing

Establish your testing infrastructure early including Jest for unit tests, React Native Testing Library for component tests, and Detox or Maestro for E2E tests.

#### Configure CI/CD

Set up automated testing and deployment with GitHub Actions for running tests on pull requests, EAS Build for creating production builds, and EAS Submit for store submissions.

---

## Conclusion

This comprehensive project plan provides everything you need to successfully build and launch the Football Training App. The carefully selected technology stack ensures compatibility between Antigravity and Manus development environments while following mobile app best practices for App Store and Google Play deployment.

The 21-week timeline balances the need for a robust MVP with the urgency of bringing the product to market. The phased approach allows for iterative development and validation, reducing risk while maintaining momentum.

Success depends on maintaining focus on the core value proposition: engaging young football players through gamified exercises and community-based competition. The technical architecture supports this vision while remaining flexible enough to adapt as you learn from users.

As you begin development, refer back to this document for guidance on technology choices, feature priorities, and best practices. The mobile app development skills referenced throughout provide additional detailed guidance for specific implementation challenges.

Remember that this plan is a living document. As you gather feedback from users and learn more about what works, don't hesitate to adjust priorities and timelines. The goal is not to follow the plan rigidly, but to build an app that truly serves the needs of youth football players and their clubs.

Good luck with your development journey. The combination of React Native + Expo, thoughtful architecture, and focus on user engagement positions this project for success.

---

**Document Version**: 1.0  
**Last Updated**: February 5, 2026  
**Author**: Manus AI  
**Contact**: For questions about this plan or the Manus platform, visit https://help.manus.im
