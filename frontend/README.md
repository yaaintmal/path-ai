# Team Project Frontend

A modern React frontend application built with TypeScript, Vite, and Tailwind CSS. This AI-powered learning platform features an interactive onboarding wizard, personalized dashboards, and comprehensive learning tools for students, teachers, and educational institutions.

This is the frontend component of a monorepo that includes both client and server applications.

## Tech Stack

- **React 19** - Latest React with modern hooks and features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components (shadcn/ui)
- **Lucide React** - Beautiful icons

## Features

- **Interactive Onboarding Wizard**: 7-step personalized setup process with localStorage persistence
- **Landing Page Sections**: Hero, Features, How It Works, Dashboard Preview
- **Language Features**: Advanced language processing with automatic translation
- **Prompt Templates**: Reusable AI prompt templates for various use cases
- **Gamification**: Interactive user engagement with points, achievements, and rewards
- **Target Audiences**: Specialized interfaces for students, teachers, and institutions
- **Responsive Design**: Mobile-first approach with dark mode support
- **Personalized Dashboards**: Customizable learning environments based on user preferences

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory:

   ```bash
   cd team-project/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── global/          # Global components (Header, Footer)
│   ├── landing/         # Landing page sections and OnboardingWizard
│   └── ui/              # Reusable UI components (shadcn/ui)
├── pages/               # Page components
├── assets/              # Static assets
├── App.tsx              # Main app component with routing logic
└── main.tsx             # App entry point
```

## Onboarding Process

The application features a comprehensive 7-step onboarding wizard that collects user preferences including:

- Role selection (Student, Teacher, Pupil)
- Learning goals and subjects
- Skill level assessment
- Preferred learning types
- Time management preferences
- Gamification settings
- Communication style preferences

All onboarding data is stored in localStorage under the key `onboarddata` for persistence across sessions.

## Development

This project uses:

- **ESLint** for code linting
- **TypeScript** for type checking
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility
- **localStorage** for client-side data persistence

## Contributing

1. Follow the existing code style and conventions
2. Use TypeScript for all new components
3. Ensure components are accessible and responsive
4. Test the onboarding flow and localStorage persistence
5. Maintain data consistency in the OnboardingWizard component
6. Verify dark mode compatibility for all new features
