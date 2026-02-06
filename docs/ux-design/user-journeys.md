# User Journey Maps - Football Training App

## Journey 1: Player First Exercise Completion

**Persona**: Emma (12-year-old motivated player)  
**Goal**: Complete her first exercise and earn points  
**Context**: Just logged in for the first time after coach set up her account

### Journey Steps

#### 1. Login
**Screen**: Login  
**Actions**:
- Selects club "Våganes FK" from dropdown
- Selects year "2013" from dropdown  
- Selects gender "Girls" from dropdown
- Enters username provided by coach
- Enters password provided by coach
- Taps "Login" button

**Emotions**: 😊 Curious, slightly uncertain  
**Pain Points**: Might forget password, needs to remember club/year/gender  
**Opportunities**: Save club/year/gender after first selection, password visibility toggle

#### 2. Onboarding (First Time Only)
**Screen**: Onboarding Flow (3 screens)  
**Actions**:
- Swipes through welcome screens
- Reads about exercises, leaderboards, achievements
- Taps "Start Training" on final screen

**Emotions**: 😃 Excited, motivated  
**Pain Points**: Might want to skip if eager to start  
**Opportunities**: Keep onboarding brief (3 screens max), allow skip option

#### 3. Home Screen Discovery
**Screen**: Home  
**Actions**:
- Sees welcome message with her name
- Notices "0 points" and "0 exercises completed"
- Sees suggested exercises section
- Reads "Today's Challenge" card

**Emotions**: 😊 Interested, ready to start  
**Pain Points**: Might feel overwhelmed by options  
**Opportunities**: Clear visual hierarchy, prominent "Start" buttons

#### 4. Browse Exercises
**Screen**: Exercises Tab  
**Actions**:
- Taps "Exercises" tab in bottom navigation
- Scrolls through exercise categories
- Sees "Beginner" difficulty badges
- Taps on "Ball Control Basics" exercise

**Emotions**: 😊 Exploring, choosing  
**Pain Points**: Too many choices could be paralyzing  
**Opportunities**: Recommend exercises based on skill level, clear difficulty indicators

#### 5. View Exercise Details
**Screen**: Exercise Detail  
**Actions**:
- Watches preview video
- Reads exercise description
- Sees "Duration: 5 minutes" and "Points: 50"
- Scrolls through step-by-step instructions
- Taps "Start Exercise" button

**Emotions**: 😊 Confident, understands what to do  
**Pain Points**: Instructions unclear, video doesn't load  
**Opportunities**: High-quality media, clear instructions, offline caching

#### 6. Complete Exercise
**Screen**: Exercise Execution  
**Actions**:
- Sees timer counting down from 5:00
- Follows instructions on screen
- Completes exercise as timer reaches 0:00
- Taps "Mark as Complete" button

**Emotions**: 😊 Focused, accomplished  
**Pain Points**: Accidentally exits, loses progress  
**Opportunities**: Confirmation before exit, save progress, motivational messages

#### 7. Celebrate Success
**Screen**: Success Modal  
**Actions**:
- Sees celebration animation (confetti)
- Reads "Great job! You earned 50 points!"
- Sees new total: "50 points"
- Sees achievement unlocked: "First Exercise Complete" badge
- Taps "Continue" button

**Emotions**: 😄 Proud, motivated to continue  
**Pain Points**: None - this is the reward moment  
**Opportunities**: Share achievement, suggest next exercise

#### 8. Check Leaderboard
**Screen**: Leaderboard  
**Actions**:
- Taps "Leaderboard" tab
- Sees her name on the list with 50 points
- Notices she's in 15th place (out of 25)
- Sees top 3 players with 200-500 points
- Feels motivated to climb higher

**Emotions**: 😊 Competitive, motivated  
**Pain Points**: Might feel discouraged if far behind  
**Opportunities**: Encourage progress, show achievable next milestone

### Journey Summary

**Total Time**: 8-10 minutes  
**Success Metrics**:
- Successfully completes first exercise
- Earns first achievement
- Views leaderboard
- Returns for second exercise within 24 hours

**Critical Success Factors**:
- Clear, simple login process
- Engaging onboarding that doesn't delay action
- Easy-to-understand exercise instructions
- Immediate positive feedback and rewards
- Visible progress on leaderboard

