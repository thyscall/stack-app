'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { useGoalStore, useStackStore, useMoodStore, useWorkoutStore } from '@/store';
import type { Goal } from '@/types';

interface GoalProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export function GoalProgressModal({ isOpen, onClose, goal }: GoalProgressModalProps) {
  const { completeGoalForToday } = useGoalStore();
  const { calculateStackDay } = useStackStore();
  const { getTodayMood } = useMoodStore();
  const { getTotalMinutesToday } = useWorkoutStore();
  const { goals } = useGoalStore();
  
  const [amount, setAmount] = useState(1);

  if (!goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeGoalForToday(goal.id, amount);
    
    // Recalculate stack day
    const todayMood = getTodayMood();
    const physicalGoals = goals.filter((g) => g.category === 'physical' && g.currentProgress > 0).length;
    const mentalGoals = goals.filter((g) => g.category === 'mental' && g.currentProgress > 0).length;
    const workoutMinutes = getTotalMinutesToday();
    
    calculateStackDay(
      new Date(),
      physicalGoals + mentalGoals + 1,
      goal.category === 'mental' ? mentalGoals + 1 : mentalGoals,
      goal.category === 'physical' ? physicalGoals + 1 : physicalGoals,
      todayMood?.mood || 7,
      workoutMinutes
    );
    
    setAmount(1);
    onClose();
  };

  const progressPercent = (goal.currentProgress / goal.targetProgress) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update: ${goal.title}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-textMuted">Current Progress</span>
            <span className="text-lg font-bold" style={{ color: goal.color }}>
              {goal.currentProgress}/{goal.targetProgress} {goal.unit}
            </span>
          </div>
          <div className="h-3 bg-surfaceLight rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: goal.color,
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-textMuted mb-2">
            Add Progress
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setAmount(Math.max(1, amount - 1))}
              className="w-12 h-12 rounded-xl bg-surfaceLight text-textPrimary font-bold text-xl hover:bg-surfaceLight/80 transition-colors"
            >
              -
            </button>
            <div className="flex-1 text-center">
              <div className="text-4xl font-bold text-textPrimary">{amount}</div>
              <div className="text-sm text-textMuted">{goal.unit}</div>
            </div>
            <button
              type="button"
              onClick={() => setAmount(amount + 1)}
              className="w-12 h-12 rounded-xl bg-surfaceLight text-textPrimary font-bold text-xl hover:bg-surfaceLight/80 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-surfaceLight rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-textMuted">New Progress</span>
            <span className="text-lg font-bold" style={{ color: goal.color }}>
              {Math.min(goal.targetProgress, goal.currentProgress + amount)}/{goal.targetProgress} {goal.unit}
            </span>
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
            className="flex-1 text-white rounded-xl px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: goal.color }}
          >
            Update Goal
          </button>
        </div>
      </form>
    </Modal>
  );
}

