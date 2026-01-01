import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TabNavigation } from '@/components/TabNavigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stack - Wellness Tracking',
  description: 'Track your wellness journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-bg pb-24">
          {children}
        </main>
        <TabNavigation />
      </body>
    </html>
  );
}