---

## Journey 2: Admin Creating Club Structure

**Persona**: Coach Kari (34-year-old coach)  
**Goal**: Set up club hierarchy and add first players  
**Context**: First time using the app, wants to onboard her U13 girls team

### Journey Steps

#### 1. Admin Registration/Login
**Screen**: Admin Login  
**Actions**:
- Opens app, taps "Admin Login" link
- Enters admin credentials (or registers if first time)
- Taps "Login" button

**Emotions**: 😐 Neutral, task-oriented  
**Pain Points**: Complicated registration process  
**Opportunities**: Simple registration, clear instructions

#### 2. Admin Onboarding
**Screen**: Admin Onboarding  
**Actions**:
- Sees admin-specific onboarding (2-3 screens)
- Learns about club setup, player management, exercises
- Taps "Get Started" button

**Emotions**: 😊 Informed, ready to set up  
**Pain Points**: Too much information at once  
**Opportunities**: Contextual help, skip option, link to detailed docs

#### 3. Dashboard Overview
**Screen**: Dashboard  
**Actions**:
- Sees empty dashboard with "Get Started" prompts
- Reads "Set up your club structure" card
- Taps "Set Up Club" button

**Emotions**: 😊 Clear next steps  
**Pain Points**: Unclear what to do first  
**Opportunities**: Guided setup wizard, clear CTAs

#### 4. Create Club Structure
**Screen**: Club Structure  
**Actions**:
- Sees club name "Rosenborg BK Youth" (from registration)
- Taps "Add Year Group" button
- Enters "2013" in year field
- Checks both "Boys" and "Girls" checkboxes
- Taps "Create" button
- Repeats for "2015" year group

**Emotions**: 😊 Making progress  
**Pain Points**: Unclear if she needs to add both genders separately  
**Opportunities**: Bulk creation, templates for common structures

#### 5. View Created Structure
**Screen**: Club Structure  
**Actions**:
- Sees tree view:
  - Rosenborg BK Youth
    - 2013
      - Boys (0 players)
      - Girls (0 players)
    - 2015
      - Boys (0 players)
      - Girls (0 players)
- Taps "Add Players" button

**Emotions**: 😊 Satisfied with structure  
**Pain Points**: None at this stage  
**Opportunities**: Visual confirmation, next step suggestion

#### 6. Navigate to Player Management
**Screen**: Players Management  
**Actions**:
- Automatically navigated to Players screen
- Sees empty player list
- Taps "Add Player" FAB button

**Emotions**: 😊 Ready to add players  
**Pain Points**: None  
**Opportunities**: Bulk import option prominently displayed

#### 7. Add First Player
**Screen**: Add Player Form  
**Actions**:
- Enters player name: "Emma Larsen"
- Enters username: "emma.larsen"
- Generates password: "Football2024!" (or auto-generated)
- Selects year: "2013"
- Selects gender: "Girls"
- Taps "Save" button

**Emotions**: 😊 Straightforward process  
**Pain Points**: Typing each player individually is time-consuming  
**Opportunities**: Auto-generate usernames, bulk import CSV

#### 8. See Success Confirmation
**Screen**: Players Management  
**Actions**:
- Sees success message: "Player added successfully"
- Sees Emma Larsen in player list
- Sees "Export credentials" option
- Taps "Export credentials" to get PDF with login info

**Emotions**: 😊 Accomplished, ready to add more  
**Pain Points**: Needs to share credentials with players  
**Opportunities**: Export options, print-friendly format

#### 9. Bulk Add Remaining Players
**Screen**: Players Management  
**Actions**:
- Taps "Import Players" button
- Downloads CSV template
- Fills in 19 more players in CSV
- Uploads CSV file
- Reviews import preview
- Confirms import

**Emotions**: 😊 Efficient, saves time  
**Pain Points**: CSV format errors, unclear template  
**Opportunities**: Clear template, validation, error messages

#### 10. Review and Share Credentials
**Screen**: Players Management  
**Actions**:
- Sees all 20 players listed
- Filters by "2013 Girls" to verify her team
- Taps "Export All Credentials" button
- Downloads PDF with all usernames/passwords
- Plans to print and distribute at next practice

