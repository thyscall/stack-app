'use client';

import { useState, useMemo } from 'react';
import { Modal } from '@/components/Modal';
import { useGoalStore } from '@/store';
import { addDays, differenceInDays, eachDayOfInterval, getDay, format } from 'date-fns';
import { ChevronRight, ChevronLeft, Calculator } from 'lucide-react';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'basics' | 'target' | 'schedule' | 'reminder';

const DAYS_OF_WEEK = [
  { id: 0, short: 'S', full: 'Sunday' },
  { id: 1, short: 'M', full: 'Monday' },
  { id: 2, short: 'T', full: 'Tuesday' },
  { id: 3, short: 'W', full: 'Wednesday' },
  { id: 4, short: 'T', full: 'Thursday' },
  { id: 5, short: 'F', full: 'Friday' },
  { id: 6, short: 'S', full: 'Saturday' },
];

export function CreateGoalModal({ isOpen, onClose }: CreateGoalModalProps) {
  const { addGoal } = useGoalStore();
  const [currentStep, setCurrentStep] = useState<Step>('basics');
  const [formData, setFormData] = useState({
    title: '',
    category: 'mental' as 'mental' | 'physical',
    targetProgress: 30,
    unit: 'days',
    frequency: 'daily' as string,
    dueDate: addDays(new Date(), 30),
    reminderTime: '09:00',
    color: '#8B5CF6',
    activeDays: [0, 1, 2, 3, 4, 5, 6] as number[], // All days selected by default
  });

  const steps: Step[] = ['basics', 'target', 'schedule', 'reminder'];
  const currentStepIndex = steps.indexOf(currentStep);

  // Calculate the number of active days between now and the due date
  const activeDaysCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(formData.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    if (dueDate <= today) return 0;
    
    const allDays = eachDayOfInterval({ start: today, end: dueDate });
    return allDays.filter(day => formData.activeDays.includes(getDay(day))).length;
  }, [formData.dueDate, formData.activeDays]);

  // Calculate the required amount per active day
  const calculatedDailyTarget = useMemo(() => {
    if (activeDaysCount === 0) return 0;
    const remaining = formData.targetProgress;
    return Math.ceil((remaining / activeDaysCount) * 100) / 100; // Round up to 2 decimals
  }, [formData.targetProgress, activeDaysCount]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const toggleDay = (dayId: number) => {
    setFormData(prev => {
      const isSelected = prev.activeDays.includes(dayId);
      if (isSelected) {
        // Don't allow deselecting all days
        if (prev.activeDays.length === 1) return prev;
        return { ...prev, activeDays: prev.activeDays.filter(d => d !== dayId) };
      } else {
        return { ...prev, activeDays: [...prev.activeDays, dayId].sort() };
      }
    });
  };

  const handleSubmit = () => {
    addGoal({
      title: formData.title,
      category: formData.category,
      targetProgress: formData.targetProgress,
      unit: formData.unit,
      dueDate: formData.dueDate,
      color: formData.color,
      dailyTarget: calculatedDailyTarget,
      frequency: formData.frequency,
      reminderTime: formData.reminderTime,
      activeDays: formData.activeDays,
    });
    
    // Reset form
    setFormData({
      title: '',
      category: 'mental',
      targetProgress: 30,
      unit: 'days',
      frequency: 'daily',
      dueDate: addDays(new Date(), 30),
      reminderTime: '09:00',
      color: '#8B5CF6',
      activeDays: [0, 1, 2, 3, 4, 5, 6],
    });
    setCurrentStep('basics');
    onClose();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'basics':
        return formData.title.length > 0;
      case 'target':
        return formData.targetProgress > 0 && formData.unit.length > 0;
      case 'schedule':
        return formData.activeDays.length > 0 && activeDaysCount > 0;
      case 'reminder':
        return true;
      default:
        return false;
    }
  };

  const totalDays = differenceInDays(formData.dueDate, new Date());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Goal">
      <div className="space-y-6">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all ${
                index === currentStepIndex
                  ? 'w-8 bg-blue'
                  : index < currentStepIndex
                  ? 'w-2 bg-green'
                  : 'w-2 bg-surfaceLight'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {currentStep === 'basics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-textPrimary mb-6">
                  What do you want to achieve?
                </h3>
                
                <label className="block text-sm font-medium text-textMuted mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Read the Book of Mormon"
                  className="w-full bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textMuted mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, category: 'mental', color: '#8B5CF6' })}
                    className={`py-4 rounded-xl font-semibold transition-all ${
                      formData.category === 'mental'
                        ? 'bg-purple text-white'
                        : 'bg-surfaceLight text-textMuted'
                    }`}
                  >
                    🧠 Mental
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, category: 'physical', color: '#10B981' })}
                    className={`py-4 rounded-xl font-semibold transition-all ${
                      formData.category === 'physical'
                        ? 'bg-green text-white'
                        : 'bg-surfaceLight text-textMuted'
                    }`}
                  >
                    💪 Physical
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'target' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-textPrimary mb-6">
                Define your target
              </h3>

              <div>
                <label className="block text-sm font-medium text-textMuted mb-2">
                  Total Target Amount
                </label>
                <input
                  type="number"
                  value={formData.targetProgress}
                  onChange={(e) => setFormData({ ...formData, targetProgress: parseInt(e.target.value) || 0 })}
                  className="w-full bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue text-2xl font-bold text-center"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textMuted mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., pages, miles, sessions"
                  className="w-full bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue text-lg text-center"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textMuted mb-2">
                  Complete by
                </label>
                <input
                  type="date"
                  value={formData.dueDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
                  className="w-full bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-textMutedDark text-center mt-2">
                  {totalDays > 0 ? `${totalDays} days from today` : 'Select a future date'}
                </p>
              </div>
            </div>
          )}

          {currentStep === 'schedule' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-textPrimary mb-2">
                Which days will you work on this?
              </h3>
              <p className="text-textMuted text-sm mb-4">
                Select the days of the week you&apos;ll make progress
              </p>

              {/* Day selector */}
              <div className="flex justify-between gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => toggleDay(day.id)}
                    className={`w-10 h-10 rounded-full font-semibold transition-all ${
                      formData.activeDays.includes(day.id)
                        ? formData.category === 'mental'
                          ? 'bg-purple text-white'
                          : 'bg-green text-white'
                        : 'bg-surfaceLight text-textMuted'
                    }`}
                    title={day.full}
                  >
                    {day.short}
                  </button>
                ))}
              </div>

              {/* Calculated daily target */}
              <div className="bg-surfaceLight rounded-xl p-5 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${formData.category === 'mental' ? 'bg-purple/20' : 'bg-green/20'}`}>
                    <Calculator className={`w-5 h-5 ${formData.category === 'mental' ? 'text-purple' : 'text-green'}`} />
                  </div>
                  <span className="text-textMuted font-medium">Auto-calculated target</span>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-textPrimary mb-1">
                    {calculatedDailyTarget > 0 ? (
                      Number.isInteger(calculatedDailyTarget) 
                        ? calculatedDailyTarget 
                        : calculatedDailyTarget.toFixed(1)
                    ) : '—'}
                  </div>
                  <div className="text-textMuted">
                    {formData.unit} per {formData.activeDays.length === 7 ? 'day' : 'session'}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-surface text-sm text-textMuted text-center">
                  <span className="font-semibold text-textPrimary">{formData.targetProgress}</span> {formData.unit} ÷{' '}
                  <span className="font-semibold text-textPrimary">{activeDaysCount}</span> active days ={' '}
                  <span className={`font-semibold ${formData.category === 'mental' ? 'text-purple' : 'text-green'}`}>
                    {calculatedDailyTarget > 0 ? calculatedDailyTarget.toFixed(2) : '0'}
                  </span> {formData.unit}/session
                </div>
              </div>

              {activeDaysCount === 0 && (
                <p className="text-orange text-sm text-center">
                  ⚠️ No active days fall between today and your target date
                </p>
              )}
            </div>
          )}

          {currentStep === 'reminder' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-textPrimary mb-6">
                Set a reminder
              </h3>

              <div className="bg-surfaceLight rounded-xl p-6 text-center">
                <p className="text-sm text-textMuted mb-4">Remind me at</p>
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  className="bg-surface text-textPrimary text-3xl font-bold px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>

              {/* Goal Summary */}
              <div className="bg-surfaceLight rounded-xl p-5">
                <h4 className="text-sm font-medium text-textMuted mb-3">Goal Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-textMuted">Goal</span>
                    <span className="text-textPrimary font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textMuted">Target</span>
                    <span className="text-textPrimary font-medium">{formData.targetProgress} {formData.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textMuted">Due Date</span>
                    <span className="text-textPrimary font-medium">{format(formData.dueDate, 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-textMuted">Active Days</span>
                    <span className="text-textPrimary font-medium">
                      {formData.activeDays.length === 7 
                        ? 'Every day' 
                        : formData.activeDays.map(d => DAYS_OF_WEEK[d].short).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-surface">
                    <span className="text-textMuted">Per Session</span>
                    <span className={`font-bold ${formData.category === 'mental' ? 'text-purple' : 'text-green'}`}>
                      {calculatedDailyTarget > 0 ? (
                        Number.isInteger(calculatedDailyTarget) 
                          ? calculatedDailyTarget 
                          : calculatedDailyTarget.toFixed(1)
                      ) : '—'} {formData.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surfaceLight text-textPrimary font-semibold hover:bg-surfaceLight/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          )}
          
          <button
            onClick={currentStepIndex === steps.length - 1 ? handleSubmit : handleNext}
            disabled={!canProceed()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue text-white font-semibold hover:bg-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStepIndex === steps.length - 1 ? 'Create Goal' : 'Next'}
            {currentStepIndex < steps.length - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </Modal>
  );
}
