'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { useGoalStore, useWorkoutStore, useStackStore, useMoodStore } from '@/store';
import type { Goal } from '@/types';
import { format } from 'date-fns';

interface GoalProgressInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  date: Date;
}

export function GoalProgressInputModal({
  isOpen,
  onClose,
  goal,
  date,
}: GoalProgressInputModalProps) {
  const { toggleGoalCompletion, goals } = useGoalStore();
  const { addWorkout } = useWorkoutStore();
  const { calculateStackDay } = useStackStore();
  const { getTodayMood } = useMoodStore();

  const [formData, setFormData] = useState({
    amount: 0,
    duration: 30,
    pace: '',
    calories: 0,
    avgHeartRate: 120,
    notes: '',
  });

  if (!goal) return null;

  const isPhysicalActivity = goal.category === 'physical' && (
    goal.title.toLowerCase().includes('run') ||
    goal.title.toLowerCase().includes('workout') ||
    goal.title.toLowerCase().includes('exercise') ||
    goal.title.toLowerCase().includes('training')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update goal progress
    toggleGoalCompletion(goal.id, date, formData.amount);

    // If it's a physical activity, also log it as a workout
    if (isPhysicalActivity && formData.amount > 0) {
      const workoutTitle = goal.title.includes('Run') ? 'Running' : 
                          goal.title.includes('Strength') ? 'Strength Training' :
                          goal.title.includes('Workout') ? 'Workout' : goal.title;

      addWorkout({
        title: workoutTitle,
        type: workoutTitle,
        duration: formData.duration,
        calories: formData.calories,
        avgHeartRate: formData.avgHeartRate,
        distance: formData.amount,
        pace: formData.pace || undefined,
        goalId: goal.id,
      });
    }

    // Recalculate stack day
    const todayMood = getTodayMood();
    const physicalGoals = goals.filter((g) => g.category === 'physical' && g.currentProgress > 0).length;
    const mentalGoals = goals.filter((g) => g.category === 'mental' && g.currentProgress > 0).length;
    
    calculateStackDay(
      date,
      physicalGoals + mentalGoals,
      mentalGoals,
      physicalGoals,
      todayMood?.mood || 7,
      formData.duration
    );

    // Reset form
    setFormData({
      amount: 0,
      duration: 30,
      pace: '',
      calories: 0,
      avgHeartRate: 120,
      notes: '',
    });

    onClose();
  };

  const daysRemaining = Math.ceil(
    (goal.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const remainingProgress = goal.targetProgress - goal.currentProgress;
  const requiredPerDay = daysRemaining > 0 ? (remainingProgress / daysRemaining).toFixed(1) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Log Progress: ${goal.title}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date Display */}
        <div className="text-center py-3 bg-surfaceLight rounded-xl">
          <p className="text-sm text-textMuted">Logging for</p>
          <p className="text-lg font-bold text-textPrimary">
            {format(date, 'EEEE, MMM dd, yyyy')}
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surfaceLight rounded-xl p-3 text-center">
            <p className="text-xs text-textMuted">Current Progress</p>
            <p className="text-xl font-bold text-textPrimary">
              {goal.currentProgress}/{goal.targetProgress}
            </p>
            <p className="text-xs text-textMutedDark">{goal.unit}</p>
          </div>
          <div className="bg-surfaceLight rounded-xl p-3 text-center">
            <p className="text-xs text-textMuted">Need Per Day</p>
            <p className="text-xl font-bold" style={{ color: goal.color }}>
              {requiredPerDay}
            </p>
            <p className="text-xs text-textMutedDark">{goal.unit}/day</p>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-textMuted mb-2">
            How much did you accomplish?
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="flex-1 bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue"
              placeholder="0"
              step="0.1"
              min="0"
              required
            />
            <span className="text-xl text-textMuted">{goal.unit}</span>
          </div>
        </div>

        {/* Additional fields for physical activities */}
        {isPhysicalActivity && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-2">
                  Duration (min)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textMuted mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })}
                  className="w-full bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue"
                  min="0"
                />
              </div>
            </div>

            {goal.title.toLowerCase().includes('run') && (
              <div>
                <label className="block text-sm font-medium text-textMuted mb-2">
                  Pace (optional)
                </label>
                <input
                  type="text"
                  value={formData.pace}
                  onChange={(e) => setFormData({ ...formData, pace: e.target.value })}
                  placeholder="e.g., 5:30/km"
                  className="w-full bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">
                Avg Heart Rate (bpm)
              </label>
              <input
                type="number"
                value={formData.avgHeartRate}
                onChange={(e) => setFormData({ ...formData, avgHeartRate: parseInt(e.target.value) })}
                className="w-full bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue"
                min="50"
                max="220"
              />
            </div>
          </>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-textMuted mb-2">
            Notes (optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="How did it go?"
            rows={3}
            className="w-full bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue resize-none"
          />
        </div>

        {/* Projection */}
        {formData.amount > 0 && (
          <div className="bg-green/10 border border-green/30 rounded-xl p-4">
            <p className="text-sm text-green mb-2">After this entry:</p>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-green">
                  {((goal.currentProgress + formData.amount) / goal.targetProgress * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-textMuted">Complete</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green">
                  {goal.currentProgress + formData.amount}
                </p>
                <p className="text-xs text-textMuted">{goal.unit} total</p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
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
            Log Progress
          </button>
        </div>
      </form>
    </Modal>
  );
}

