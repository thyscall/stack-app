# Enhanced Goal Tracking - Detailed Progress Input

## 🎯 Smart Goal Progress Tracking

The Goals section now features intelligent progress input that adapts based on your goal type!

---

## 🔄 How It Works

### **Simple Checklist Goals** (Auto-toggle)
Goals with daily target = 1 and simple units:
- "Days", "Sessions", "Times"
- **Just click the circle** to mark complete
- Instantly fills with color
- No modal needed

### **Detailed Tracking Goals** (Input Modal)
Goals with measurable progress:
- Running distances (km)
- Reading pages
- Weight lifted
- Any numeric tracking
- **Clicking opens input modal** for detailed data

---

## 📊 Progress Input Modal Features

### **Header Information**
- **Goal Title** at the top
- **Date Display** - Shows which day you're logging for
  - Format: "Monday, Dec 30, 2024"
- **Current Progress Stats** (2 cards):
  - Current/Target progress
  - Required per day to reach goal

### **Main Input**
**Amount Field:**
- Large, centered number input
- Unit displayed next to it (km, pages, etc.)
- Step increments (0.1 for decimals)
- Required field

### **Physical Activity Extras**
For running/workout/training goals:

**Duration (minutes):**
- How long the activity took
- Default: 30 minutes

**Calories:**
- Calories burned during activity
- Syncs to Today's Progress

**Pace (Running only):**
- Optional pace tracking
- Format: "5:30/km"
- Shows for goals with "run" in title

**Average Heart Rate:**
- Heart rate in bpm
- Range: 50-220
- Default: 120

### **Notes Field**
- Optional text area
- "How did it go?"
- Saves reflections about the session

### **Live Projection**
Green success card shows:
- **New Completion %** after this entry
- **New Total Progress** in your units
- Updates in real-time as you type

---

## 🎨 Visual Enhancements

### **Date Labels on Circles**
Each circle now shows:
- **Date number** above the circle (small text)
- Hover effect enlarges circle
- Today's date still highlighted with ring

### **Smart Detection**
System auto-detects goal type:
- Checks `dailyTarget` and `unit` fields
- Routes to simple toggle OR detailed input
- No manual selection needed

---

## 📈 What Updates Automatically

When you log progress through the input modal:

### **On Goals Page:**
✅ Circle fills with goal color
✅ Progress bar updates
✅ Percentage recalculates
✅ Total progress increases
✅ "Need per day" adjusts

### **On Home Page:**

#### **Recent Activity Section:**
✅ New workout appears at top
✅ Shows distance (if running)
✅ Shows pace (if entered)
✅ Displays all metrics:
  - Distance (blue)
  - Calories (red)
  - Avg HR (green)
  - Pace (orange)
  - Type (blue)

#### **Active Goals Section:**
✅ Goal progress bar updates
✅ Current/target numbers change
✅ Percentage recalculates

#### **Today's Progress:**
✅ Physical calories counter updates
✅ Mental/Physical goal counts refresh

#### **Your Stack:**
✅ Workout count increases
✅ Stack day calculation runs
✅ Intensity updates based on activity

---

## 💾 Data Structure

### **Goal Completion Tracking:**
```typescript
completedDates: {
  "2024-12-30": 5,    // Ran 5km on Dec 30
  "2024-12-31": 3,    // Ran 3km on Dec 31
}
```

### **Linked Workout:**
```typescript
{
  title: "Running",
  date: Date,
  duration: 30,
  calories: 250,
  avgHeartRate: 145,
  distance: 5,         // NEW: From goal amount
  pace: "6:00/km",     // NEW: Optional pace
  goalId: "goal-123"   // NEW: Link to goal
}
```

---

## 🎯 Example User Flow

### **Running Goal: "Run 100km"**

**Starting State:**
- Current: 67km
- Target: 100km
- Need per day: 3.0 km/day

**User Action:**
1. Click today's circle (shows date "30")
2. Modal opens: "Log Progress: Run 100km"
3. See stats:
   - Current: 67/100 km
   - Need per day: 3.0 km/day

**Input Data:**
4. Amount: **5** km
5. Duration: **35** min
6. Calories: **320**
7. Pace: **7:00/km**
8. Avg HR: **145** bpm
9. Notes: "Great morning run!"

**Live Preview Shows:**
- ✅ 72% Complete (was 67%)
- ✅ 72 km total (was 67)

**Click "Log Progress":**

### **Immediate Updates:**

**Goals Page:**
- Circle fills green
- Progress bar: 67% → 72%
- Stats: 67/100 → 72/100 km
- Need per day: 3.0 → 2.8 km/day

**Home - Recent Activity:**
```
Running
Dec 30 at 09:15

Distance: 5 km
Calories: 320
Avg HR: 145 bpm
Pace: 7:00/km
Type: Running
Duration: 35 min
```

**Home - Active Goals:**
```
Run 100km
72/100 km | 72% ■■■■■■■□□□
```

**Home - Today's Progress:**
```
Physical: 320 calories burned (was 0)
```

**Home - Your Stack:**
```
Workouts: 6 (was 5)
```

---

## 🔥 Streak Tracking

Streaks update when:
- ✅ You complete a goal for consecutive days
- ✅ Any amount counts (even 1km towards 100km goal)
- ✅ Streak shows with flame emoji
- ✅ Breaks if you miss a day

---

## 🎨 UI Details

### **Modal Appearance:**
- Full-screen on mobile
- Centered modal on desktop
- Smooth slide-up animation
- Dark theme throughout

### **Input Fields:**
- Large, readable fonts
- Color-coded by goal type
- Auto-focus on amount
- Number steppers for precision

### **Buttons:**
- Cancel: Gray, left side
- Log Progress: Goal color, right side
- Full-width on mobile

---

## ✨ Key Features Summary

✅ **Smart detection** of goal types
✅ **Date labels** on all circles
✅ **Detailed input modal** for tracking
✅ **Physical activity extras** (pace, HR, calories)
✅ **Live projection** of progress
✅ **Notes field** for reflections
✅ **Auto-syncs** to workouts
✅ **Updates all sections** simultaneously
✅ **Recent Activity integration**
✅ **Today's Progress updates**
✅ **Your Stack recalculation**
✅ **Streak tracking** system
✅ **Required per day** adjustment

---

## 🚀 Try It Out!

1. Go to **Goals** tab (🎯)
2. Find "Run 100km" goal
3. Click **today's circle** (with date above it)
4. Modal opens with input fields
5. Enter your run details:
   - 5 km distance
   - 30 min duration
   - Add pace if you want
6. Click **"Log Progress"**
7. Watch all sections update! 
   - Circle fills
   - Progress bar moves
   - Recent Activity shows your run
   - Today's Progress updates
   - Stack metrics refresh

Everything is connected and updates in real-time! 🎊

