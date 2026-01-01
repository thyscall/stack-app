'use client';

import { useState } from 'react';
import { Plus, Activity, Brain } from 'lucide-react';
import { WorkoutModal } from '@/components/modals/WorkoutModal';
import { MoodModal } from '@/components/modals/MoodModal';

export function QuickActions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);

  const handleWorkoutClick = () => {
    setIsMenuOpen(false);
    setIsWorkoutModalOpen(true);
  };

  const handleMoodClick = () => {
    setIsMenuOpen(false);
    setIsMoodModalOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-24 right-5 z-40">
        {isMenuOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 mb-2">
            <button
              onClick={handleWorkoutClick}
              className="flex items-center gap-3 bg-green text-white rounded-full px-5 py-3 shadow-lg hover:bg-green/90 transition-all transform hover:scale-105"
            >
              <Activity className="w-5 h-5" />
              <span className="font-semibold whitespace-nowrap">Log Workout</span>
            </button>
            
            <button
              onClick={handleMoodClick}
              className="flex items-center gap-3 bg-purple text-white rounded-full px-5 py-3 shadow-lg hover:bg-purple/90 transition-all transform hover:scale-105"
            >
              <Brain className="w-5 h-5" />
              <span className="font-semibold whitespace-nowrap">Daily Check-in</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-14 h-14 rounded-full bg-blue text-white shadow-lg hover:bg-blue/90 transition-all transform ${
            isMenuOpen ? 'rotate-45' : ''
          }`}
        >
          <Plus className="w-6 h-6 mx-auto" />
        </button>
      </div>

      <WorkoutModal
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
      />
      
      <MoodModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
      />
    </>
  );
}

