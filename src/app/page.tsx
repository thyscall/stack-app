'use client';

import { useState, useEffect } from 'react';
import { DailyRating } from '@/components/home/DailyRating';
import { WellnessTrends } from '@/components/home/WellnessTrends';
import { RecentActivity } from '@/components/home/RecentActivity';
import { ActiveGoals } from '@/components/home/ActiveGoals';
import { AIInsights } from '@/components/home/AIInsights';
import { YourStack } from '@/components/home/YourStack';
import { QuickActions } from '@/components/QuickActions';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="max-w-lg mx-auto px-10 pt-8">
          <h1 className="text-md font-semibold text-textPrimary tracking-wide text-center">
            Stack
          </h1>
        </div>
      </header>

          <div className="max-w-lg mx-auto px-5 pt-16 pb-8 space-y-6">
            <YourStack />
            <DailyRating />
            <ActiveGoals />
            <WellnessTrends />
            <AIInsights />
            <RecentActivity />
          </div>

      <QuickActions />
    </div>
  );
}

