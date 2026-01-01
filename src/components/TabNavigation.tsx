'use client';

import { Layers, Brain, Activity, Target, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Stack', icon: Layers, href: '/' },
  { name: 'Goals', icon: Target, href: '/goals' },
  { name: 'Physical', icon: Activity, href: '/physical' },
  { name: 'Mental', icon: Brain, href: '/mental' },
  { name: 'Profile', icon: User, href: '/profile' },
];

export function TabNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surfaceLight">
      <div className="max-w-lg mx-auto flex items-center justify-around h-20">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex flex-col items-center justify-center flex-1 h-full group"
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-colors ${
                  isActive ? 'text-green' : 'text-textMuted group-hover:text-textPrimary'
                }`}
              />
              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-green' : 'text-textMuted group-hover:text-textPrimary'
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

