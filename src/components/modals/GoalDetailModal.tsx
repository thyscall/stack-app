'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { BarChart, Clock, FileText, Settings as SettingsIcon } from 'lucide-react';
import { Card } from '@/components/Card';
import type { Goal } from '@/types';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface GoalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

type Tab = 'charts' | 'history' | 'notes' | 'settings';

export function GoalDetailModal({ isOpen, onClose, goal }: GoalDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('charts');

  if (!goal) return null;

  const progress = (goal.currentProgress / goal.targetProgress) * 100;
  
  // Generate sample progress data
  const progressData = Object.entries(goal.completedDates || {})
    .map(([date, amount]) => ({
      date: format(new Date(date), 'MMM dd'),
      amount,
    }))
    .slice(-7);

  const tabs = [
    { id: 'charts' as Tab, label: 'Charts', icon: BarChart },
    { id: 'history' as Tab, label: 'History', icon: Clock },
    { id: 'notes' as Tab, label: 'Notes', icon: FileText },
    { id: 'settings' as Tab, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={goal.title}>
      <div className="space-y-6">
        {/* Progress Overview */}
        <div className="text-center py-6" style={{ backgroundColor: `${goal.color}20`, borderRadius: '16px' }}>
          <div className="text-6xl font-bold mb-2" style={{ color: goal.color }}>
            {progress.toFixed(0)}%
          </div>
          <p className="text-textMuted">
            {goal.currentProgress} of {goal.targetProgress} {goal.unit}
          </p>
          <p className="text-sm text-textMutedDark mt-2">
            Due {format(goal.dueDate, 'MMM dd, yyyy')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-surfaceLight text-textPrimary'
                    : 'bg-transparent text-textMuted hover:text-textPrimary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'charts' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-textPrimary">Progress Over Time</h3>
              
              {progressData.length > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
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
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F1F1F',
                          border: 'none',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke={goal.color}
                        strokeWidth={3}
                        dot={{ fill: goal.color, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <Card>
                  <div className="text-center py-8">
                    <p className="text-textMuted">No data yet</p>
                    <p className="text-sm text-textMutedDark mt-1">
                      Start tracking to see your progress
                    </p>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <div className="text-center py-4">
                    <p className="text-2xl font-bold" style={{ color: goal.color }}>
                      {goal.streakDays}
                    </p>
                    <p className="text-xs text-textMuted mt-1">Day Streak</p>
                  </div>
                </Card>
                <Card>
                  <div className="text-center py-4">
                    <p className="text-2xl font-bold text-textPrimary">
                      {goal.dailyTarget || 1}
                    </p>
                    <p className="text-xs text-textMuted mt-1">Daily Target</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-textPrimary">Activity History</h3>
              
              {Object.entries(goal.completedDates || {}).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(goal.completedDates)
                    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                    .slice(0, 10)
                    .map(([date, amount]) => (
                      <Card key={date}>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-textPrimary">
                            {format(new Date(date), 'EEE, MMM dd, yyyy')}
                          </span>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: goal.color }}
                          >
                            +{amount} {goal.unit}
                          </span>
                        </div>
                      </Card>
                    ))}
                </div>
              ) : (
                <Card>
                  <div className="text-center py-8">
                    <p className="text-textMuted">No history yet</p>
                    <p className="text-sm text-textMutedDark mt-1">
                      Complete activities to build your history
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-textPrimary">Notes & Reflections</h3>
              <Card>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-textMutedDark mx-auto mb-3" />
                  <p className="text-textMuted">Notes feature coming soon</p>
                  <p className="text-sm text-textMutedDark mt-1">
                    Add notes to track your journey
                  </p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-textPrimary">Goal Settings</h3>
              
              <Card>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-textMuted">Goal Name</label>
                    <p className="text-textPrimary mt-1">{goal.title}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-textMuted">Category</label>
                    <p className="text-textPrimary mt-1 capitalize">{goal.category}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-textMuted">Daily Target</label>
                    <p className="text-textPrimary mt-1">
                      {goal.dailyTarget || 1} {goal.unit}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-textMuted">Frequency</label>
                    <p className="text-textPrimary mt-1 capitalize">{goal.frequency || 'Daily'}</p>
                  </div>
                  
                  {goal.reminderTime && (
                    <div>
                      <label className="text-sm font-medium text-textMuted">Reminder Time</label>
                      <p className="text-textPrimary mt-1">{goal.reminderTime}</p>
                    </div>
                  )}
                </div>
              </Card>
              
              <button className="w-full py-3 rounded-xl bg-red-500/20 text-red-500 font-semibold hover:bg-red-500/30 transition-colors">
                Delete Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

