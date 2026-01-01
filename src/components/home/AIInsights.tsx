'use client';

import { Card } from '@/components/Card';
import { useInsightStore } from '@/store';
import { TrendingUp, Brain, Zap } from 'lucide-react';

const iconMap = {
  TrendingUp,
  Brain,
  Zap,
};

export function AIInsights() {
  const { insights } = useInsightStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-textPrimary">AI Insights</h2>
      
      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = iconMap[insight.icon as keyof typeof iconMap];
          
          return (
            <Card key={insight.id}>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${insight.color}33` }}
                >
                  <Icon
                    className="w-6 h-6"
                    style={{ color: insight.color }}
                  />
                </div>
                <p className="text-sm text-textPrimary flex-1">
                  {insight.text}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

