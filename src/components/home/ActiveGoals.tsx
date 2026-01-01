'use client';

import { Card } from '@/components/Card';
import { useGoalStore } from '@/store';
import { Flame, Target, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { GoalProgressInputModal } from '@/components/modals/GoalProgressInputModal';
import type { Goal } from '@/types';

export function ActiveGoals() {
  const { goals } = useGoalStore();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoal(null);
  };

  // Get today's date key
  const todayKey = format(new Date(), 'yyyy-MM-dd');

  // Calculate today's targets
  const todaysTasks = goals.map((goal) => {
    const completedToday = goal.completedDates[todayKey] || 0;
    const target = goal.dailyTarget || 0;
    const isCompleted = completedToday >= target && target > 0;
    
    return {
      ...goal,
      completedToday,
      target,
      isCompleted,
      remaining: Math.max(0, target - completedToday),
    };
  }).filter(task => task.target > 0); // Only show goals with daily targets

  const completedTasks = todaysTasks.filter(t => t.isCompleted).length;
  const totalTasks = todaysTasks.length;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-textPrimary">Active Goals</h2>

      {/* Today's Plan Card */}
      {todaysTasks.length > 0 && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue" />
                <h3 className="text-lg font-bold text-textPrimary">Today's Plan</h3>
              </div>
              <div className="text-sm text-textMuted">
                {completedTasks}/{totalTasks} completed
              </div>
            </div>

            <div className="space-y-2">
              {todaysTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleGoalClick(task)}
                  className="w-full flex items-center justify-between p-3 bg-surfaceLight rounded-xl hover:bg-surfaceLight/80 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-textMutedDark flex-shrink-0" />
                    )}
                    <div>
                      <p className={`text-sm font-semibold ${task.isCompleted ? 'text-textMuted line-through' : 'text-textPrimary'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-textMuted mt-0.5">
                        {task.isCompleted 
                          ? `Completed ${task.completedToday} ${task.unit}` 
                          : `${task.remaining} ${task.unit} remaining`
                        }
                      </p>
                    </div>
                  </div>
                  <div 
                    className="text-xs font-bold px-2 py-1 rounded-lg"
                    style={{ 
                      backgroundColor: `${task.color}20`,
                      color: task.color 
                    }}
                  >
                    {task.target} {task.unit}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
      
      {/* Goal Cards */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
        {goals.map((goal) => {
          const progress = (goal.currentProgress / goal.targetProgress) * 100;
          
          return (
            <div
              key={goal.id}
              onClick={() => handleGoalClick(goal)}
              className="flex-shrink-0 w-[calc(50%-8px)] transition-all rounded-card hover:scale-[1.02] cursor-pointer"
            >
              <Card>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-orange">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {goal.streakDays}
                      </span>
                    </div>
                    <span className="text-xs text-textMutedDark">
                      {goal.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-textPrimary text-left">
                    {goal.title}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-textMuted">Progress</span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: goal.color }}
                      >
                        {goal.currentProgress}/{goal.targetProgress} {goal.unit}
                      </span>
                    </div>
                    
                    <div className="h-2 bg-surfaceLight rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                    
                    <p className="text-xs text-textMutedDark">
                      Due {format(goal.dueDate, 'MMM dd')}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      <GoalProgressInputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        goal={selectedGoal}
        date={new Date()}
      />
    </div>
  );
}

