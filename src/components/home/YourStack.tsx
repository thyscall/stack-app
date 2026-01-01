'use client';

import { Card } from '@/components/Card';
import { useStackStore, useMoodStore } from '@/store';
import { Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

export function YourStack() {
  const { stackDays, currentStreak, avgMood, totalWorkouts, totalEntries, getStackQuality, recalculateStreak } =
    useStackStore();
  const { getAverageMood } = useMoodStore();
  
  const [isMounted, setIsMounted] = useState(false);
  
  // Recalculate on mount
  useEffect(() => {
    setIsMounted(true);
    recalculateStreak();
  }, [recalculateStreak]);
  
  const stackQuality = getStackQuality();
  const calculatedAvgMood = getAverageMood();

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-textMuted">Loading...</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-textMutedDark tracking-wider mb-1">
                YOUR STACK
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-textPrimary">
                  {currentStreak}
                </span>
                <span className="text-xl text-textMuted">days</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-semibold text-blue mb-1">
                {stackQuality}
              </p>
              <p className="text-xs text-textMuted flex items-center gap-1 justify-end">
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z"/>
                  <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                </svg>
                Keep it up!
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            {stackDays.slice(0, 5).reverse().map((day, index) => (
              <div
                key={day.id}
                className="h-2 rounded-md"
                style={{
                  background: `linear-gradient(to right, rgba(59, 130, 246, ${day.intensity}), rgba(59, 130, 246, ${day.intensity * 0.7}))`,
                }}
              />
            ))}
          </div>
          
          <div className="flex justify-end">
            <div className="flex items-center gap-2 text-blue">
              <Flame className="w-5 h-5" />
              <span className="text-lg font-bold text-textMuted">+5</span>
            </div>
          </div>
          
          <div className="border-t border-surfaceLight pt-3">
            <div className="grid grid-cols-3 divide-x divide-surfaceLight">
              <div className="text-center px-2">
                <p className="text-xs text-textMutedDark mb-1">Avg Mood</p>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                  <span className="text-lg font-bold text-textPrimary">
                    {calculatedAvgMood.toFixed(1)}/10
                  </span>
                </div>
              </div>
              <div className="text-center px-2">
                <p className="text-xs text-textMutedDark mb-1">Workouts</p>
                <span className="text-lg font-bold text-textPrimary">
                  {totalWorkouts}
                </span>
              </div>
              <div className="text-center px-2">
                <p className="text-xs text-textMutedDark mb-1">Entries</p>
                <span className="text-lg font-bold text-textPrimary">
                  {totalEntries}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-textMuted text-center">
            Incredible stack! Keep going! ✨
          </p>
        </div>
      </Card>
    </div>
  );
}

