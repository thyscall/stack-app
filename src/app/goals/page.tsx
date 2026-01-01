'use client';

import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/Card';
import { useGoalStore, useWorkoutStore } from '@/store';
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameWeek, isSameDay } from 'date-fns';
import { GoalDetailModal } from '@/components/modals/GoalDetailModal';
import { CreateGoalModal } from '@/components/modals/CreateGoalModal';
import { GoalProgressInputModal } from '@/components/modals/GoalProgressInputModal';
import { CalendarModal } from '@/components/modals/CalendarModal';
import { DayDetailModal } from '@/components/modals/DayDetailModal';
import type { Goal } from '@/types';

export default function GoalsPage() {
  const { goals, getGoalCompletionForDate, toggleGoalCompletion } = useGoalStore();
  const { workouts } = useWorkoutStore();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);
  const [selectedDayForDetail, setSelectedDayForDetail] = useState<Date | null>(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Get current week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const isCurrentWeek = isSameWeek(weekStart, new Date(), { weekStartsOn: 1 });
  const isToday = isSameDay(viewDate, new Date());

  // Get activities for the viewed date
  const dateKey = format(viewDate, 'yyyy-MM-dd');
  const activitiesOnDate = goals.filter((goal) => {
    return goal.completedDates?.[dateKey] > 0;
  });
  
  const workoutsOnDate = workouts.filter((workout) => 
    isSameDay(new Date(workout.date), viewDate)
  );

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailModalOpen(true);
  };

  const handleDayToggle = (goal: Goal, date: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if it's a simple checklist goal (dailyTarget = 1 and unit like "days" or "sessions")
    const isSimpleChecklist = goal.dailyTarget === 1 && 
      (goal.unit === 'days' || goal.unit === 'sessions' || goal.unit === 'times');
    
    if (isSimpleChecklist) {
      // Simple toggle
      toggleGoalCompletion(goal.id, date, 1);
    } else {
      // Show input modal for detailed tracking
      setSelectedGoal(goal);
      setSelectedDate(date);
      setIsProgressModalOpen(true);
    }
  };

  const handlePrevWeek = () => {
    setWeekStart(subWeeks(weekStart, 1));
  };

  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };

  const handleDateSelect = (date: Date) => {
    const newWeekStart = startOfWeek(date, { weekStartsOn: 1 });
    setWeekStart(newWeekStart);
    setViewDate(date);
  };

  const mentalGoals = goals.filter((g) => g.category === 'mental');
  const physicalGoals = goals.filter((g) => g.category === 'physical');

  return (
    <div className="min-h-screen bg-bg pb-24">
      <div className="max-w-lg mx-auto px-5 pt-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-textPrimary">Goals</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-12 h-12 rounded-full bg-blue text-white flex items-center justify-center hover:bg-blue/90 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Week Calendar Strip */}
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevWeek}
                  className="p-1 rounded-lg hover:bg-surfaceLight transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-textMuted" />
                </button>
                
                <span className="text-sm font-semibold text-textMuted min-w-[120px] text-center">
                  {format(weekStart, 'MMM yyyy')}
                </span>
                
                <button
                  onClick={handleNextWeek}
                  className="p-1 rounded-lg hover:bg-surfaceLight transition-colors"
                  disabled={isCurrentWeek}
                >
                  <ChevronRight className={`w-5 h-5 ${isCurrentWeek ? 'text-textMutedDark' : 'text-textMuted'}`} />
                </button>
              </div>
              
              <button
                onClick={() => setIsCalendarModalOpen(true)}
                className="p-2 rounded-lg hover:bg-surfaceLight transition-colors"
              >
                <CalendarIcon className="w-4 h-4 text-textMutedDark" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => {
                      setSelectedDayForDetail(day);
                      setIsDayDetailModalOpen(true);
                    }}
                    className={`text-center hover:bg-surfaceLight rounded-xl p-2 transition-colors ${isToday ? 'text-blue font-bold' : 'text-textMuted'}`}
                  >
                    <div className="text-xs mb-1">
                      {format(day, 'EEE')}
                    </div>
                    <div className={`text-sm ${isToday ? 'bg-blue text-white' : 'bg-surfaceLight text-textPrimary'} rounded-full w-8 h-8 flex items-center justify-center mx-auto`}>
                      {format(day, 'd')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Activities for Selected Date */}
        {!isToday && (activitiesOnDate.length > 0 || workoutsOnDate.length > 0) && (
          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-textPrimary">
                Activities on {format(viewDate, 'MMMM dd, yyyy')}
              </h3>
              
              {/* Goal Activities */}
              {activitiesOnDate.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-textMuted">Goal Progress</p>
                  {activitiesOnDate.map((goal) => {
                    const amount = goal.completedDates?.[dateKey] || 0;
                    return (
                      <div
                        key={goal.id}
                        className="flex items-center justify-between p-3 bg-surfaceLight rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: goal.color }}
                          />
                          <span className="text-sm text-textPrimary">{goal.title}</span>
                        </div>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: goal.color }}
                        >
                          +{amount} {goal.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Workouts */}
              {workoutsOnDate.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-textMuted">Workouts</p>
                  {workoutsOnDate.map((workout) => (
                    <div
                      key={workout.id}
                      className="p-3 bg-surfaceLight rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-textPrimary">
                          {workout.title}
                        </span>
                        <span className="text-xs text-textMuted">
                          {workout.duration} min
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        {workout.distance && (
                          <span className="text-blue">{workout.distance} mi</span>
                        )}
                        <span className="text-red-500">{workout.calories} cal</span>
                        <span className="text-green">{workout.avgHeartRate} bpm</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Mental Goals */}
        {mentalGoals.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-purple">Mental Goals</h2>
            {mentalGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                weekDays={weekDays}
                onGoalClick={handleGoalClick}
                onDayToggle={handleDayToggle}
                getGoalCompletionForDate={getGoalCompletionForDate}
              />
            ))}
          </div>
        )}

        {/* Physical Goals */}
        {physicalGoals.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-green">Physical Goals</h2>
            {physicalGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                weekDays={weekDays}
                onGoalClick={handleGoalClick}
                onDayToggle={handleDayToggle}
                getGoalCompletionForDate={getGoalCompletionForDate}
              />
            ))}
          </div>
        )}

        {goals.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <Plus className="w-16 h-16 text-textMutedDark mx-auto mb-4" />
              <h3 className="text-xl font-bold text-textPrimary mb-2">No Goals Yet</h3>
              <p className="text-textMuted mb-6">Start by creating your first goal</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue/90 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </Card>
        )}
      </div>

      <GoalDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />

      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        onDateSelect={handleDateSelect}
        selectedDate={viewDate}
        goals={goals}
      />

      {selectedGoal && selectedDate && (
        <GoalProgressInputModal
          isOpen={isProgressModalOpen}
          onClose={() => {
            setIsProgressModalOpen(false);
            setSelectedGoal(null);
            setSelectedDate(null);
          }}
          goal={selectedGoal}
          date={selectedDate}
        />
      )}

      <DayDetailModal
        isOpen={isDayDetailModalOpen}
        onClose={() => setIsDayDetailModalOpen(false)}
        selectedDate={selectedDayForDetail}
      />
    </div>
  );
}

