'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import type { Goal } from '@/types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  goals: Goal[];
}

export function CalendarModal({
  isOpen,
  onClose,
  onDateSelect,
  selectedDate,
  goals,
}: CalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get goals with due dates in current month
  const goalsInMonth = goals.filter((goal) => {
    const dueDate = new Date(goal.dueDate);
    return (
      dueDate.getMonth() === currentMonth.getMonth() &&
      dueDate.getFullYear() === currentMonth.getFullYear()
    );
  });

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const hasGoalActivity = (date: Date) => {
    return goals.some((goal) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      return goal.completedDates?.[dateKey] > 0;
    });
  };

  const hasGoalDue = (date: Date) => {
    return goals.some((goal) => 
      isSameDay(new Date(goal.dueDate), date)
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Date">
      <div className="space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl hover:bg-surfaceLight transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-textPrimary" />
          </button>
          
          <h3 className="text-xl font-bold text-textPrimary">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl hover:bg-surfaceLight transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-textPrimary" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-textMuted"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const hasActivity = hasGoalActivity(day);
            const isDueDate = hasGoalDue(day);
            const isPast = day < new Date();
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                disabled={!isCurrentMonth}
                className={`
                  relative aspect-square rounded-xl p-2 transition-all
                  ${!isCurrentMonth ? 'opacity-30 cursor-not-allowed' : 'hover:bg-surfaceLight'}
                  ${isSelected ? 'bg-blue text-white' : 'text-textPrimary'}
                  ${isToday && !isSelected ? 'ring-2 ring-blue ring-offset-2 ring-offset-bg' : ''}
                `}
              >
                <div className="text-sm font-semibold">
                  {format(day, 'd')}
                </div>
                
                {/* Activity Indicator */}
                {hasActivity && !isSelected && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 rounded-full bg-green" />
                  </div>
                )}
                
                {/* Due Date Indicator */}
                {isDueDate && !isSelected && (
                  <div className="absolute top-1 right-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-surfaceLight">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green" />
            <span className="text-xs text-textMuted">Has Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange" />
            <span className="text-xs text-textMuted">Goal Due</span>
          </div>
        </div>

        {/* Goals Due This Month */}
        {goalsInMonth.length > 0 && (
          <div className="pt-4 border-t border-surfaceLight">
            <h4 className="text-sm font-semibold text-textMuted mb-3">
              Goals Due This Month
            </h4>
            <div className="space-y-2">
              {goalsInMonth.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 bg-surfaceLight rounded-xl"
                >
                  <span className="text-sm text-textPrimary">{goal.title}</span>
                  <span className="text-xs text-textMuted">
                    {format(goal.dueDate, 'MMM dd')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

