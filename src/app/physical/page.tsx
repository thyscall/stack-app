'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { useGoalStore, useWorkoutStore, useMoodStore } from '@/store';
import { Activity, Flame, TrendingUp, Plus, Dumbbell, Heart } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { WorkoutModal } from '@/components/modals/WorkoutModal';
import { GoalProgressInputModal } from '@/components/modals/GoalProgressInputModal';
import type { Goal } from '@/types';

export default function PhysicalPage() {
  const { goals } = useGoalStore();
  const { workouts, getTodayWorkouts } = useWorkoutStore();
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-bg pb-24">
        <div className="max-w-lg mx-auto px-5 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-textPrimary">Physical</h1>
          </div>
          <Card>
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse text-textMuted">Loading...</div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const physicalGoals = goals.filter((g) => g.category === 'physical');
  const todayWorkouts = getTodayWorkouts();
  const recentWorkouts = workouts
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  // Activity type colors (matching WorkoutModal)
  const activityColors: Record<string, string> = {
    'Running': '#60A5FA',
    'Walking': '#10B981',
    'Cycling': '#F59E0B',
    'HIIT': '#EF4444',
    'Strength': '#8B5CF6',
    'Yoga': '#EC4899',
    'Other': '#6B7280',
  };

  // Calculate stats for last 7 days - total calories only
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStart = startOfDay(date);
    const dayWorkouts = workouts.filter(
      (w) => startOfDay(w.date).getTime() === dateStart.getTime()
    );

    return {
      date: format(date, 'EEE'),
      calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
      duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
    };
  });

  // Overview stats
  const totalCaloriesToday = todayWorkouts.reduce((sum, w) => sum + w.calories, 0);
  const totalMinutesToday = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const workoutsThisWeek = workouts.filter((w) => {
    const daysDiff = Math.floor((new Date().getTime() - w.date.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff < 7;
  }).length;
  
  const totalDistanceThisWeek = workouts
    .filter((w) => {
      const daysDiff = Math.floor((new Date().getTime() - w.date.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff < 7 && w.distance;
    })
    .reduce((sum, w) => sum + (w.distance || 0), 0);

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsGoalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="max-w-lg mx-auto px-5 pt-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-textPrimary">Physical</h1>
          <button
            onClick={() => setIsWorkoutModalOpen(true)}
            className="w-12 h-12 rounded-full bg-green text-white flex items-center justify-center hover:bg-green/90 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Today's Overview */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textPrimary">Today's Activity</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mx-auto mb-2">
                  <Flame className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-textPrimary">{totalCaloriesToday}</p>
                <p className="text-xs text-textMuted">Calories</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue/20 mx-auto mb-2">
                  <Activity className="w-6 h-6 text-blue" />
                </div>
                <p className="text-2xl font-bold text-textPrimary">{totalMinutesToday}</p>
                <p className="text-xs text-textMuted">Minutes</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green/20 mx-auto mb-2">
                  <Dumbbell className="w-6 h-6 text-green" />
                </div>
                <p className="text-2xl font-bold text-textPrimary">{todayWorkouts.length}</p>
                <p className="text-xs text-textMuted">Workouts</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly Stats */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-textPrimary">This Week</h2>
              <TrendingUp className="w-5 h-5 text-green" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surfaceLight rounded-xl p-4">
                <p className="text-sm text-textMuted mb-1">Total Workouts</p>
                <p className="text-2xl font-bold text-green">{workoutsThisWeek}</p>
              </div>
              
              <div className="bg-surfaceLight rounded-xl p-4">
                <p className="text-sm text-textMuted mb-1">Distance</p>
                <p className="text-2xl font-bold text-blue">{totalDistanceThisWeek.toFixed(1)} mi</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Calories Chart */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textPrimary">Calories Burned</h2>
            <div className="h-48 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="#999"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#999"
                    fontSize={11}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: 'transparent',
                      border: 'none',
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-surface px-3 py-2 rounded-lg shadow-lg border border-surfaceLight">
                            <p className="text-sm font-bold text-red-500">
                              {payload[0].value} kcal
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="calories"
                    fill="#EF4444"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Activity Duration Chart */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textPrimary">Activity Duration</h2>
            <div className="h-48 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="#999"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#999"
                    fontSize={11}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F1F1F',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Physical Goals */}
        {physicalGoals.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-green">Your Physical Goals</h2>
            {physicalGoals.map((goal) => {
              const progress = (goal.currentProgress / goal.targetProgress) * 100;
              const daysLeft = Math.ceil(
                (goal.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={goal.id}
                  onClick={() => handleGoalClick(goal)}
                  className="cursor-pointer"
                >
                  <Card>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-textPrimary">
                          {goal.title}
                        </h3>
                        {goal.streakDays > 0 && (
                          <div className="flex items-center gap-1 text-orange">
                            <Flame className="w-4 h-4" />
                            <span className="text-sm font-semibold">{goal.streakDays}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-textMuted">
                          {goal.currentProgress}/{goal.targetProgress} {goal.unit}
                        </span>
                        <span className="text-textSecondary">
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="h-2 bg-surfaceLight rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: goal.color,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className="font-semibold"
                            style={{ color: goal.color }}
                          >
                            {progress.toFixed(0)}%
                          </span>
                          {goal.dailyTarget && (
                            <span className="text-textMuted">
                              {goal.dailyTarget} {goal.unit}/day
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Workouts */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-textPrimary">Recent Workouts</h2>
          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout) => (
              <Card key={workout.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-textPrimary">
                        {workout.title}
                      </h3>
                      <p className="text-sm text-textMuted">
                        {format(workout.date, 'MMM dd, yyyy • h:mm a')}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-blue uppercase px-2 py-1 bg-blue/20 rounded-lg">
                      {workout.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue" />
                      <div>
                        <p className="text-xs text-textMuted">Duration</p>
                        <p className="text-sm font-semibold text-textPrimary">
                          {workout.duration} min
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="text-xs text-textMuted">Calories</p>
                        <p className="text-sm font-semibold text-textPrimary">
                          {workout.calories}
                        </p>
                      </div>
                    </div>

                    {workout.distance && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green" />
                        <div>
                          <p className="text-xs text-textMuted">Distance</p>
                          <p className="text-sm font-semibold text-textPrimary">
                            {workout.distance} mi
                          </p>
                        </div>
                      </div>
                    )}

                    {workout.avgHeartRate && (
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <div>
                          <p className="text-xs text-textMuted">Avg HR</p>
                          <p className="text-sm font-semibold text-textPrimary">
                            {workout.avgHeartRate} bpm
                          </p>
                        </div>
                      </div>
                    )}

                    {workout.pace && (
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple" />
                        <div>
                          <p className="text-xs text-textMuted">Pace</p>
                          <p className="text-sm font-semibold text-textPrimary">
                            {workout.pace}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-8">
                <Dumbbell className="w-12 h-12 text-textMutedDark mx-auto mb-3" />
                <p className="text-textMuted">No workouts logged yet</p>
                <button
                  onClick={() => setIsWorkoutModalOpen(true)}
                  className="mt-4 bg-green text-white px-6 py-2 rounded-xl font-semibold hover:bg-green/90 transition-colors"
                >
                  Log Your First Workout
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <WorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
      />

      {selectedGoal && (
        <GoalProgressInputModal
          isOpen={isGoalModalOpen}
          onClose={() => {
            setIsGoalModalOpen(false);
            setSelectedGoal(null);
          }}
          goal={selectedGoal}
          date={new Date()}
        />
      )}
    </div>
  );
}
