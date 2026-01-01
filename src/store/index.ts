import { create } from 'zustand';
import { addDays, subDays, startOfDay, format } from 'date-fns';
import type { Goal, Workout, AIInsight, StackDay, MoodSample, JournalEntry } from '@/types';

// Helper to get date key
const getDateKey = (date: Date) => format(startOfDay(date), 'yyyy-MM-dd');

interface GoalStore {
  goals: Goal[];
  updateGoalProgress: (goalId: string, amount: number) => void;
  completeGoalForToday: (goalId: string, amount: number) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'currentProgress' | 'streakDays' | 'completedDates'>) => void;
  getGoalCompletionForDate: (goalId: string, date: Date) => number;
  toggleGoalCompletion: (goalId: string, date: Date, amount: number) => void;
  autoUpdateFromWorkout: (workout: any) => void;
  autoUpdateFromJournal: (entry: any) => void;
}

interface WorkoutStore {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id' | 'date'>, customDate?: Date) => void;
  getTodayWorkouts: () => Workout[];
  getTotalCaloriesToday: () => number;
  getTotalMinutesToday: () => number;
}

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

interface InsightStore {
  insights: AIInsight[];
  generateInsights: (goals: Goal[], workouts: Workout[], mood: MoodSample[]) => void;
}

interface MoodStore {
  samples: MoodSample[];
  log: (mood: number, energy: number, productivity: number, focus: number) => void;
  getTodayMood: () => MoodSample | undefined;
  getAverageMood: () => number;
  calculateDailyProgress: (date: Date) => number;
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [
    {
      id: '1',
      title: 'Daily Meditation',
      category: 'mental',
      currentProgress: 12,
      targetProgress: 30,
      unit: 'days',
      dueDate: addDays(new Date(), 18),
      color: '#8B5CF6',
      streakDays: 12,
      completedDates: {},
      dailyTarget: 1,
      frequency: 'daily',
      priority: 1,
    },
    {
      id: '2',
      title: 'Run 100 miles',
      category: 'physical',
      currentProgress: 42,
      targetProgress: 100,
      unit: 'miles',
      dueDate: addDays(new Date(), 11),
      color: '#10B981',
      streakDays: 8,
      completedDates: {},
      dailyTarget: 3,
      frequency: 'daily',
      priority: 2, // Twice as important as other goals
    },
    {
      id: '3',
      title: 'Read 20 Books',
      category: 'mental',
      currentProgress: 8,
      targetProgress: 20,
      unit: 'books',
      dueDate: addDays(new Date(), 25),
      color: '#3B82F6',
      streakDays: 0,
      completedDates: {},
      dailyTarget: 10,
      frequency: 'daily',
      priority: 1,
    },
    {
      id: '4',
      title: 'Strength Training',
      category: 'physical',
      currentProgress: 23,
      targetProgress: 50,
      unit: 'sessions',
      dueDate: addDays(new Date(), 40),
      color: '#F59E0B',
      streakDays: 0,
      completedDates: {},
      dailyTarget: 1,
      frequency: 'weekly',
      priority: 1,
    },
  ],
  updateGoalProgress: (goalId, amount) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === goalId
          ? { ...goal, currentProgress: Math.min(goal.targetProgress, goal.currentProgress + amount) }
          : goal
      ),
    }));
  },
  completeGoalForToday: (goalId, amount) => {
    const today = getDateKey(new Date());
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              currentProgress: Math.min(goal.targetProgress, goal.currentProgress + amount),
              streakDays: goal.streakDays + 1,
              completedDates: { ...goal.completedDates, [today]: amount },
            }
          : goal
      ),
    }));
  },
  addGoal: (goal) => {
    set((state) => ({
      goals: [
        ...state.goals,
        {
          ...goal,
          id: `goal-${Date.now()}`,
          currentProgress: 0,
          streakDays: 0,
          completedDates: {},
        },
      ],
    }));
  },
  getGoalCompletionForDate: (goalId, date) => {
    const dateKey = getDateKey(date);
    const goal = get().goals.find((g) => g.id === goalId);
    return goal?.completedDates[dateKey] || 0;
  },
  toggleGoalCompletion: (goalId, date, amount) => {
    const dateKey = getDateKey(date);
    set((state) => ({
      goals: state.goals.map((goal) => {
        if (goal.id !== goalId) return goal;
        
        const hasCompletion = goal.completedDates[dateKey];
        const newCompletedDates = { ...goal.completedDates };
        
        if (hasCompletion) {
          delete newCompletedDates[dateKey];
          return {
            ...goal,
            completedDates: newCompletedDates,
            currentProgress: Math.max(0, goal.currentProgress - hasCompletion),
          };
        } else {
          newCompletedDates[dateKey] = amount;
          return {
            ...goal,
            completedDates: newCompletedDates,
            currentProgress: Math.min(goal.targetProgress, goal.currentProgress + amount),
          };
        }
      }),
    }));
  },
  autoUpdateFromWorkout: (workout) => {
    console.log('🏋️ Auto-updating goals from workout:', workout);
    const dateKey = getDateKey(workout.date || new Date());
    
    set((state) => {
      const updatedGoals = state.goals.map((goal) => {
        let shouldUpdate = false;
        let amount = 0;

        // Match distance-based goals
        if (workout.distance && goal.unit === 'miles' && goal.category === 'physical') {
          amount = workout.distance;
          shouldUpdate = true;
          console.log(`✅ Matched distance goal: ${goal.title}, adding ${amount} miles`);
        }

        // Match calorie-based goals
        if (workout.calories && goal.unit === 'calories' && goal.category === 'physical') {
          amount = workout.calories;
          shouldUpdate = true;
          console.log(`✅ Matched calorie goal: ${goal.title}, adding ${amount} calories`);
        }

        // Match session-based goals
        if (goal.unit === 'sessions' && goal.category === 'physical') {
          amount = 1;
          shouldUpdate = true;
          console.log(`✅ Matched session goal: ${goal.title}, adding 1 session`);
        }

        if (shouldUpdate) {
          const newCompletedDates = { ...goal.completedDates };
          const existingAmount = newCompletedDates[dateKey] || 0;
          newCompletedDates[dateKey] = existingAmount + amount;

          return {
            ...goal,
            currentProgress: Math.min(goal.targetProgress, goal.currentProgress + amount),
            completedDates: newCompletedDates,
            streakDays: existingAmount === 0 ? goal.streakDays + 1 : goal.streakDays,
          };
        }

        return goal;
      });
      
      console.log('📊 Updated goals:', updatedGoals.filter(g => g.unit === 'km'));
      return { goals: updatedGoals };
    });
  },
  autoUpdateFromJournal: (entry) => {
    console.log('📝 Auto-updating goals from journal entry:', entry);
    const dateKey = getDateKey(entry.date || new Date());
    
    set((state) => ({
      goals: state.goals.map((goal) => {
        let shouldUpdate = false;
        let amount = 0;

        // Match journal-based goals (traditional journal entries)
        if (
          goal.category === 'mental' &&
          (goal.unit === 'entries' || goal.unit === 'times') &&
          (goal.title.toLowerCase().includes('journal') || goal.title.toLowerCase().includes('writ')) &&
          (!entry.type || entry.type === 'journal')
        ) {
          const newCompletedDates = { ...goal.completedDates };
          const existingAmount = newCompletedDates[dateKey] || 0;
          
          if (existingAmount === 0) {
            amount = 1;
            shouldUpdate = true;
            console.log(`✅ Matched journal goal: ${goal.title}, adding 1 entry`);
          }
        }

        // Match meditation goals (by duration in minutes)
        if (
          goal.category === 'mental' &&
          entry.type === 'meditation' &&
          entry.duration &&
          goal.unit === 'minutes' &&
          goal.title.toLowerCase().includes('meditat')
        ) {
          amount = entry.duration;
          shouldUpdate = true;
          console.log(`✅ Matched meditation goal (minutes): ${goal.title}, adding ${amount} minutes`);
        }

        // Match meditation goals (by sessions)
        if (
          goal.category === 'mental' &&
          entry.type === 'meditation' &&
          (goal.unit === 'sessions' || goal.unit === 'times' || goal.unit === 'days') &&
          goal.title.toLowerCase().includes('meditat')
        ) {
          amount = 1;
          shouldUpdate = true;
          console.log(`✅ Matched meditation goal (sessions): ${goal.title}, adding 1 session`);
        }

        // Match yoga goals (by duration)
        if (
          goal.category === 'mental' &&
          entry.type === 'yoga' &&
          entry.duration &&
          goal.unit === 'minutes' &&
          goal.title.toLowerCase().includes('yoga')
        ) {
          amount = entry.duration;
          shouldUpdate = true;
          console.log(`✅ Matched yoga goal (minutes): ${goal.title}, adding ${amount} minutes`);
        }

        // Match yoga goals (by sessions)
        if (
          goal.category === 'mental' &&
          entry.type === 'yoga' &&
          (goal.unit === 'sessions' || goal.unit === 'times' || goal.unit === 'days') &&
          goal.title.toLowerCase().includes('yoga')
        ) {
          amount = 1;
          shouldUpdate = true;
          console.log(`✅ Matched yoga goal (sessions): ${goal.title}, adding 1 session`);
        }

        // Match breathing exercises goals (by duration)
        if (
          goal.category === 'mental' &&
          entry.type === 'breathing' &&
          entry.duration &&
          goal.unit === 'minutes' &&
          goal.title.toLowerCase().includes('breath')
        ) {
          amount = entry.duration;
          shouldUpdate = true;
          console.log(`✅ Matched breathing goal (minutes): ${goal.title}, adding ${amount} minutes`);
        }

        // Match breathing exercises goals (by sessions)
        if (
          goal.category === 'mental' &&
          entry.type === 'breathing' &&
          (goal.unit === 'sessions' || goal.unit === 'times' || goal.unit === 'days') &&
          goal.title.toLowerCase().includes('breath')
        ) {
          amount = 1;
          shouldUpdate = true;
          console.log(`✅ Matched breathing goal (sessions): ${goal.title}, adding 1 session`);
        }

        if (shouldUpdate) {
          const newCompletedDates = { ...goal.completedDates };
          const existingAmount = newCompletedDates[dateKey] || 0;
          newCompletedDates[dateKey] = existingAmount + amount;

          return {
            ...goal,
            currentProgress: Math.min(goal.targetProgress, goal.currentProgress + amount),
            completedDates: newCompletedDates,
            streakDays: existingAmount === 0 ? goal.streakDays + 1 : goal.streakDays,
          };
        }

        return goal;
      }),
    }));
    console.log('📊 Updated goals:', get().goals.filter(g => g.category === 'mental'));
  },
}));

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  workouts: [
    {
      id: '1',
      title: 'HIIT',
      date: subDays(new Date(), 1),
      duration: 45,
      calories: 450,
      avgHeartRate: 165,
      type: 'HIIT',
    },
    {
      id: '2',
      title: 'Running',
      date: subDays(new Date(), 2),
      duration: 35,
      calories: 320,
      avgHeartRate: 155,
      type: 'Running',
    },
    {
      id: '3',
      title: 'Strength',
      date: subDays(new Date(), 3),
      duration: 60,
      calories: 280,
      avgHeartRate: 130,
      type: 'Strength',
    },
  ],
  addWorkout: (workout, customDate) => {
    const workoutDate = customDate || new Date();
    const newWorkout = {
      ...workout,
      id: `workout-${Date.now()}`,
      date: workoutDate,
    };
    
    set((state) => ({
      workouts: [newWorkout, ...state.workouts],
    }));
    
    // Auto-update related goals
    useGoalStore.getState().autoUpdateFromWorkout(newWorkout);
    
    // Recalculate stack for the workout's date
    const { goals } = useGoalStore.getState();
    const { samples } = useMoodStore.getState();
    const dateKey = getDateKey(workoutDate);
    
    // Get mood for that specific date
    const dateMood = samples.find(s => getDateKey(s.date) === dateKey)?.mood || 7;
    
    // Calculate total workout minutes for that date
    const dateWorkouts = get().workouts.filter(w => getDateKey(w.date) === dateKey);
    const totalMinutes = dateWorkouts.reduce((sum, w) => sum + w.duration, 0);
    
    const physicalGoals = goals.filter(g => g.category === 'physical' && (g.completedDates[dateKey] || 0) > 0).length;
    const mentalGoals = goals.filter(g => g.category === 'mental' && (g.completedDates[dateKey] || 0) > 0).length;
    
    useStackStore.getState().calculateStackDay(
      workoutDate,
      physicalGoals + mentalGoals,
      mentalGoals,
      physicalGoals,
      dateMood,
      totalMinutes
    );
  },
  getTodayWorkouts: () => {
    const today = getDateKey(new Date());
    return get().workouts.filter((w) => getDateKey(w.date) === today);
  },
  getTotalCaloriesToday: () => {
    return get().getTodayWorkouts().reduce((sum, w) => sum + w.calories, 0);
  },
  getTotalMinutesToday: () => {
    return get().getTodayWorkouts().reduce((sum, w) => sum + w.duration, 0);
  },
}));

