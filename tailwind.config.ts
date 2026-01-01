import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#1F1F1F',
        surfaceLight: '#262626',
        textPrimary: '#FFFFFF',
        textMuted: 'rgba(255, 255, 255, 0.7)',
        textMutedDark: 'rgba(255, 255, 255, 0.5)',
        peach: '#F6C9AE',
        sand: '#F5E3A3',
        mint: '#BFF4E0',
        lime: '#DFF98B',
        purple: '#8B5CF6',
        blue: '#3B82F6',
        orange: '#F59E0B',
        green: '#10B981',
        chartPurple: '#A78BFA',
        chartBlue: '#60A5FA',
        chartOrange: '#FB923C',
      },
      borderRadius: {
        card: '24px',
      },
    },
  },
  plugins: [],
}
export default config

