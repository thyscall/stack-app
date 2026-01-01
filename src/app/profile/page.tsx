'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { useGoalStore, useWorkoutStore, useJournalStore, useMoodStore, useStackStore } from '@/store';
import { 
  Settings, 
  Share2, 
  Trophy, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Activity,
  Flame,
  Award,
  Target,
  Heart,
  Zap
} from 'lucide-react';
import { format, subDays, startOfDay, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
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

type TabType = 'progress' | 'activities';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>('progress');
  const { goals } = useGoalStore();
  const { workouts } = useWorkoutStore();
  const { entries } = useJournalStore();
  const { samples } = useMoodStore();
  const { stackDays, currentStreak } = useStackStore();

  // Calculate stats
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  
  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate >= thisWeekStart && workoutDate <= thisWeekEnd;
  });

  const totalDistanceThisWeek = thisWeekWorkouts
    .filter(w => w.distance)
    .reduce((sum, w) => sum + (w.distance || 0), 0);

  const totalTimeThisWeek = thisWeekWorkouts.reduce((sum, w) => sum + w.duration, 0);

  const totalCaloriesThisWeek = thisWeekWorkouts.reduce((sum, w) => sum + w.calories, 0);

  // Last 12 weeks data for chart
  const last12Weeks = Array.from({ length: 12 }, (_, i) => {
    const weekStart = startOfWeek(subDays(new Date(), (11 - i) * 7), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    const weekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate >= weekStart && workoutDate <= weekEnd;
    });

    const distance = weekWorkouts
      .filter(w => w.distance)
      .reduce((sum, w) => sum + (w.distance || 0), 0);

    return {
      week: format(weekStart, 'MMM dd'),
      distance: distance,
      workouts: weekWorkouts.length,
    };
  });

  // Best performances
  const runningWorkouts = workouts.filter(w => w.type.toLowerCase().includes('run') || w.type.toLowerCase().includes('cardio'));
  const bestDistance = Math.max(...runningWorkouts.map(w => w.distance || 0), 0);
  const bestPace = runningWorkouts
    .filter(w => w.pace)
    .sort((a, b) => {
      const aPace = parseFloat(a.pace?.split(':')[0] || '999');
      const bPace = parseFloat(b.pace?.split(':')[0] || '999');
      return aPace - bPace;
    })[0];

  const longestRun = runningWorkouts.find(w => (w.distance || 0) === bestDistance);

  // Active goals
  const activeGoals = goals.filter(g => g.currentProgress < g.targetProgress);
  
  // Recent activities grouped by month
  const recentWorkouts = workouts.slice(-10).reverse();

  // Streak calendar data - last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const hasWorkout = workouts.some(w => isSameDay(new Date(w.date), date));
    const hasEntry = entries.some(e => isSameDay(e.date, date));
    const hasMood = samples.some(s => isSameDay(s.date, date));
    
    return {
      date,
      active: hasWorkout || hasEntry || hasMood,
      dayOfMonth: format(date, 'd'),
      dayOfWeek: format(date, 'EEE')[0],
    };
  });

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="max-w-lg mx-auto px-5 pt-12 space-y-6">
        {/* Profile Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue to-purple flex items-center justify-center text-3xl font-bold text-white">
                {/* User initials or photo */}
                U
              </div>
              <div>
                <h1 className="text-2xl font-bold text-textPrimary">Your Profile</h1>
                <p className="text-sm text-textMuted">Stack Member</p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-surfaceLight transition-colors">
              <Settings className="w-6 h-6 text-textMuted" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex-1 bg-surfaceLight text-textPrimary px-4 py-3 rounded-xl font-semibold hover:bg-surfaceLight/80 transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-surfaceLight">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 pb-4 font-semibold transition-colors relative ${
              activeTab === 'progress' ? 'text-textPrimary' : 'text-textMuted'
            }`}
          >
            Progress
            {activeTab === 'progress' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue rounded-t-lg" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`flex-1 pb-4 font-semibold transition-colors relative ${
              activeTab === 'activities' ? 'text-textPrimary' : 'text-textMuted'
            }`}
          >
            Activities
            {activeTab === 'activities' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue rounded-t-lg" />
            )}
          </button>
        </div>

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Current Streak */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-textMuted mb-1">Current Streak</p>
                  <div className="flex items-center gap-2">
                    <Flame className="w-8 h-8 text-orange" />
                    <span className="text-4xl font-bold text-textPrimary">
                      {currentStreak}
                    </span>
                    <span className="text-lg text-textMuted">days</span>
                  </div>
                </div>
                <Trophy className="w-12 h-12 text-orange opacity-20" />
              </div>
            </Card>

            {/* This Week Stats */}
            <Card>
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-textPrimary">This Week</h2>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-textMuted mb-1">Distance</p>
                    <p className="text-2xl font-bold text-textPrimary">
                      {totalDistanceThisWeek.toFixed(1)}
                    </p>
                    <p className="text-xs text-textMuted">mi</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-textMuted mb-1">Time</p>
                    <p className="text-2xl font-bold text-textPrimary">
                      {Math.floor(totalTimeThisWeek / 60)}h {totalTimeThisWeek % 60}m
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-textMuted mb-1">Workouts</p>
                    <p className="text-2xl font-bold text-textPrimary">
                      {thisWeekWorkouts.length}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Weekly Distance Chart */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-textPrimary">Past 12 Weeks</h2>
                  <TrendingUp className="w-5 h-5 text-green" />
                </div>
                
                <div className="h-48 -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={last12Weeks}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                      <XAxis
                        dataKey="week"
                        stroke="#999"
                        fontSize={9}
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
                        dataKey="distance"
                        stroke="#F97316"
                        strokeWidth={3}
                        dot={{ fill: '#F97316', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            {/* Best Efforts */}
            {longestRun && (
              <Card>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange" />
                    <h2 className="text-lg font-bold text-textPrimary">Best Efforts</h2>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-surfaceLight rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-textPrimary">Longest Run</p>
                        <p className="text-xs text-textMuted mt-1">
                          {format(longestRun.date, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange">{bestDistance.toFixed(1)}</p>
                        <p className="text-xs text-textMuted">mi</p>
                      </div>
                    </div>

                    {bestPace && (
                      <div className="flex items-center justify-between p-3 bg-surfaceLight rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-textPrimary">Best Pace</p>
                          <p className="text-xs text-textMuted mt-1">
                            {format(bestPace.date, 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue">{bestPace.pace}</p>
                          <p className="text-xs text-textMuted">/mi</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <Card>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-green" />
                    <h2 className="text-lg font-bold text-textPrimary">Active Goals</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {activeGoals.map(goal => {
                      const progress = (goal.currentProgress / goal.targetProgress) * 100;
                      const daysLeft = Math.ceil(
                        (goal.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      
                      return (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-textPrimary">
                              {goal.title}
                            </span>
                            <span className="text-xs text-textMuted">
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                            </span>
                          </div>
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
                            <span className="text-textMuted">
                              {goal.currentProgress}/{goal.targetProgress} {goal.unit}
                            </span>
                            <span style={{ color: goal.color }} className="font-semibold">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}

            {/* Activity Calendar */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue" />
                  <h2 className="text-lg font-bold text-textPrimary">Last 30 Days</h2>
                </div>
                
                <div className="grid grid-cols-10 gap-1">
                  {last30Days.map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-sm ${
                        day.active
                          ? 'bg-green'
                          : 'bg-surfaceLight'
                      }`}
                      title={format(day.date, 'MMM dd')}
                    />
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-textMuted">
                  <span>Less active</span>
                  <span>More active</span>
                </div>
              </div>
            </Card>

            {/* Monthly Totals */}
            <Card>
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-textPrimary">
                  {format(new Date(), 'MMMM yyyy')} Totals
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surfaceLight rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-4 h-4 text-red-500" />
                      <p className="text-xs text-textMuted">Calories</p>
                    </div>
                    <p className="text-2xl font-bold text-textPrimary">
                      {totalCaloriesThisWeek}
                    </p>
                  </div>
                  
                  <div className="bg-surfaceLight rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-blue" />
                      <p className="text-xs text-textMuted">Activities</p>
                    </div>
                    <p className="text-2xl font-bold text-textPrimary">
                      {workouts.length}
                    </p>
                  </div>
                  
                  <div className="bg-surfaceLight rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-purple" />
                      <p className="text-xs text-textMuted">Journal</p>
                    </div>
                    <p className="text-2xl font-bold text-textPrimary">
                      {entries.length}
                    </p>
                  </div>
                  
                  <div className="bg-surfaceLight rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-orange" />
                      <p className="text-xs text-textMuted">Stack Days</p>
                    </div>
                    <p className="text-2xl font-bold text-textPrimary">
                      {stackDays.filter(d => d.completed).length}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search and filter your activities"
                className="w-full bg-surfaceLight text-textPrimary placeholder-textMuted rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue"
              />
              <svg
                className="w-5 h-5 text-textMuted absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {recentWorkouts.map((workout) => (
                  <Card key={workout.id}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-textPrimary">
                            {workout.title}
                          </h3>
                          <p className="text-sm text-textMuted mt-1">
                            {format(workout.date, 'EEEE \'at\' h:mm a')}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-blue uppercase px-2 py-1 bg-blue/20 rounded-lg">
                          {workout.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-surfaceLight">
                        {workout.distance && (
                          <div>
                            <p className="text-xs text-textMuted">Distance</p>
                            <p className="text-lg font-bold text-textPrimary mt-1">
                              {workout.distance} <span className="text-sm font-normal">mi</span>
                            </p>
                          </div>
                        )}
                        
                        {workout.pace && (
                          <div>
                            <p className="text-xs text-textMuted">Pace</p>
                            <p className="text-lg font-bold text-textPrimary mt-1">
                              {workout.pace} <span className="text-sm font-normal">/mi</span>
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-xs text-textMuted">Time</p>
                          <p className="text-lg font-bold text-textPrimary mt-1">
                            {workout.duration} <span className="text-sm font-normal">min</span>
                          </p>
                        </div>
                      </div>

                      {(workout.calories || workout.avgHeartRate) && (
                        <div className="flex items-center gap-4 text-xs">
                          {workout.calories && (
                            <div className="flex items-center gap-1">
                              <Flame className="w-4 h-4 text-red-500" />
                              <span className="text-textMuted">{workout.calories} cal</span>
                            </div>
                          )}
                          {workout.avgHeartRate && (
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4 text-red-400" />
                              <span className="text-textMuted">{workout.avgHeartRate} bpm</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-textMutedDark mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-textPrimary mb-2">No Activities Yet</h3>
                  <p className="text-textMuted">Start tracking your activities to see them here</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
