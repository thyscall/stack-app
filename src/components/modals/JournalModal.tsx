'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { useJournalStore } from '@/store';
import { BookOpen, Brain, Wind, Sparkles } from 'lucide-react';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date; // Optional: for retroactive logging
}

const mentalActivityTypes = [
  { id: 'journal', label: 'Journal', icon: BookOpen, color: '#8B5CF6' },
  { id: 'meditation', label: 'Meditation', icon: Brain, color: '#EC4899' },
  { id: 'breathing', label: 'Breathing', icon: Wind, color: '#06B6D4' },
  { id: 'yoga', label: 'Yoga', icon: Sparkles, color: '#10B981' },
];

export function JournalModal({ isOpen, onClose, selectedDate }: JournalModalProps) {
  const { addEntry } = useJournalStore();
  
  const [selectedType, setSelectedType] = useState('journal');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('5');
  const [duration, setDuration] = useState('');
  const [tags, setTags] = useState('');
  const [thoughts, setThoughts] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      alert('Please fill in at least title and content');
      return;
    }

    const tagArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const entryData: any = {
      title,
      content,
      mood: parseInt(mood),
      tags: tagArray,
      type: selectedType,
    };

    if (duration) entryData.duration = parseInt(duration);
    if (thoughts) entryData.thoughts = thoughts;

    // Pass the selected date (for retroactive logging) or current date
    addEntry(title, content, parseInt(mood), tagArray, selectedType, parseInt(duration) || 0, thoughts, selectedDate);
    handleClose();
  };

  const handleClose = () => {
    setSelectedType('journal');
    setTitle('');
    setContent('');
    setMood('7');
    setDuration('');
    setTags('');
    setThoughts('');
    onClose();
  };

  const showDuration = ['meditation', 'breathing', 'yoga'].includes(selectedType);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Mental Activity">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Activity Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-textPrimary">Activity Type</label>
          <div className="grid grid-cols-2 gap-2">
            {mentalActivityTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    selectedType === type.id
                      ? 'bg-purple/20 border-2 border-purple'
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
            placeholder={
              selectedType === 'journal' 
                ? 'e.g., Today\'s Reflection' 
                : `e.g., ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Session`
            }
            className="w-full bg-surfaceLight border-2 border-transparent focus:border-purple rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
            required
          />
        </div>

        {/* Duration (for meditation, breathing, yoga) */}
        {showDuration && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-textPrimary">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="10"
              className="w-full bg-surfaceLight border-2 border-transparent focus:border-purple rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-textPrimary">
            {selectedType === 'journal' ? 'Entry *' : 'Description *'}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              selectedType === 'journal'
                ? 'Write about your day, thoughts, feelings...'
                : 'Describe your experience...'
            }
            rows={6}
            className="w-full bg-surfaceLight border-2 border-transparent focus:border-purple rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors resize-none"
            required
          />
        </div>

        {/* Mood */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-textPrimary">
            Mood (1-10)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="flex-1 h-2 bg-surfaceLight rounded-lg appearance-none cursor-pointer accent-purple"
            />
            <div className="w-12 h-12 rounded-full bg-purple/20 flex items-center justify-center">
              <span className="text-xl font-bold text-purple">{mood}</span>
            </div>
          </div>
        </div>

        {/* Thoughts during activity */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-textPrimary">
            Thoughts During Activity
          </label>
          <textarea
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            placeholder="Any insights, feelings, or observations..."
            rows={3}
            className="w-full bg-surfaceLight border-2 border-transparent focus:border-purple rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors resize-none"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-textPrimary">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="gratitude, mindfulness, peace"
            className="w-full bg-surfaceLight border-2 border-transparent focus:border-purple rounded-xl px-4 py-3 text-textPrimary placeholder-textMuted outline-none transition-colors"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple text-white rounded-xl px-6 py-4 font-semibold hover:bg-purple/90 transition-colors"
        >
          Save Activity
        </button>
      </form>
    </Modal>
  );
}
