'use client';

import { Card } from '@/components/Card';
import { useMoodStore } from '@/store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { format } from 'date-fns';

export function WellnessTrends() {
  const { samples } = useMoodStore();

  const chartData = samples.map((sample) => ({
    date: format(sample.date, 'MMM dd'),
    mood: sample.mood,
    focus: sample.focus,
    energy: sample.energy,
    progress: sample.progress || 0,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-textPrimary">Wellness Trends</h2>
      
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-textMuted">Last 7 Days</span>
            <div className="flex items-center gap-4">
              <LegendItem color="#A78BFA" label="Mood" />
              <LegendItem color="#60A5FA" label="Focus" />
              <LegendItem color="#FB923C" label="Energy" />
              <LegendItem color="#10B981" label="Progress" />
            </div>
          </div>
          
          <div className="h-48 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="#999"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#999"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 10]}
                  ticks={[0, 5, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F1F1F',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: number, name: string) => {
                    const label = name.charAt(0).toUpperCase() + name.slice(1);
                    return [Math.round(value), label];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#A78BFA"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="focus"
                  stroke="#60A5FA"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#FB923C"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-textMuted">{label}</span>
    </div>
  );
}

