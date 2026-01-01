'use client';

import { Modal } from '@/components/Modal';
import { useGoalStore, useWorkoutStore, useJournalStore } from '@/store';
import { format, isFuture, isPast, isToday } from 'date-fns';
import { Calendar, CheckCircle, Circle, Plus, Activity, BookOpen, Target } from 'lucide-react';
import { useState } from 'react';
import { WorkoutModal } from './WorkoutModal';
import { JournalModal } from './JournalModal';
import { Card } from '@/components/Card';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
}

export function DayDetailModal({ isOpen, onClose, selectedDate }: DayDetailModalProps) {
  const { goals } = useGoalStore();
  const { workouts } = useWorkoutStore();
  const { entries } = useJournalStore();
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  if (!selectedDate) return null;

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  const isPastDate = isPast(selectedDate) && !isToday(selectedDate);
  const isFutureDate = isFuture(selectedDate);
  const isTodayDate = isToday(selectedDate);

  // Get activities for this date
  const dayWorkouts = workouts.filter(
    (w) => format(w.date, 'yyyy-MM-dd') === dateKey
  );
  const dayEntries = entries.filter(
    (e) => format(e.date, 'yyyy-MM-dd') === dateKey
  );

  // Get goals and their progress for this date
  const goalsWithProgress = goals.map((goal) => {
    const completedAmount = goal.completedDates[dateKey] || 0;
    const dailyTarget = goal.dailyTarget || 0;
    const progress = dailyTarget > 0 ? (completedAmount / dailyTarget) * 100 : 0;
    const isCompleted = completedAmount >= dailyTarget && dailyTarget > 0;

    return {
      ...goal,
      completedAmount,
      dailyTarget,
      progress,
      isCompleted,
    };
  });

  const physicalGoals = goalsWithProgress.filter((g) => g.category === 'physical');
  const mentalGoals = goalsWithProgress.filter((g) => g.category === 'mental');

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={format(selectedDate, 'EEEE, MMMM d, yyyy')}
      >
        <div className="space-y-6">
          {/* Date Type Indicator */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-blue" />
            <span className="text-textMuted">
              {isTodayDate && 'Today'}
              {isPastDate && 'Past Day'}
              {isFutureDate && 'Future Day'}
            </span>
          </div>

          {/* Past/Today: Show Activities */}
          {(isPastDate || isTodayDate) && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-textPrimary">Activities</h3>
                <button
                  onClick={() => setIsWorkoutModalOpen(true)}
                  className="text-sm text-blue hover:text-blue/80 font-medium"
                >
                  + Add Activity
                </button>
              </div>

              {dayWorkouts.length === 0 && dayEntries.length === 0 ? (
                <div className="text-center py-8 bg-surfaceLight rounded-xl">
                  <Activity className="w-12 h-12 text-textMutedDark mx-auto mb-2" />
                  <p className="text-textMuted text-sm">No activities logged</p>
                  <button
                    onClick={() => setIsWorkoutModalOpen(true)}
                    className="text-blue text-sm mt-2 hover:underline"
                  >
                    Add one now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {dayWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="p-3 bg-surfaceLight rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-green" />
                          <span className="font-semibold text-textPrimary">
                            {workout.title}
                          </span>
                        </div>
                        <span className="text-xs text-blue font-semibold uppercase px-2 py-1 bg-blue/20 rounded">
                          {workout.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-textMuted">
                        {workout.distance && (
                          <span>{workout.distance} mi</span>
                        )}
                        <span>{workout.duration} min</span>
                        <span>{workout.calories} cal</span>
                      </div>
                    </div>
                  ))}
                  {dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 bg-surfaceLight rounded-xl space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple" />
                        <span className="font-semibold text-textPrimary">
                          {entry.title}
                        </span>
                      </div>
                      <p className="text-xs text-textMuted line-clamp-2">
                        {entry.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Goal Progress for this day */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-textPrimary">
              {isFutureDate ? 'Goals to Work On' : 'Goal Progress'}
            </h3>

            {physicalGoals.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-green uppercase tracking-wide">
                  Physical
                </h4>
                {physicalGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-3 bg-surfaceLight rounded-xl space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {goal.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-textMutedDark flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-textPrimary text-sm">
                            {goal.title}
                          </p>
                          {isFutureDate ? (
                            <p className="text-xs text-textMuted mt-1">
                              Target: {goal.dailyTarget} {goal.unit} per day
                            </p>
                          ) : (
                            <p className="text-xs text-textMuted mt-1">
                              {goal.completedAmount} / {goal.dailyTarget} {goal.unit}
                            </p>
                          )}
                        </div>
                      </div>
                      {!isFutureDate && goal.dailyTarget > 0 && (
                        <span
                          className="text-xs font-bold"
                          style={{ color: goal.color }}
                        >
                          {goal.progress.toFixed(0)}%
                        </span>
                      )}
                    </div>
                    {!isFutureDate && goal.dailyTarget > 0 && (
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(goal.progress, 100)}%`,
                            backgroundColor: goal.color,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {mentalGoals.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-purple uppercase tracking-wide">
                  Mental
                </h4>
                {mentalGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-3 bg-surfaceLight rounded-xl space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {goal.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-purple flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-textMutedDark flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-textPrimary text-sm">
                            {goal.title}
                          </p>
                          {isFutureDate ? (
                            <p className="text-xs text-textMuted mt-1">
                              Target: {goal.dailyTarget} {goal.unit} per day
                            </p>
                          ) : (
                            <p className="text-xs text-textMuted mt-1">
                              {goal.completedAmount} / {goal.dailyTarget} {goal.unit}
                            </p>
                          )}
                        </div>
                      </div>
                      {!isFutureDate && goal.dailyTarget > 0 && (
                        <span
                          className="text-xs font-bold"
                          style={{ color: goal.color }}
                        >
                          {goal.progress.toFixed(0)}%
                        </span>
                      )}
                    </div>
                    {!isFutureDate && goal.dailyTarget > 0 && (
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(goal.progress, 100)}%`,
                            backgroundColor: goal.color,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Activity Button for Past Days */}
          {isPastDate && (
            <button
              onClick={() => setIsWorkoutModalOpen(true)}
              className="w-full bg-blue text-white rounded-xl px-6 py-4 font-semibold hover:bg-blue/90 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Activity Retroactively
            </button>
          )}

          {/* Future Day Message */}
          {isFutureDate && (
            <div className="text-center p-4 bg-blue/10 rounded-xl border border-blue/20">
              <Target className="w-8 h-8 text-blue mx-auto mb-2" />
              <p className="text-sm text-textMuted">
                Complete these goals to stay on track!
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Workout Modal for retroactive logging */}
      <WorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
        selectedDate={selectedDate}
      />
      <JournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        selectedDate={selectedDate}
      />
    </>
  );
}