export const useStackStore = create<StackStore>((set, get) => {
  const stackDays: StackDay[] = [];
  for (let i = 0; i < 12; i++) {
    const intensity = 0.6 + (Math.random() * 0.4 - 0.2);
    stackDays.push({
      id: `stack-${i}`,
      date: subDays(new Date(), i),
      completed: true,
      intensity: Math.min(1.0, Math.max(0.3, intensity)),
    });
  }

  return {
    stackDays,
    currentStreak: 12,
    avgMood: 7.4,
    totalWorkouts: 5,
    totalEntries: 3,
    calculateStackDay: (date, goalsCompleted, mentalGoals, physicalGoals, mood, workoutMinutes) => {
      const dateKey = getDateKey(date);
      
      // Stack day earned if: at least 2 goals completed OR 1 mental + 1 physical
      const isStackDay = goalsCompleted >= 2 || (mentalGoals >= 1 && physicalGoals >= 1);
      
      // Calculate intensity
      const totalGoals = 4; // Adjust based on actual goals
      const intensity = Math.min(
        1.0,
        (goalsCompleted / totalGoals) * 0.5 +
        (mood / 10) * 0.3 +
        Math.min(workoutMinutes / 60, 1) * 0.2
      );

      set((state) => {
        const existingIndex = state.stackDays.findIndex(
          (day) => getDateKey(day.date) === dateKey
        );

        let updatedStackDays = [...state.stackDays];
        
        if (existingIndex >= 0) {
          updatedStackDays[existingIndex] = {
            ...updatedStackDays[existingIndex],
            completed: isStackDay,
            intensity,
          };
        } else {
          updatedStackDays.unshift({
            id: `stack-${dateKey}`,
            date,
            completed: isStackDay,
            intensity,
          });
        }

        return { stackDays: updatedStackDays };
      });

      get().recalculateStreak();
    },
    getStackQuality: () => {
      const streak = get().currentStreak;
      if (streak >= 30) return 'Epic Stack! 🔥';
      if (streak >= 14) return 'Amazing Stack! 🌟';
      if (streak >= 7) return 'Great Stack! 💪';
      if (streak >= 3) return 'Good Stack ✓';
      return 'Building Stack...';
    },
    recalculateStreak: () => {
      const days = get().stackDays.sort((a, b) => b.date.getTime() - a.date.getTime());
      let streak = 0;
      
      for (const day of days) {
        if (day.completed) {
          streak++;
        } else {
          break;
        }
      }

      set({ currentStreak: streak });
    },
  };
});

