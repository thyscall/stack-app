export interface Habit {
  id: string;
  name: string;
  minutes: number;
  color: string;
  completedKeys: Set<string>;
}

export interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood?: number;
  tags?: string[];
  type?: string; // 'journal', 'meditation', 'breathing', 'yoga'
  duration?: number; // for meditation, breathing, yoga
  thoughts?: string;
}

export interface MoodSample {
  id: string;
  date: Date;
  mood: number;
  energy: number;
  productivity: number;
  focus: number;
  progress?: number; // auto-calculated from goal completion
}

export interface Goal {
  id: string;
  title: string;
  category: 'mental' | 'physical';
  currentProgress: number;
  targetProgress: number;
  unit: string;
  dueDate: Date;
  color: string;
  streakDays: number;
  completedDates: Record<string, number>; // date key -> amount completed
  dailyTarget?: number; // calculated target per active day
  reminderTime?: string; // optional reminder time
  frequency?: string; // daily, weekly, etc.
  priority?: number; // weight for calculating progress (default 1)
  activeDays?: number[]; // days of week to work on goal (0=Sun, 1=Mon, ..., 6=Sat)
}

export interface Workout {
  id: string;
  title: string;
  date: Date;
  duration: number;
  calories: number;
  avgHeartRate: number;
  type: string;
  distance?: number; // for running/cycling/walking (miles)
  pace?: string; // for running (min/mile)
  steps?: number;
  exercises?: string;
  weight?: number; // kg
  reps?: number;
  sets?: number;
  notes?: string;
  goalId?: string; // link to goal if from goal tracking
}

export interface AIInsight {
  id: string;
  text: string;
  icon: string;
  color: string;
}

export interface StackDay {
  id: string;
  date: Date;
  completed: boolean;
  intensity: number;
}

