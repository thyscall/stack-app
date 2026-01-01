# Stack Web

A beautiful web-based wellness tracking application built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Wellness Trends** - Visualize your mood, focus, and energy levels over time
- **Recent Activity** - Track your workouts with detailed metrics
- **Active Goals** - Monitor progress on mental and physical goals
- **Today's Progress** - Daily overview of your wellness journey
- **AI Insights** - Personalized recommendations based on your data
- **Your Stack** - Maintain your wellness streak with visual feedback

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the Stack-Web directory:
```bash
cd Stack-Web
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
Stack-Web/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── page.tsx      # Home page
│   │   ├── mental/       # Mental wellness page
│   │   ├── physical/     # Physical wellness page
│   │   ├── journal/      # Journal page
│   │   └── profile/      # Profile page
│   ├── components/       # React components
│   │   ├── home/         # Home page sections
│   │   ├── Card.tsx      # Reusable card component
│   │   └── TabNavigation.tsx  # Bottom tab bar
│   ├── store/            # Zustand state management
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Design

The app features a dark theme with:
- Black background (#000000)
- Surface cards with subtle elevation
- Color-coded categories (Mental: Purple, Physical: Green)
- Smooth animations and transitions
- Mobile-first responsive design

## License

MIT
