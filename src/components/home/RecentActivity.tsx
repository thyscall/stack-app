'use client';

import { Card } from '@/components/Card';
import { useWorkoutStore, useJournalStore } from '@/store';
import { format } from 'date-fns';
import { Activity, BookOpen, Flame, Heart } from 'lucide-react';

interface CombinedActivity {
  id: string;
  type: 'workout' | 'journal';
  date: Date;
  data: any;
}

export function RecentActivity() {
  const { workouts } = useWorkoutStore();
  const { entries } = useJournalStore();

  // Combine and sort all activities
  const allActivities: CombinedActivity[] = [
    ...workouts.map(w => ({
      id: w.id,
      type: 'workout' as const,
      date: w.date,
      data: w
    })),
    ...entries.map(e => ({
      id: e.id,
      type: 'journal' as const,
      date: e.date,
      data: e
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-textPrimary">Recent Activity</h2>
      
      <div className="space-y-4">
        {allActivities.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-textMutedDark mx-auto mb-3" />
              <p className="text-textMuted">No recent activities</p>
            </div>
          </Card>
        ) : (
          allActivities.map((activity) => (
            <Card key={activity.id}>
              {activity.type === 'workout' ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Activity className="w-5 h-5 text-green" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-textPrimary">
                          {activity.data.title}
                        </h3>
                        <p className="text-sm text-textMuted mt-1">
                          {format(activity.date, 'MMM dd \'at\' HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-textMuted">Duration</p>
                      <p className="text-xl font-bold text-textPrimary">
                        {activity.data.duration} min
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    {activity.data.distance && (
                      <div>
                        <p className="text-xs text-textMuted">Distance</p>
                        <p className="text-xl font-semibold text-blue">
                          {activity.data.distance} mi
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-textMuted">Calories</p>
                      <p className="text-xl font-semibold text-red-500">
                        {activity.data.calories}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-textMuted">Avg HR</p>
                      <p className="text-xl font-semibold text-green">
                        {activity.data.avgHeartRate} bpm
                      </p>
                    </div>
                    {activity.data.pace && (
                      <div>
                        <p className="text-xs text-textMuted">Pace</p>
                        <p className="text-xl font-semibold text-orange">
                          {activity.data.pace}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <span className="text-xs font-semibold text-blue uppercase px-2 py-1 bg-blue/20 rounded-lg">
                      {activity.data.type}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <BookOpen className="w-5 h-5 text-purple" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-textPrimary">
                        {activity.data.title}
                      </h3>
                      <p className="text-sm text-textMuted mt-1">
                        {format(activity.date, 'MMM dd \'at\' HH:mm')}
                      </p>
                      <p className="text-sm text-textSecondary mt-2 line-clamp-2">
                        {activity.data.content}
                      </p>
                    </div>
                    {activity.data.mood && (
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-purple/20 flex items-center justify-center">
                          <span className="text-lg font-bold text-purple">
                            {activity.data.mood}
                          </span>
                        </div>
                        <p className="text-xs text-textMuted mt-1">mood</p>
                      </div>
                    )}
                  </div>

                  {activity.data.tags && activity.data.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activity.data.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-purple/20 text-purple rounded-lg"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-semibold text-purple uppercase px-2 py-1 bg-purple/20 rounded-lg">
                      Journal Entry
                    </span>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