export const useInsightStore = create<InsightStore>(() => ({
  insights: [
    {
      id: '1',
      text: 'Your productivity peaks on days with morning workouts',
      icon: 'TrendingUp',
      color: '#10B981',
    },
    {
      id: '2',
      text: 'Meditation streak correlates with +23% focus improvement',
      icon: 'Brain',
      color: '#8B5CF6',
    },
    {
      id: '3',
      text: 'Energy levels 15% higher when logging 7+ hours sleep',
      icon: 'Zap',
      color: '#F59E0B',
    },
  ],
  generateInsights: (goals, workouts, mood) => {
    // Future: Generate dynamic insights based on actual data
  },
}));

export const useMoodStore = create<MoodStore>((set, get) => {
  const samples: MoodSample[] = [];
  for (let i = 0; i < 7; i++) {
    samples.push({
      id: `mood-${i}`,
      date: subDays(new Date(), 6 - i),
      mood: Math.floor(Math.random() * 4) + 5,
      energy: Math.floor(Math.random() * 4) + 5,
      productivity: Math.floor(Math.random() * 4) + 5,
      focus: Math.floor(Math.random() * 4) + 5,
      progress: Math.floor(Math.random() * 3) + 7, // 7-10 for sample data
    });
  }

  return {
    samples,
    log: (mood, energy, productivity, focus) => {
      const today = getDateKey(new Date());
      const progress = get().calculateDailyProgress(new Date());
      
      set((state) => {
        const existingIndex = state.samples.findIndex(
          (s) => getDateKey(s.date) === today
        );

        let updatedSamples = [...state.samples];
        
        if (existingIndex >= 0) {
          updatedSamples[existingIndex] = {
            ...updatedSamples[existingIndex],
            mood,
            energy,
            productivity,
            focus,
            progress,
          };
        } else {
          updatedSamples.push({
            id: `mood-${Date.now()}`,
            date: new Date(),
            mood,
            energy,
            productivity,
            focus,
            progress,
          });
        }

        return { samples: updatedSamples };
      });
    },
    getTodayMood: () => {
      const today = getDateKey(new Date());
      return get().samples.find((s) => getDateKey(s.date) === today);
    },
    getAverageMood: () => {
      const samples = get().samples;
      if (samples.length === 0) return 0;
      const sum = samples.reduce((acc, s) => acc + s.mood, 0);
      return sum / samples.length;
    },
    calculateDailyProgress: (date) => {
      const dateKey = getDateKey(date);
      const { goals } = useGoalStore.getState();
      
      if (goals.length === 0) return 0;

      let totalWeightedScore = 0;
      let totalWeight = 0;

      goals.forEach((goal) => {
        const dailyTarget = goal.dailyTarget || 0;
        if (dailyTarget === 0) return; // Skip goals without daily targets

        const completed = goal.completedDates[dateKey] || 0;
        const percentage = Math.min((completed / dailyTarget) * 100, 100);
        const weight = goal.priority || 1;

        totalWeightedScore += percentage * weight;
        totalWeight += 100 * weight;
      });

      if (totalWeight === 0) return 0;

      // Convert to 0-10 scale
      const progressPercentage = (totalWeightedScore / totalWeight) * 100;
      return Math.round((progressPercentage / 10) * 10) / 10; // Round to 1 decimal
    },
  };
});