interface GoalCardProps {
  goal: Goal;
  weekDays: Date[];
  onGoalClick: (goal: Goal) => void;
  onDayToggle: (goal: Goal, date: Date, e: React.MouseEvent) => void;
  getGoalCompletionForDate: (goalId: string, date: Date) => number;
}

function GoalCard({
  goal,
  weekDays,
  onGoalClick,
  onDayToggle,
  getGoalCompletionForDate,
}: GoalCardProps) {
  const progress = (goal.currentProgress / goal.targetProgress) * 100;

  return (
    <div
      onClick={() => onGoalClick(goal)}
      className="w-full text-left cursor-pointer"
    >
      <Card>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {goal.streakDays > 0 && (
                  <div className="flex items-center gap-1 text-orange">
                    <span>🔥</span>
                    <span className="font-bold text-sm">{goal.streakDays}</span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-textPrimary mb-1">
                {goal.title}
              </h3>
              <p className="text-sm text-textMuted">
                {goal.dailyTarget ? `${goal.dailyTarget} ${goal.unit} per day` : goal.unit}
              </p>
            </div>
          </div>

          {/* Week View - Completion Circles with Dates */}
          <div className="flex items-center justify-between gap-1">
            {weekDays.map((day) => {
              const isCompleted = getGoalCompletionForDate(goal.id, day) > 0;
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              const dayNumber = format(day, 'd');
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={(e) => onDayToggle(goal, day, e)}
                  className={`flex flex-col items-center gap-1 transition-all group`}
                >
                  <div className="text-xs text-textMutedDark group-hover:text-textMuted transition-colors">
                    {dayNumber}
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      isCompleted
                        ? 'border-transparent'
                        : isToday
                        ? 'border-textPrimary'
                        : 'border-surfaceLight'
                    } ${isToday ? 'ring-2 ring-offset-2 ring-offset-bg' : ''} group-hover:scale-110`}
                    style={{
                      backgroundColor: isCompleted ? goal.color : 'transparent',
                      ...(isToday && { ['--tw-ring-color' as string]: goal.color }),
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-textMuted">
                {goal.currentProgress}/{goal.targetProgress} {goal.unit}
              </span>
              <span
                className="font-semibold"
                style={{ color: goal.color }}
              >
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-surfaceLight rounded-full overflow-hidden">
              <div
                className="h-full transition-all rounded-full"
                style={{
                  width: `${progress}%`,
                  backgroundColor: goal.color,
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