**Emotions**: 😊 Satisfied, ready for players to use app  
**Pain Points**: Printing/distribution logistics  
**Opportunities**: Email credentials directly, QR codes for easy login

### Journey Summary

**Total Time**: 15-25 minutes  
**Success Metrics**:
- Club structure created successfully
- All players added (20 players)
- Credentials exported and ready to distribute
- Admin understands next steps (adding exercises)

**Critical Success Factors**:
- Intuitive club structure creation
- Efficient player addition (bulk import)
- Easy credential management and export
- Clear guidance on next steps

---

## Journey 3: Player Checking Leaderboard Position

**Persona**: Thomas (15-year-old competitive teen)  
**Goal**: Check his leaderboard position after completing exercises  
**Context**: Completed 3 exercises today, wants to see if he moved up in rankings

### Journey Steps

#### 1. Open App
**Screen**: Home (Background)  
**Actions**:
- Opens app from phone home screen
- App resumes to last screen (Home)
- Sees notification badge on Leaderboard tab

**Emotions**: 😊 Eager, competitive  
**Pain Points**: Slow app launch  
**Opportunities**: Fast app resume, show rank change notification

#### 2. Navigate to Leaderboard
**Screen**: Leaderboard  
**Actions**:
- Taps "Leaderboard" tab in bottom navigation
- Sees loading indicator briefly
- Leaderboard loads with latest data

**Emotions**: 😊 Anticipation  
**Pain Points**: Slow loading, stale data  
**Opportunities**: Optimistic updates, background refresh