interface JournalStore {
  entries: JournalEntry[];
  addEntry: (title: string, content: string, mood?: number, tags?: string[], type?: string, duration?: number, thoughts?: string, customDate?: Date) => void;
  getRecentEntries: (limit?: number) => JournalEntry[];
  getTodayEntries: () => JournalEntry[];
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [
    {
      id: '1',
      date: subDays(new Date(), 0),
      title: 'Morning Reflection',
      content: 'Started the day with meditation. Feeling focused and energized. Ready to tackle my goals!',
      mood: 8,
      tags: ['morning', 'meditation'],
    },
    {
      id: '2',
      date: subDays(new Date(), 1),
      title: 'Productive Day',
      content: 'Completed my reading goal and had a great workout session. The consistency is paying off.',
      mood: 9,
      tags: ['productivity', 'goals'],
    },
    {
      id: '3',
      date: subDays(new Date(), 3),
      title: 'Challenging Week',
      content: 'Had some setbacks this week but staying committed. Tomorrow is a new opportunity.',
      mood: 6,
      tags: ['reflection'],
    },
  ],
  addEntry: (title, content, mood, tags, type, duration, thoughts, customDate) => {
    const entryDate = customDate || new Date();
    const newEntry = {
      id: `journal-${Date.now()}`,
      date: entryDate,
      title,
      content,
      mood,
      tags,
      type,
      duration,
      thoughts,
    };
    
    set((state) => ({
      entries: [newEntry, ...state.entries],
    }));
    
    // Auto-update related goals
    useGoalStore.getState().autoUpdateFromJournal(newEntry);
    
    // Update mood if provided for today only
    if (mood && getDateKey(entryDate) === getDateKey(new Date())) {
      const { log, getTodayMood } = useMoodStore.getState();
      if (!getTodayMood()) {
        log(mood, 7, 7, 7); // Default other metrics to 7
      }
    }
    
    // Recalculate stack for the entry's date
    const { goals } = useGoalStore.getState();
    const { samples } = useMoodStore.getState();
    const dateKey = getDateKey(entryDate);
    
    // Get mood for that specific date
    const dateMood = mood || samples.find(s => getDateKey(s.date) === dateKey)?.mood || 7;
    
    const physicalGoals = goals.filter(g => g.category === 'physical' && (g.completedDates[dateKey] || 0) > 0).length;
    const mentalGoals = goals.filter(g => g.category === 'mental' && (g.completedDates[dateKey] || 0) > 0).length;
    
    useStackStore.getState().calculateStackDay(
      entryDate,
      physicalGoals + mentalGoals,
      mentalGoals,
      physicalGoals,
      dateMood,
      duration || 0
    );
  },
  getRecentEntries: (limit = 10) => {
    return get().entries.slice(0, limit);
  },
  getTodayEntries: () => {
    const today = getDateKey(new Date());
    return get().entries.filter((e) => getDateKey(e.date) === today);
  },
}));
