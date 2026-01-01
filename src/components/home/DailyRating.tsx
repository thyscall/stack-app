'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { useMoodStore } from '@/store';
import { ArrowRight } from 'lucide-react';

export function DailyRating() {
  const router = useRouter();
  const { log, getTodayMood, calculateDailyProgress } = useMoodStore();
  
  const [mood, setMood] = useState(5);
  const [focus, setFocus] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [isEditing, setIsEditing] = useState(true);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const existingMood = getTodayMood();
    const progress = calculateDailyProgress(new Date());
    
    if (existingMood) {
      setMood(existingMood.mood);
      setFocus(existingMood.focus);
      setEnergy(existingMood.energy);
      setIsEditing(false);
    }
    
    setDailyProgress(progress);
  }, [getTodayMood, calculateDailyProgress]);

  const handleSubmit = () => {
    log(mood, energy, 0, focus); // mood, energy, productivity (0), focus
    setIsEditing(false);
    setDailyProgress(calculateDailyProgress(new Date()));
  };

  const handleGoToGoals = () => {
    router.push('/goals');
  };

  if (!isMounted) {
    return (
      <Card>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-textPrimary">
            How'd it go today?
          </h2>
          <div className="h-32 flex items-center justify-center">
            <div className="animate-pulse text-textMuted">Loading...</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-textPrimary">
            How'd it go today?
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue hover:text-blue/80 font-medium"
            >
              Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Mood */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-textMuted block text-center">
              Mood
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full h-2 bg-surfaceLight rounded-lg appearance-none cursor-pointer accent-purple disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <div className="text-center mt-1">
                <span className="text-xl font-bold text-purple">{mood}</span>
              </div>
            </div>
          </div>

          {/* Focus */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-textMuted block text-center">
              Focus
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={focus}
                onChange={(e) => setFocus(parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full h-2 bg-surfaceLight rounded-lg appearance-none cursor-pointer accent-blue disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <div className="text-center mt-1">
                <span className="text-xl font-bold text-blue">{focus}</span>
              </div>
            </div>
          </div>

          {/* Energy */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-textMuted block text-center">
              Energy
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full h-2 bg-surfaceLight rounded-lg appearance-none cursor-pointer accent-orange disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <div className="text-center mt-1">
                <span className="text-xl font-bold text-chartOrange">{energy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-calculated Progress */}
        <div className="pt-3 border-t border-surfaceLight">
          {dailyProgress === 0 ? (
            <button
              onClick={handleGoToGoals}
              className="w-full flex items-center justify-between hover:bg-surfaceLight/50 rounded-xl p-2 transition-colors group"
            >
              <div className="text-left">
                <p className="text-sm font-semibold text-textPrimary">Today's Progress</p>
                <p className="text-xs text-textSecondary mt-1">Update your goal progress</p>
              </div>
              <ArrowRight className="w-4 h-4 text-blue group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-textMuted">Today's Progress</p>
                <p className="text-xs text-textSecondary mt-1">Auto-calculated from goals</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green">{dailyProgress.toFixed(1)}</span>
                <span className="text-sm text-textMuted ml-1">/10</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {isEditing && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue text-white rounded-xl px-6 py-3 font-semibold hover:bg-blue/90 transition-colors"
          >
            Save Rating
          </button>
        )}
      </div>
    </Card>
  );
}

