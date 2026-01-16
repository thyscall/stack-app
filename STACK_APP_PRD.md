# Stack App - Technical Product Requirements Document

## Table of Contents
1. [Product Overview](#product-overview)
2. [Technical Stack](#technical-stack)
3. [Design System](#design-system)
4. [Data Models](#data-models)
5. [Features & Requirements](#features--requirements)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Replit Setup Instructions](#replit-setup-instructions)
9. [Implementation Checklist](#implementation-checklist)

---

## Product Overview

**Stack** is a personal wellness tracking application that helps users monitor their mental and physical wellness journey through goals, workouts, mood tracking, and journaling.

### Core Value Proposition
- Track mental and physical wellness goals with smart planning
- Log workouts with detailed metrics
- Monitor mood, energy, focus, and productivity
- Journal entries with mood correlation
- Visualize progress through charts and trends
- Maintain a "Stack" streak based on goal completion

### Target Users
- Individuals focused on personal wellness
- Users tracking fitness and mental health goals
- People who want data-driven insights into their habits

---

## Technical Stack

### Frontend Framework
- **Next.js 14** (App Router)
- **React 18.2.0**
- **TypeScript 5**

### State Management
- **Zustand 4.4.7** - Lightweight state management

### Styling
- **Tailwind CSS 3.3.0** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefixing

### Data Visualization
- **Recharts 2.10.3** - React charting library

### Date Utilities
- **date-fns 3.0.6** - Date manipulation and formatting

### Icons
- **Lucide React 0.294.0** - Icon library

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type safety

---

## Design System

### Color Palette

#### Background Colors
```css
bg: #000000          /* Main background (black) */
surface: #1F1F1F     /* Card/surface background */
surfaceLight: #262626 /* Lighter surface variant */
```

#### Text Colors
```css
textPrimary: #FFFFFF                    /* Primary text */
textMuted: rgba(255, 255, 255, 0.7)     /* Muted text */
textMutedDark: rgba(255, 255, 255, 0.5) /* Darker muted text */
```

#### Accent Colors
```css
purple: #8B5CF6      /* Mental wellness */
green: #10B981       /* Physical wellness */
blue: #3B82F6        /* Primary actions */
orange: #F59E0B      /* Highlights/warnings */
peach: #F6C9AE       /* Accent */
sand: #F5E3A3        /* Accent */
mint: #BFF4E0        /* Accent */
lime: #DFF98B        /* Accent */
```

#### Chart Colors
```css
chartPurple: #A78BFA
chartBlue: #60A5FA
chartOrange: #FB923C
```

### Typography
- **Font Family**: Inter (from Google Fonts)
- **System Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif

### Spacing & Layout
- **Max Width**: `max-w-lg` (512px) - Mobile-first design
- **Border Radius**: `24px` for cards (`rounded-card`)
- **Padding**: Standard `p-5` (20px) for cards
- **Bottom Navigation**: Fixed at bottom, `h-20` (80px)

### Component Styles
- **Cards**: Dark surface (`bg-surface`) with rounded corners
- **Buttons**: Rounded with color-coded backgrounds
- **Modals**: Bottom sheet on mobile, centered on desktop
- **Charts**: Dark theme with muted grid lines

---

## Data Models

### Goal
```typescript
interface Goal {
  id: string;
  title: string;
  category: 'mental' | 'physical';
  currentProgress: number;
  targetProgress: number;
  unit: string;                    // e.g., "pages", "miles", "sessions"
  dueDate: Date;
  color: string;                   // Hex color code
  streakDays: number;
  completedDates: Record<string, number>; // date key -> amount completed
  dailyTarget?: number;             // Auto-calculated per active day
  reminderTime?: string;            // "HH:mm" format
  frequency?: string;               // "daily", "weekly", "custom"
  priority?: number;                // Weight for progress calculation (default 1)
  activeDays?: number[];           // Days of week (0=Sun, 1=Mon, ..., 6=Sat)
}
```

### Workout
```typescript
interface Workout {
  id: string;
  title: string;
  date: Date;
  duration: number;                 // Minutes
  calories: number;
  avgHeartRate: number;
  type: string;                    // "Running", "HIIT", "Strength", etc.
  distance?: number;               // Miles
  pace?: string;                   // "min/mile"
  steps?: number;
  exercises?: string;
  weight?: number;                 // kg
  reps?: number;
  sets?: number;
  notes?: string;
  goalId?: string;                 // Link to goal if from goal tracking
}
```

### MoodSample
```typescript
interface MoodSample {
  id: string;
  date: Date;
  mood: number;                    // 1-10 scale
  energy: number;                  // 1-10 scale
  productivity: number;            // 1-10 scale
  focus: number;                   // 1-10 scale
  progress?: number;               // Auto-calculated from goal completion
}
```

### JournalEntry
```typescript
interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood?: number;                   // 1-10 scale
  tags?: string[];                 // Array of tag strings
  type?: string;                   // 'journal', 'meditation', 'breathing', 'yoga'
  duration?: number;               // Minutes (for meditation, breathing, yoga)
  thoughts?: string;               // Additional thoughts
}
```

### StackDay
```typescript
interface StackDay {
  id: string;
  date: Date;
  completed: boolean;              // Whether stack day was earned
  intensity: number;               // 0.0 - 1.0 (calculated from goals, mood, workouts)
}
```

### AIInsight
```typescript
interface AIInsight {
  id: string;
  text: string;                    // Insight message
  icon: string;                    // Icon name
  color: string;                   // Hex color code
}
```

---

## Features & Requirements

### 1. Home Page (Stack Tab)

#### Your Stack Component
- **Display**: Current streak count, stack quality message
- **Visualization**: Last 5 days as intensity bars
- **Stats**: Average mood, total workouts, total entries
- **Calculation**: Stack day earned if ≥2 goals completed OR 1 mental + 1 physical goal
- **Intensity Formula**: 
  ```
  intensity = min(1.0, (goalsCompleted/totalGoals) * 0.5 + (mood/10) * 0.3 + min(workoutMinutes/60, 1) * 0.2)
  ```

#### Daily Rating Component
- **Input**: Mood, Energy, Productivity, Focus (1-10 scale)
- **Display**: Today's rating with visual indicator
- **Action**: Opens MoodModal for input

#### Active Goals Component
- **Display**: List of active goals (mental and physical)
- **Show**: Progress bar, streak days, days remaining
- **Action**: Click to view goal details

#### Wellness Trends Component
- **Chart**: Line chart showing mood, energy, productivity, focus over last 7 days
- **Data Source**: MoodSample data

#### AI Insights Component
- **Display**: Personalized insights based on user data
- **Content**: Dynamic insights about patterns and correlations
- **Visual**: Icon + colored card

#### Recent Activity Component
- **Display**: Recent workouts and journal entries
- **Format**: Card list with date, type, and key metrics

#### TodaysProgress Component
- **Display**: Today's overall progress score (0-10)
- **Calculation**: Weighted average of goal completion percentages

### 2. Goals Page

#### Goal Creation
- **Multi-step Modal**: Basics → Target → Schedule → Reminder
- **Basics Step**:
  - Goal name input
  - Category selection (Mental/Physical)
- **Target Step**:
  - Total target amount (number)
  - Unit (text input)
  - Due date (date picker)
- **Schedule Step**:
  - Day selector (7 days of week, toggleable)
  - Auto-calculated daily target display
  - Formula: `remaining / activeDaysCount` (rounded up to 2 decimals)
  - Active days count calculation: Count days between today and due date that match selected days
- **Reminder Step**:
  - Time picker
  - Goal summary preview

#### Goal Display
- **Week View**: 7-day calendar strip showing completion status
- **Progress Bar**: Visual progress indicator
- **Stats**: Current progress, target, percentage, streak days
- **Actions**: 
  - Click goal card → Goal detail modal
  - Click day circle → Toggle completion (simple) or open input modal (detailed)

#### Goal Detail Modal
- **Display**: Full goal information
- **Actions**: Edit, delete, view history

#### Goal Progress Input Modal
- **Trigger**: When goal requires amount input (not simple checklist)
- **Input**: Amount completed for specific date
- **Action**: Updates goal progress and completedDates

#### Calendar Modal
- **Display**: Full month calendar view
- **Indicators**: Days with goal completions and workouts
- **Action**: Select date to view details

#### Day Detail Modal
- **Display**: All activities for selected date
- **Shows**: Goal progress, workouts, journal entries

### 3. Physical Page

#### Today's Activity
- **Metrics**: Calories burned, total minutes, workout count
- **Display**: 3-column grid with icons

#### Weekly Stats
- **Metrics**: Total workouts this week, total distance
- **Display**: 2-column grid

#### Charts
- **Calories Burned**: Bar chart (last 7 days)
- **Activity Duration**: Line chart (last 7 days)

#### Physical Goals
- **Display**: List of physical goals with progress
- **Action**: Click to open goal progress modal

#### Recent Workouts
- **Display**: List of recent workouts with details
- **Shows**: Type, date, duration, calories, distance, heart rate, pace
- **Empty State**: Message with "Log Your First Workout" button

#### Workout Modal
- **Fields**:
  - Title (text)
  - Type (dropdown: Running, Walking, Cycling, HIIT, Strength, Yoga, Other)
  - Date (date picker, defaults to today)
  - Duration (minutes)
  - Calories
  - Average Heart Rate
  - Distance (optional, miles)
  - Pace (optional, min/mile)
  - Notes (optional, textarea)
- **Auto-update**: Automatically updates related physical goals

### 4. Mental Page

#### Today's Mental Activity
- **Metrics**: Meditation minutes, journal entries, focus score
- **Display**: 3-column grid

#### Weekly Stats
- **Metrics**: Journal entries this week, average mood
- **Display**: 2-column grid

#### Charts
- **Mental Activity**: Bar chart showing minutes per day (last 7 days)
- **Focus & Mood Trends**: Line chart (last 7 days)

#### Mental Goals
- **Display**: List of mental goals with progress
- **Action**: Click to open goal progress modal

#### Recent Journal Entries
- **Display**: List of recent entries with title, date, content preview, mood, tags
- **Empty State**: Message with "Create Your First Entry" button

#### Journal Modal
- **Fields**:
  - Title (text)
  - Content (textarea)
  - Mood (1-10 slider, optional)
  - Tags (array of strings)
  - Type (dropdown: journal, meditation, breathing, yoga)
  - Duration (minutes, if type is meditation/breathing/yoga)
  - Thoughts (optional, textarea)
  - Date (date picker, defaults to today)
- **Auto-update**: Automatically updates related mental goals

#### Insights
- **Display**: Personalized insights cards
- **Content**: Focus peak times, journaling streak, mood correlation

### 5. Profile Page
- **Display**: User profile information
- **Features**: Settings, preferences (to be implemented)

### 6. Navigation

#### Tab Navigation
- **Fixed Bottom**: Always visible at bottom of screen
- **Tabs**: Stack, Goals, Physical, Mental, Profile
- **Active State**: Green color for active tab
- **Icons**: Lucide React icons

#### Quick Actions
- **Floating Action Button**: Fixed bottom-right
- **Menu**: Expands to show "Log Workout" and "Daily Check-in"
- **Animation**: Rotate icon on open

---

## Component Architecture

### Page Components
```
src/app/
├── page.tsx              # Home page (Stack tab)
├── layout.tsx            # Root layout with TabNavigation
├── goals/page.tsx        # Goals page
├── physical/page.tsx     # Physical wellness page
├── mental/page.tsx       # Mental wellness page
└── profile/page.tsx      # Profile page
```

### Home Components
```
src/components/home/
├── YourStack.tsx         # Stack streak display
├── DailyRating.tsx       # Today's mood rating
├── ActiveGoals.tsx       # Active goals list
├── WellnessTrends.tsx   # Mood/energy trends chart
├── AIInsights.tsx        # AI insights cards
├── RecentActivity.tsx    # Recent workouts/entries
└── TodaysProgress.tsx   # Today's progress score
```

### Modal Components
```
src/components/modals/
├── CreateGoalModal.tsx           # Multi-step goal creation
├── GoalDetailModal.tsx           # Goal details and history
├── GoalProgressInputModal.tsx    # Input progress for goal
├── GoalProgressModal.tsx         # View/edit goal progress
├── WorkoutModal.tsx              # Log workout
├── JournalModal.tsx              # Create journal entry
├── MoodModal.tsx                 # Daily mood check-in
├── CalendarModal.tsx             # Month calendar view
└── DayDetailModal.tsx            # Day activities detail
```

### Shared Components
```
src/components/
├── Card.tsx              # Reusable card component
├── Modal.tsx             # Base modal component
├── TabNavigation.tsx     # Bottom tab bar
└── QuickActions.tsx      # Floating action button
```

---

## State Management

### Store Structure (Zustand)

#### GoalStore
```typescript
interface GoalStore {
  goals: Goal[];
  updateGoalProgress: (goalId: string, amount: number) => void;
  completeGoalForToday: (goalId: string, amount: number) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'currentProgress' | 'streakDays' | 'completedDates'>) => void;
  getGoalCompletionForDate: (goalId: string, date: Date) => number;
  toggleGoalCompletion: (goalId: string, date: Date, amount: number) => void;
  autoUpdateFromWorkout: (workout: Workout) => void;
  autoUpdateFromJournal: (entry: JournalEntry) => void;
}
```

#### WorkoutStore
```typescript
interface WorkoutStore {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id' | 'date'>, customDate?: Date) => void;
  getTodayWorkouts: () => Workout[];
  getTotalCaloriesToday: () => number;
  getTotalMinutesToday: () => number;
}
```

#### StackStore
```typescript
interface StackStore {
  stackDays: StackDay[];
  currentStreak: number;
  avgMood: number;
  totalWorkouts: number;
  totalEntries: number;
  calculateStackDay: (date: Date, goalsCompleted: number, mentalGoals: number, physicalGoals: number, mood: number, workoutMinutes: number) => void;
  getStackQuality: () => string;
  recalculateStreak: () => void;
}
```

#### MoodStore
```typescript
interface MoodStore {
  samples: MoodSample[];
  log: (mood: number, energy: number, productivity: number, focus: number) => void;
  getTodayMood: () => MoodSample | undefined;
  getAverageMood: () => number;
  calculateDailyProgress: (date: Date) => number;
}
```

#### JournalStore
```typescript
interface JournalStore {
  entries: JournalEntry[];
  addEntry: (title: string, content: string, mood?: number, tags?: string[], type?: string, duration?: number, thoughts?: string, customDate?: Date) => void;
  getRecentEntries: (limit?: number) => JournalEntry[];
  getTodayEntries: () => JournalEntry[];
}
```

#### InsightStore
```typescript
interface InsightStore {
  insights: AIInsight[];
  generateInsights: (goals: Goal[], workouts: Workout[], mood: MoodSample[]) => void;
}
```

### Data Persistence
- **Current**: In-memory (Zustand state)
- **Future**: Can be extended with localStorage or backend API

---

## Replit Setup Instructions

### 1. Create New Replit Project

1. Go to [replit.com](https://replit.com)
2. Click "Create Repl"
3. Select **"Next.js"** template
4. Name it "stack-app"

### 2. Install Dependencies

In the Replit shell, run:
```bash
npm install next@14.2.0 react@18.2.0 react-dom@18.2.0
npm install zustand@4.4.7 recharts@2.10.3 date-fns@3.0.6 lucide-react@0.294.0
npm install -D tailwindcss@3.3.0 postcss@8 autoprefixer@10.0.1
npm install -D typescript@5 @types/node@20 @types/react@18 @types/react-dom@18
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### 3. Project Structure Setup

Create the following directory structure:
```
stack-app/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── goals/
│   │   │   └── page.tsx
│   │   ├── physical/
│   │   │   └── page.tsx
│   │   ├── mental/
│   │   │   └── page.tsx
│   │   └── profile/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── TabNavigation.tsx
│   │   ├── QuickActions.tsx
│   │   ├── home/
│   │   │   ├── YourStack.tsx
│   │   │   ├── DailyRating.tsx
│   │   │   ├── ActiveGoals.tsx
│   │   │   ├── WellnessTrends.tsx
│   │   │   ├── AIInsights.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── TodaysProgress.tsx
│   │   └── modals/
│   │       ├── CreateGoalModal.tsx
│   │       ├── GoalDetailModal.tsx
│   │       ├── GoalProgressInputModal.tsx
│   │       ├── GoalProgressModal.tsx
│   │       ├── WorkoutModal.tsx
│   │       ├── JournalModal.tsx
│   │       ├── MoodModal.tsx
│   │       ├── CalendarModal.tsx
│   │       └── DayDetailModal.tsx
│   ├── store/
│   │   └── index.ts
│   └── types/
│       └── index.ts
├── public/
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

### 4. Configuration Files

#### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#1F1F1F',
        surfaceLight: '#262626',
        textPrimary: '#FFFFFF',
        textMuted: 'rgba(255, 255, 255, 0.7)',
        textMutedDark: 'rgba(255, 255, 255, 0.5)',
        peach: '#F6C9AE',
        sand: '#F5E3A3',
        mint: '#BFF4E0',
        lime: '#DFF98B',
        purple: '#8B5CF6',
        blue: '#3B82F6',
        orange: '#F59E0B',
        green: '#10B981',
        chartPurple: '#A78BFA',
        chartBlue: '#60A5FA',
        chartOrange: '#FB923C',
      },
      borderRadius: {
        card: '24px',
      },
    },
  },
  plugins: [],
}
export default config
```

#### postcss.config.js
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

#### globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  background-color: #000000;
  color: #ffffff;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@layer utilities {
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

### 5. Replit-Specific Configuration

#### .replit File
Create `.replit` in root:
```toml
run = "npm run dev"
entrypoint = "src/app/page.tsx"
[nix]
channel = "stable-22_11"

[deploy]
run = ["sh", "-c", "npm run build && npm start"]
```

#### Replit Run Configuration
1. Go to Replit settings
2. Set **Run** command to: `npm run dev`
3. Set **Port** to: `3000` (or auto-detect)

### 6. Key Implementation Details

#### Date Key Helper
```typescript
import { format, startOfDay } from 'date-fns';

const getDateKey = (date: Date) => format(startOfDay(date), 'yyyy-MM-dd');
```

#### Active Days Calculation
```typescript
import { eachDayOfInterval, getDay } from 'date-fns';

const activeDaysCount = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(formData.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  if (dueDate <= today) return 0;
  
  const allDays = eachDayOfInterval({ start: today, end: dueDate });
  return allDays.filter(day => formData.activeDays.includes(getDay(day))).length;
}, [formData.dueDate, formData.activeDays]);
```

#### Stack Day Calculation
```typescript
const calculateStackDay = (date, goalsCompleted, mentalGoals, physicalGoals, mood, workoutMinutes) => {
  const isStackDay = goalsCompleted >= 2 || (mentalGoals >= 1 && physicalGoals >= 1);
  
  const totalGoals = 4; // Adjust based on actual goals
  const intensity = Math.min(
    1.0,
    (goalsCompleted / totalGoals) * 0.5 +
    (mood / 10) * 0.3 +
    Math.min(workoutMinutes / 60, 1) * 0.2
  );
  
  // Update stackDays array
};
```

#### Auto-Update Goals from Workout
```typescript
autoUpdateFromWorkout: (workout) => {
  // Match distance-based goals
  if (workout.distance && goal.unit === 'miles' && goal.category === 'physical') {
    // Update goal progress
  }
  
  // Match calorie-based goals
  if (workout.calories && goal.unit === 'calories' && goal.category === 'physical') {
    // Update goal progress
  }
  
  // Match session-based goals
  if (goal.unit === 'sessions' && goal.category === 'physical') {
    // Update goal progress
  }
}
```

#### Auto-Update Goals from Journal
```typescript
autoUpdateFromJournal: (entry) => {
  // Match journal-based goals
  if (goal.category === 'mental' && goal.unit === 'entries' && entry.type === 'journal') {
    // Update goal progress
  }
  
  // Match meditation goals (by duration or sessions)
  if (goal.category === 'mental' && entry.type === 'meditation') {
    // Update goal progress
  }
}
```

### 7. Running the App

1. **Development Mode**:
   ```bash
   npm run dev
   ```
   - App runs on `http://localhost:3000` (or Replit's auto-assigned URL)

2. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

### 8. Data Persistence (Optional Enhancement)

To add localStorage persistence in Replit:

```typescript
// In store/index.ts
import { persist } from 'zustand/middleware';

export const useGoalStore = create(
  persist<GoalStore>(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'stack-goals-storage',
    }
  )
);
```

---

## Implementation Checklist

### Phase 1: Setup & Core Structure
- [ ] Create Replit project
- [ ] Install all dependencies
- [ ] Set up project structure
- [ ] Configure Tailwind CSS
- [ ] Set up TypeScript
- [ ] Create base layout with TabNavigation

### Phase 2: Data Models & State
- [ ] Define all TypeScript interfaces
- [ ] Implement Zustand stores (Goal, Workout, Mood, Journal, Stack, Insight)
- [ ] Create helper functions (getDateKey, etc.)

### Phase 3: Core Components
- [ ] Create Card component
- [ ] Create Modal component
- [ ] Create TabNavigation component
- [ ] Create QuickActions component

### Phase 4: Home Page
- [ ] YourStack component
- [ ] DailyRating component
- [ ] ActiveGoals component
- [ ] WellnessTrends component
- [ ] AIInsights component
- [ ] RecentActivity component
- [ ] TodaysProgress component
- [ ] Home page integration

### Phase 5: Goals Page
- [ ] CreateGoalModal (all 4 steps)
- [ ] GoalDetailModal
- [ ] GoalProgressInputModal
- [ ] CalendarModal
- [ ] DayDetailModal
- [ ] Goals page with week view
- [ ] Goal card component

### Phase 6: Physical Page
- [ ] WorkoutModal
- [ ] Physical page layout
- [ ] Charts (calories, duration)
- [ ] Recent workouts list
- [ ] Physical goals display

### Phase 7: Mental Page
- [ ] JournalModal
- [ ] MoodModal
- [ ] Mental page layout
- [ ] Charts (activity, focus/mood trends)
- [ ] Recent journal entries list
- [ ] Mental goals display
- [ ] Insights section

### Phase 8: Profile Page
- [ ] Profile page layout
- [ ] Settings (if applicable)

### Phase 9: Integration & Polish
- [ ] Auto-update goals from workouts
- [ ] Auto-update goals from journal entries
- [ ] Stack day calculation
- [ ] Streak recalculation
- [ ] Progress calculations
- [ ] Empty states
- [ ] Loading states
- [ ] Error handling

### Phase 10: Testing & Refinement
- [ ] Test all modals
- [ ] Test goal creation with active days
- [ ] Test auto-calculations
- [ ] Test charts rendering
- [ ] Test navigation
- [ ] Mobile responsiveness
- [ ] Dark theme consistency

---

## Additional Notes

### Performance Considerations
- Use `useMemo` for expensive calculations (active days count, chart data)
- Use `useEffect` for client-side only rendering (charts)
- Lazy load modals when possible

### Accessibility
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Maintain color contrast ratios

### Future Enhancements
- Backend API integration
- User authentication
- Data export/import
- Push notifications for reminders
- Social sharing
- Advanced analytics
- Goal templates
- Habit tracking

---

## Support & Resources

### Documentation Links
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Zustand Docs](https://zustand-demo.pmnd.rs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org)
- [date-fns Docs](https://date-fns.org)
- [Lucide Icons](https://lucide.dev)

### Replit Resources
- [Replit Next.js Guide](https://docs.replit.com/templates/nextjs)
- [Replit Deployment](https://docs.replit.com/hosting/deployments)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: Stack Development Team
