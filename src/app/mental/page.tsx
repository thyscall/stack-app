'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { useGoalStore, useMoodStore, useJournalStore } from '@/store';
import { 
  Plus,
  Brain, 
  TrendingUp, 
  BookOpen, 
  Flame,
  Clock,
  Target,
  Heart,
  Lightbulb
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import { JournalModal } from '@/components/modals/JournalModal';
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
import type { Goal } from '@/types';

export default function MentalPage() {
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { goals } = useGoalStore();
  const { samples, getAverageMood } = useMoodStore();
  const { entries, getTodayEntries } = useJournalStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-bg pb-24">
        <div className="max-w-lg mx-auto px-5 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-textPrimary">Mental</h1>
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

  const mentalGoals = goals.filter((g) => g.category === 'mental');
  const todayEntries = getTodayEntries();
  const recentEntries = entries
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  // Calculate stats for last 7 days - total minutes for mental activities
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStart = startOfDay(date);
    const dayEntries = entries.filter(
      (e) => startOfDay(e.date).getTime() === dateStart.getTime()
    );
    const daySamples = samples.filter(
      (s) => startOfDay(s.date).getTime() === dateStart.getTime()
    );

    // Calculate total minutes from entries with duration
    const totalMinutes = dayEntries.reduce((sum, e) => sum + (e.duration || 0), 0);

    return {
      date: format(date, 'EEE'),
      minutes: totalMinutes,
      focus: daySamples.length > 0 ? daySamples[0].focus : 0,
      mood: daySamples.length > 0 ? daySamples[0].mood : 0,
    };
  });

  // Overview stats
  const entriesThisWeek = entries.filter((e) => {
    const daysDiff = Math.floor((new Date().getTime() - e.date.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff < 7;
  }).length;

  const avgFocusThisWeek = samples.slice(-7).reduce((sum, s) => sum + s.focus, 0) / Math.max(samples.slice(-7).length, 1);
  const avgMood = getAverageMood();

  // Meditation stats (placeholder for future meditation tracking)
  const meditationMinutesToday = 0; // TODO: Link to meditation store
  const meditationSessionsThisWeek = 0; // TODO: Link to meditation store

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    // TODO: Open goal progress modal
  };

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="max-w-lg mx-auto px-5 pt-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-textPrimary">Mental</h1>
          <button
            onClick={() => setIsJournalModalOpen(true)}
            className="w-12 h-12 rounded-full bg-purple text-white flex items-center justify-center hover:bg-purple/90 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Today's Mental Activity */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textPrimary">Today's Mental Activity</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple/20 mx-auto mb-2">
                  <Brain className="w-6 h-6 text-purple" />
                </div>
                <p className="text-2xl font-bold text-textPrimary">{meditationMinutesToday}</p>
                <p className="text-xs text-textMuted">Minutes</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue/20 mx-auto mb-2">
                  <BookOpen className="w-6 h-6 text-blue" />
                </div>
                <p className="text-2xl font-bold text-textPrimary">{todayEntries.length}</p>
                <p className="text-xs text-textMuted">Entries</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange/20 mx-auto mb-2">
                  <Target className="w-6 h-6 text-orange" />
                </div>
                <p className="text-2xl font-bold text-textPrimary">{avgFocusThisWeek.toFixed(1)}</p>
                <p className="text-xs text-textMuted">Focus</p>
              </div>
            </div>
          </div>
        </Card>

        {/* This Week Stats */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-textPrimary">This Week</h2>
              <TrendingUp className="w-5 h-5 text-purple" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surfaceLight rounded-xl p-4">
                <p className="text-sm text-textMuted mb-1">Journal Entries</p>
                <p className="text-2xl font-bold text-purple">{entriesThisWeek}</p>
              </div>
              
              <div className="bg-surfaceLight rounded-xl p-4">
                <p className="text-sm text-textMuted mb-1">Avg Mood</p>
                <p className="text-2xl font-bold text-blue">{avgMood.toFixed(1)}/10</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Mental Activity Chart */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textPrimary">Mental Activity</h2>
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
                    domain={[0, 'dataMax + 10']}
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
                            <p className="text-sm font-bold text-purple">
                              {payload[0].value} min
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="minutes"
                    fill="#8B5CF6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Focus & Mood Trends */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-textPrimary">Focus & Mood Trends</h2>
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
                    domain={[0, 10]}
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
                    dataKey="focus"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#A78BFA"
                    strokeWidth={3}
                    dot={{ fill: '#A78BFA', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Mental Goals */}
        {mentalGoals.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-purple">Your Mental Goals</h2>
            {mentalGoals.map((goal) => {
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

        {/* Recent Journal Entries */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-textPrimary">Recent Journal Entries</h2>
          {recentEntries.length > 0 ? (
            recentEntries.map((entry) => (
              <Card key={entry.id}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-textPrimary">
                        {entry.title}
                      </h3>
                      <p className="text-sm text-textMuted mt-1">
                        {format(entry.date, 'MMM dd, yyyy • h:mm a')}
                      </p>
                    </div>
                    {entry.mood && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple">{entry.mood}</p>
                        <p className="text-xs text-textMuted">mood</p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-textMuted line-clamp-2">
                    {entry.content}
                  </p>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-purple/20 text-purple rounded-lg"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-textMutedDark mx-auto mb-3" />
                <p className="text-textMuted">No journal entries yet</p>
                <button
                  onClick={() => setIsJournalModalOpen(true)}
                  className="mt-4 bg-purple text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple/90 transition-colors"
                >
                  Create Your First Entry
                </button>
              </div>
            </Card>
          )}
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-textPrimary">Insights</h2>
          
          <Card>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-purple" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-textPrimary mb-1">
                  Focus Peak Times
                </h3>
                <p className="text-sm text-textMuted">
                  Your focus scores are highest during morning check-ins. Consider scheduling important mental tasks early in the day.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-green" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-textPrimary mb-1">
                  Journaling Streak
                </h3>
                <p className="text-sm text-textMuted">
                  You've journaled {entriesThisWeek} times this week. Keep up the consistency for better mental clarity!
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-textPrimary mb-1">
                  Mood Correlation
                </h3>
                <p className="text-sm text-textMuted">
                  Your mood scores are {((avgMood / 10) * 100).toFixed(0)}% positive. Journaling on difficult days helps process emotions.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
      />
    </div>
  );
}