#### 3. View Current Position
**Screen**: Leaderboard  
**Actions**:
- Sees his position card at top: "Rank #3" (up from #5)
- Sees green up arrow: "↑2"
- Sees his stats: "850 points, 17 exercises"
- Scrolls down to see full leaderboard

**Emotions**: 😄 Excited, proud  
**Pain Points**: None - he moved up!  
**Opportunities**: Celebration animation for rank improvements

#### 4. Analyze Competition
**Screen**: Leaderboard  
**Actions**:
- Looks at top 3 podium
  - 1st: Magnus - 1,200 points
  - 2nd: Siri - 950 points
  - 3rd: Thomas - 850 points (him)
- Calculates he needs 100 more points to reach 2nd place
- Scrolls to see who's behind him

**Emotions**: 😊 Strategic, planning  
**Pain Points**: Can't see detailed stats of other players  
**Opportunities**: Show point gaps, estimated exercises needed to advance

#### 5. Check Time Period Filters
**Screen**: Leaderboard  
**Actions**:
- Taps "Weekly" filter
- Sees he's #1 this week with 350 points
- Feels proud of weekly performance
- Switches back to "All-Time" view

**Emotions**: 😄 Validated, motivated  
**Pain Points**: None  
**Opportunities**: Highlight weekly wins even if all-time rank is lower

#### 6. Set Goal
**Screen**: Leaderboard  
**Actions**:
- Takes mental note: "Need 2 more exercises today to reach 900 points"
- Exits leaderboard
- Goes to Exercises tab to find high-point exercises

**Emotions**: 😊 Motivated, goal-oriented  
**Pain Points**: No way to set or track goals in app  
**Opportunities**: Goal-setting feature, progress tracking toward next rank

### Journey Summary

**Total Time**: 2-3 minutes  
**Success Metrics**:
- Quickly views current position
- Understands rank change
- Feels motivated to continue
- Returns to complete more exercises

**Critical Success Factors**:
- Fast loading with real-time data
- Clear rank change indicators
- Visual hierarchy (podium for top 3)
- Multiple time period views
- Easy comparison with competitors

---

## Journey 4: Admin Selecting Exercises from Store

**Persona**: Coach Kari  
**Goal**: Add 10 new exercises to her club from the exercise store  
**Context**: Players are getting bored with current exercises, needs fresh content

### Journey Steps

#### 1. Navigate to Exercise Store
**Screen**: Dashboard  
**Actions**:
- Opens drawer menu
- Taps "Exercise Store"
- Store screen loads

**Emotions**: 😊 Hopeful to find good content  
**Pain Points**: Unclear what's in the store  
**Opportunities**: Show preview of featured exercises on dashboard

#### 2. Browse Featured Exercises
**Screen**: Exercise Store  
**Actions**:
- Sees "Featured Exercises" section at top
- Scrolls through 5 featured exercises
- Sees high ratings (4.5+ stars)
- Taps on "Advanced Ball Control" exercise

**Emotions**: 😊 Interested  
**Pain Points**: None yet  
**Opportunities**: Personalized recommendations based on club's current exercises

#### 3. Preview Exercise Details
**Screen**: Exercise Store Detail  
**Actions**:
- Watches preview video
- Reads description and instructions
- Sees difficulty: "Intermediate"
- Sees rating: 4.7 stars (based on 45 reviews)
- Reads a few reviews from other coaches
- Decides it's appropriate for her team

**Emotions**: 😊 Confident in quality  
**Pain Points**: Can't filter reviews by age group  
**Opportunities**: Filter reviews, show which clubs use this exercise

#### 4. Add Exercise to Club
**Screen**: Exercise Store Detail  
**Actions**:
- Taps "Add to Club" button
- Sees confirmation: "Exercise added successfully"
- Exercise card shows "Added" badge
- Taps back button to return to store

**Emotions**: 😊 Satisfied  
**Pain Points**: None  
**Opportunities**: Add multiple exercises at once (cart system)

#### 5. Filter by Category
**Screen**: Exercise Store  
**Actions**:
- Taps "Filter" button
- Selects "Agility" category
- Selects "Intermediate" difficulty
- Applies filters

**Emotions**: 😊 Finding relevant content  
**Pain Points**: Too many filters might be overwhelming  
**Opportunities**: Smart filters, recently added, trending

#### 6. Batch Add Exercises
**Screen**: Exercise Store (Filtered)  
**Actions**:
- Sees 20 agility exercises
- Quickly browses through list
- Taps "Add to Club" on 9 more exercises
- Sees counter: "10 exercises added today"

**Emotions**: 😊 Productive, accomplished  
**Pain Points**: Repetitive tapping  
**Opportunities**: Multi-select mode, "Add all" option

#### 7. Review Added Exercises
**Screen**: Exercise Store  
**Actions**:
- Taps "View Added Exercises" link
- Navigates to Exercises Management
- Sees new exercises in club library
- Filters to see only today's additions

**Emotions**: 😊 Satisfied with selection  
**Pain Points**: None  
**Opportunities**: Preview how exercises will look to players

#### 8. Plan Communication
**Screen**: Exercises Management  
**Actions**:
- Makes mental note to tell players about new exercises
- Considers sending notification (future feature)
- Exits app

**Emotions**: 😊 Ready to inform players  
**Pain Points**: No way to notify players in-app  
**Opportunities**: Push notification to players about new exercises

### Journey Summary

**Total Time**: 10-15 minutes  
**Success Metrics**:
- Successfully adds 10 new exercises
- Exercises are appropriate difficulty
- Exercises are highly rated
- Feels confident in selections

**Critical Success Factors**:
- Easy browsing and filtering
- High-quality preview content
- Ratings and reviews from other coaches
- Quick add process
- Confirmation of additions

---

## Journey 5: Player Maintaining Streak

**Persona**: Emma  
**Goal**: Complete at least one exercise to maintain her 7-day streak  
**Context**: Evening of day 7, hasn't exercised yet today, received reminder notification

### Journey Steps

#### 1. Receive Notification
**Screen**: Phone Lock Screen  
**Actions**:
- Sees push notification at 7 PM
- Notification reads: "Don't break your 7-day streak! 🔥 Complete an exercise today."
- Taps notification

**Emotions**: 😰 Mild anxiety, motivated  
**Pain Points**: Might have forgotten without notification  
**Opportunities**: Timely reminders, streak recovery option

#### 2. App Opens to Home
**Screen**: Home  
**Actions**:
- App opens directly to Home screen
- Sees prominent streak indicator: "7 days 🔥"
- Sees warning banner: "Complete an exercise in the next 5 hours to keep your streak!"
- Sees "Quick Exercise" suggestion (5-minute exercise)

**Emotions**: 😰 Urgent, but sees clear path forward  
**Pain Points**: Might not have time for long exercise  
**Opportunities**: Quick exercises, time-based suggestions

#### 3. Select Quick Exercise
**Screen**: Home  
**Actions**:
- Taps "Quick Exercise" card
- Sees "Dynamic Stretching - 5 minutes"
- Reads brief description
- Taps "Start Now" button

**Emotions**: 😊 Relieved it's quick  
**Pain Points**: None  
**Opportunities**: Pre-selected quick exercises for streak maintenance

#### 4. Complete Exercise
**Screen**: Exercise Execution  
**Actions**:
- Follows stretching routine
- Timer counts down from 5:00
- Completes exercise
- Taps "Mark as Complete"

**Emotions**: 😊 Focused, accomplished  
**Pain Points**: None  
**Opportunities**: Encourage sharing streak achievement

#### 5. Celebrate Streak Milestone
**Screen**: Success Modal  
**Actions**:
- Sees special celebration animation
- Reads: "Amazing! 7-day streak maintained! 🔥"
- Sees new achievement unlocked: "Week Warrior" badge
- Sees bonus points: "+100 bonus points for 7-day streak"
- Taps "Share Achievement" button

**Emotions**: 😄 Proud, excited  
**Pain Points**: None - this is the reward  
**Opportunities**: Social sharing, team celebration

#### 6. Share on Social Media
**Screen**: Share Sheet  
**Actions**:
- Sees pre-generated image with achievement
- Adds caption: "7 days of training! 💪⚽"
- Shares to Instagram story
- Returns to app

**Emotions**: 😄 Proud, social validation  
**Pain Points**: None  
**Opportunities**: Branded share graphics, club logo

#### 7. Check Updated Profile
**Screen**: Profile  
**Actions**:
- Navigates to Profile tab
- Sees updated stats:
  - Current Streak: 7 days 🔥
  - Longest Streak: 7 days
  - Total Points: 550 (+100 bonus)
- Sees new "Week Warrior" badge in achievements section

**Emotions**: 😊 Satisfied, motivated for tomorrow  
**Pain Points**: None  
**Opportunities**: Set goal for next milestone (14 days, 30 days)

### Journey Summary

**Total Time**: 8-10 minutes  
**Success Metrics**:
- Streak maintained successfully
- Milestone achievement earned
- Bonus points awarded
- Shared achievement socially
- Motivated to continue tomorrow

**Critical Success Factors**:
- Timely reminder notification
- Clear streak status visibility
- Quick exercise options
- Special celebration for milestones
- Easy social sharing
- Bonus rewards for consistency

---

## Journey Pain Points Summary

### Common Player Pain Points
1. **Login Complexity**: Remembering club/year/gender selections
2. **Exercise Clarity**: Understanding instructions without good media
3. **Motivation**: Feeling discouraged when far behind on leaderboard
4. **Forgotten Passwords**: No easy recovery process
5. **Streak Anxiety**: Fear of losing progress

### Common Admin Pain Points
1. **Time Consumption**: Adding players one by one
2. **Credential Management**: Distributing usernames/passwords to players
3. **Content Discovery**: Finding appropriate exercises
4. **Engagement Visibility**: Not knowing which players are active
5. **Communication**: No way to notify players about new content

---

## Design Opportunities

### High Priority
1. **Persistent Login**: Remember club/year/gender after first selection
2. **Bulk Player Import**: CSV upload for efficient player management
3. **Quick Exercises**: Curated short exercises for streak maintenance
4. **Smart Notifications**: Timely reminders based on user behavior
5. **Credential Export**: Easy-to-share login information for admins

### Medium Priority
6. **Goal Setting**: Help players set and track personal goals
7. **Exercise Recommendations**: Personalized suggestions based on skill level
8. **Admin Dashboard**: Real-time engagement metrics
9. **Social Sharing**: Branded graphics for achievements
10. **Offline Mode**: Cache exercises for offline viewing

### Future Enhancements
11. **In-App Notifications**: Admin can notify players about new exercises
12. **Streak Recovery**: One "free pass" for missed days
13. **Team Challenges**: Collaborative goals for club/team
14. **Player Profiles**: View other players' achievements (privacy-controlled)
15. **Video Verification**: Optional video proof of exercise completion

---

These user journeys will inform wireframe design, interaction patterns, and feature prioritization for development.
