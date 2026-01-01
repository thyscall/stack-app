'use client';

import { Card } from '@/components/Card';
import { Brain, Activity } from 'lucide-react';
import { useStackStore, useWorkoutStore, useGoalStore } from '@/store';

export function TodaysProgress() {
  const { getTotalCaloriesToday } = useWorkoutStore();
  const { goals } = useGoalStore();
  
  const mentalGoalsActive = goals.filter((g) => g.category === 'mental').length;
  const physicalGoalsActive = goals.filter((g) => g.category === 'physical').length;
  const totalCalories = getTotalCaloriesToday();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-textPrimary">Today&apos;s Progress</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple" />
              <span className="text-sm text-textMuted">Mental</span>
            </div>
            <p className="text-5xl font-bold text-textPrimary">{mentalGoalsActive}</p>
            <p className="text-xs text-textMutedDark">active goals</p>
          </div>
        </Card>
        
        <Card>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green" />
              <span className="text-sm text-textMuted">Physical</span>
            </div>
            <p className="text-5xl font-bold text-textPrimary">{totalCalories || 0}</p>
            <p className="text-xs text-textMutedDark">calories burned</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

