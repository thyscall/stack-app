'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { useMoodStore, useStackStore, useGoalStore, useWorkoutStore } from '@/store';

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoodModal({ isOpen, onClose }: MoodModalProps) {
  const { log, getTodayMood } = useMoodStore();
  const { calculateStackDay } = useStackStore();
  const { goals } = useGoalStore();
  const { getTotalMinutesToday } = useWorkoutStore();
  
  const existingMood = getTodayMood();
  
  const [moodData, setMoodData] = useState({
    mood: existingMood?.mood || 7,
    energy: existingMood?.energy || 7,
    productivity: existingMood?.productivity || 7,
    focus: existingMood?.focus || 7,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    log(moodData.mood, moodData.energy, moodData.productivity, moodData.focus);
    
    // Recalculate stack day
    const physicalGoals = goals.filter((g) => g.category === 'physical' && g.currentProgress > 0).length;
    const mentalGoals = goals.filter((g) => g.category === 'mental' && g.currentProgress > 0).length;
    const workoutMinutes = getTotalMinutesToday();
    
    calculateStackDay(
      new Date(),
      physicalGoals + mentalGoals,
      mentalGoals,
      physicalGoals,
      moodData.mood,
      workoutMinutes
    );
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Daily Check-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-textMuted">
              Mood
            </label>
            <span className="text-2xl font-bold text-purple">
              {moodData.mood}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={moodData.mood}
            onChange={(e) => setMoodData({ ...moodData, mood: parseInt(e.target.value) })}
            className="w-full accent-purple"
          />
          <div className="flex justify-between mt-1 text-xs text-textMutedDark">
            <span>😔 Poor</span>
            <span>😊 Great</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-textMuted">
              Energy
            </label>
            <span className="text-2xl font-bold text-orange">
              {moodData.energy}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={moodData.energy}
            onChange={(e) => setMoodData({ ...moodData, energy: parseInt(e.target.value) })}
            className="w-full accent-orange"
          />
          <div className="flex justify-between mt-1 text-xs text-textMutedDark">
            <span>😴 Tired</span>
            <span>⚡ Energized</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-textMuted">
              Productivity
            </label>
            <span className="text-2xl font-bold text-green">
              {moodData.productivity}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={moodData.productivity}
            onChange={(e) => setMoodData({ ...moodData, productivity: parseInt(e.target.value) })}
            className="w-full accent-green"
          />
          <div className="flex justify-between mt-1 text-xs text-textMutedDark">
            <span>😑 Unproductive</span>
            <span>🚀 Crushing It</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-textMuted">
              Focus
            </label>
            <span className="text-2xl font-bold text-blue">
              {moodData.focus}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={moodData.focus}
            onChange={(e) => setMoodData({ ...moodData, focus: parseInt(e.target.value) })}
            className="w-full accent-blue"
          />
          <div className="flex justify-between mt-1 text-xs text-textMutedDark">
            <span>😵 Distracted</span>
            <span>🎯 Focused</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-surfaceLight text-textPrimary rounded-xl px-6 py-3 font-semibold hover:bg-surfaceLight/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-purple text-white rounded-xl px-6 py-3 font-semibold hover:bg-purple/90 transition-colors"
          >
            Save Check-in
          </button>
        </div>
      </form>
    </Modal>
  );
}

