'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { useGoalStore } from '@/store';
import { addDays } from 'date-fns';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'basics' | 'target' | 'frequency' | 'reminder';

export function CreateGoalModal({ isOpen, onClose }: CreateGoalModalProps) {
  const { addGoal } = useGoalStore();
  const [currentStep, setCurrentStep] = useState<Step>('basics');
  const [formData, setFormData] = useState({
    title: '',
    category: 'mental' as 'mental' | 'physical',
    targetProgress: 30,
    unit: 'days',
    dailyTarget: 1,
    frequency: 'daily' as string,
    dueDate: addDays(new Date(), 30),
    reminderTime: '09:00',
    color: '#8B5CF6',
  });

  const steps: Step[] = ['basics', 'target', 'frequency', 'reminder'];
  const currentStepIndex = steps.indexOf(currentStep);

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

  const handleSubmit = () => {
    addGoal({
      title: formData.title,
      category: formData.category,
      targetProgress: formData.targetProgress,
      unit: formData.unit,
      dueDate: formData.dueDate,
      color: formData.color,
      dailyTarget: formData.dailyTarget,
      frequency: formData.frequency,
      reminderTime: formData.reminderTime,
    });
    
    // Reset form
    setFormData({
      title: '',
      category: 'mental',
      targetProgress: 30,
      unit: 'days',
      dailyTarget: 1,
      frequency: 'daily',
      dueDate: addDays(new Date(), 30),
      reminderTime: '09:00',
      color: '#8B5CF6',
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
      case 'frequency':
        return true;
      case 'reminder':
        return true;
      default:
        return false;
    }
  };

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
                  placeholder="e.g., Read 20 Books"
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
                  Target Amount
                </label>
                <input
                  type="number"
                  value={formData.targetProgress}
                  onChange={(e) => setFormData({ ...formData, targetProgress: parseInt(e.target.value) })}
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
                  Daily Target
                </label>
                <input
                  type="number"
                  value={formData.dailyTarget}
                  onChange={(e) => setFormData({ ...formData, dailyTarget: parseInt(e.target.value) })}
                  className="w-full bg-surfaceLight text-textPrimary rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue text-xl font-semibold text-center"
                  min="1"
                />
                <p className="text-xs text-textMutedDark text-center mt-2">
                  {formData.unit} per day
                </p>
              </div>
            </div>
          )}

          {currentStep === 'frequency' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-textPrimary mb-6">
                How often?
              </h3>

              <div className="space-y-3">
                {['daily', 'weekly', 'custom'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFormData({ ...formData, frequency: freq })}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                      formData.frequency === freq
                        ? 'bg-blue text-white'
                        : 'bg-surfaceLight text-textPrimary'
                    }`}
                  >
                    <span className="capitalize">{freq}</span>
                  </button>
                ))}
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
                />
              </div>
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

              <div className="space-y-2">
                <label className="flex items-center gap-3 p-4 rounded-xl bg-surfaceLight cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded accent-blue"
                  />
                  <span className="text-textPrimary">Same time for all days</span>
                </label>
                
                <label className="flex items-center gap-3 p-4 rounded-xl bg-surfaceLight cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded accent-blue"
                  />
                  <span className="text-textPrimary">Enable notifications</span>
                </label>
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

