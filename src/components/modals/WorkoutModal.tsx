'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { useWorkoutStore } from '@/store';
import { Activity, Dumbbell, Footprints, Zap, Heart } from 'lucide-react';

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date; // Optional: for retroactive logging
}

const workoutTypes = [
  { id: 'Running', label: 'Running', icon: Footprints, color: '#60A5FA' },
  { id: 'Walking', label: 'Walking', icon: Footprints, color: '#10B981' },
  { id: 'Cycling', label: 'Cycling', icon: Activity, color: '#F59E0B' },
  { id: 'HIIT', label: 'HIIT', icon: Zap, color: '#EF4444' },
  { id: 'Strength', label: 'Weights', icon: Dumbbell, color: '#8B5CF6' },
  { id: 'Yoga', label: 'Stretching', icon: Heart, color: '#EC4899' },
  { id: 'Other', label: 'Other', icon: Activity, color: '#6B7280' },
];

export function WorkoutModal({ isOpen, onClose, selectedDate }: WorkoutModalProps) {
  const { addWorkout } = useWorkoutStore();
  
  const [selectedType, setSelectedType] = useState('Running');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [avgHeartRate, setAvgHeartRate] = useState('');
  
  // Running/Walking/Cycling specific
  const [distance, setDistance] = useState('');
  const [pace, setPace] = useState('');
  const [steps, setSteps] = useState('');
  
  // Strength specific
  const [exercises, setExercises] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  
  // General notes
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !duration) {
      alert('Please fill in at least title and duration');
      return;
    }

    const workoutData: any = {
      type: selectedType,
      title,
      duration: parseInt(duration),
      calories: parseInt(calories) || 0,
      avgHeartRate: parseInt(avgHeartRate) || 0,
    };

    // Add type-specific data
    if (['Running', 'Walking', 'Cycling'].includes(selectedType)) {
      if (distance) workoutData.distance = parseFloat(distance);
      if (pace) workoutData.pace = pace;
      if (steps) workoutData.steps = parseInt(steps);
    }

    if (selectedType === 'Strength') {
      if (exercises) workoutData.exercises = exercises;
      if (weight) workoutData.weight = parseFloat(weight);
      if (reps) workoutData.reps = parseInt(reps);
      if (sets) workoutData.sets = parseInt(sets);
    }

    if (notes) workoutData.notes = notes;

    // Pass the selected date (for retroactive logging) or current date
    addWorkout(workoutData, selectedDate);
    handleClose();
  };

  const handleClose = () => {
    setSelectedType('Running');
    setTitle('');
    setDuration('');
    setCalories('');
    setAvgHeartRate('');
    setDistance('');
    setPace('');
    setSteps('');
    setExercises('');
    setWeight('');
    setReps('');
    setSets('');
    setNotes('');
    onClose();
  };

  const showCardioFields = ['Running', 'Walking', 'Cycling'].includes(selectedType);
  const showStrengthFields = selectedType === 'Strength';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Log Workout">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activity Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-textPrimary">Activity Type</label>
          <div className="grid grid-cols-3 gap-2">
            {workoutTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    selectedType === type.id
                      ? 'bg-green/20 border-2 border-green'
                      : 'bg-surfaceLight border-2 border-transparent hover:border-surfaceLight'
                  }`}
                >
                  <Icon className="w-5 h-5" style={{ color: type.color }} />
                  <span className="text-xs font-medium text-textPrimary">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-textPrimary">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning run"
            className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
            required
          />
        </div>

        {/* Duration & Calories */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-textPrimary">Duration (min) *</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-textPrimary">Calories</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="250"
              className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
            />
          </div>
        </div>

        {/* Cardio-specific fields */}
        {showCardioFields && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-textPrimary">Distance (miles)</label>
                <input
                  type="number"
                  step="0.1"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="3.1"
                  className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-textPrimary">Pace (min/mile)</label>
                <input
                  type="text"
                  value={pace}
                  onChange={(e) => setPace(e.target.value)}
                  placeholder="8:30"
                  className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-textPrimary">Steps</label>
              <input
                type="number"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="7500"
                className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
              />
            </div>
          </>
        )}

        {/* Strength-specific fields */}
        {showStrengthFields && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-textPrimary">Exercises</label>
              <input
                type="text"
                value={exercises}
                onChange={(e) => setExercises(e.target.value)}
                placeholder="e.g., Bench press, Squats"
                className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-textPrimary">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="50"
                  className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-textPrimary">Reps</label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="10"
                  className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-textPrimary">Sets</label>
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="3"
                  className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
                />
              </div>
            </div>
          </>
        )}

        {/* Heart Rate */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-textPrimary">Avg Heart Rate (bpm)</label>
          <input
            type="number"
            value={avgHeartRate}
            onChange={(e) => setAvgHeartRate(e.target.value)}
            placeholder="145"
            className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-textPrimary">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you feel? Any thoughts..."
            rows={3}
            className="w-full bg-surfaceLight border-2 border-transparent focus:border-green rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green text-white rounded-xl px-6 py-4 font-semibold hover:bg-green/90 transition-colors"
        >
          Log Workout
        </button>
      </form>
    </Modal>
  );
}
