import type { LearningTemplate } from '../../types/templates';

export const WEB_TEMPLATES: LearningTemplate[] = [
  // Web fundamentals
  {
    id: 'web-fundamentals',
    name: 'Web Development Fundamentals',
    description: 'Start your web development journey from the ground up',
    duration: '8 weeks',
    level: 'beginner',
    category: 'Web Development',
    topics: [
      'HTML Basics',
      'CSS Fundamentals',
      'CSS Layout',
      'Responsive Design',
      'JavaScript Basics',
      'DOM Manipulation',
      'Events & Event Handling',
      'Async JavaScript',
      'Fetch API',
      'Introduction to React',
      'Components & Props',
      'State & Hooks',
      'Styling Approaches',
      'Deployment Basics',
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'DOM Manipulation', 'Responsive Design', 'React Basics'],
  },

  // MERN fullstack (re-adding)
  {
    id: 'mern-fullstack',
    name: 'MERN Full-Stack Developer',
    description:
      'Complete journey to becoming a full-stack web developer using MongoDB, Express, React, and Node.js',
    duration: '16 weeks',
    level: 'intermediate',
    category: 'Web Development',
    topics: [
      'JavaScript Fundamentals',
      'ES6+ Features',
      'Node.js & Express',
      'RESTful API Design',
      'MongoDB & Mongoose',
      'React Basics & Hooks',
      'State Management (Redux/Context)',
      'Authentication & Authorization',
      'Testing & Deployment',
      'Performance Optimization',
      'Security Best Practices',
    ],
    skills: [
      'Backend Development',
      'Frontend Development',
      'Database Design',
      'API Development',
      'Full-Stack Integration',
    ],
  },

  // React Specialist
  {
    id: 'react-frontend-specialist',
    name: 'React Frontend Specialist',
    description:
      'Master modern React development with hooks, performance optimization, and advanced patterns',
    duration: '10 weeks',
    level: 'intermediate',
    category: 'Web Development',
    topics: [
      'React Fundamentals & JSX',
      'Hooks (useState, useEffect, useContext)',
      'Advanced Hooks (useReducer, useMemo, useCallback)',
      'Component Composition & Patterns',
      'State Management (Redux Toolkit, Zustand)',
      'React Router & Navigation',
      'Forms & Validation (React Hook Form)',
      'Testing (Jest, React Testing Library)',
      'Performance Optimization (React.memo, lazy loading)',
      'Accessibility (a11y) & ARIA',
      'TypeScript with React',
      'Build Tools (Vite, Webpack)',
      'Deployment & CI/CD',
    ],
    skills: [
      'Modern React Development',
      'Component Architecture',
      'State Management',
      'Performance Optimization',
    ],
  },

  // Advanced React
  {
    id: 'react-advanced',
    name: 'Advanced React Developer',
    description: 'Master advanced React patterns and build production-ready applications',
    duration: '10 weeks',
    level: 'advanced',
    category: 'Web Development',
    topics: [
      'React hooks deep dive',
      'Context & advanced state patterns',
      'Custom hooks',
      'Performance optimization & code splitting',
      'Server-side rendering fundamentals (Next.js)',
      'Testing React Applications',
      'TypeScript for React',
    ],
    skills: ['Advanced React patterns', 'Performance tuning', 'Testing', 'TypeScript'],
  },

  // Vue
  {
    id: 'vue-frontend-developer',
    name: 'Vue.js Frontend Developer',
    description:
      'Build interactive web applications with Vue.js ecosystem including Vue 3, Composition API, and Nuxt',
    duration: '8 weeks',
    level: 'intermediate',
    category: 'Web Development',
    topics: [
      'Vue.js Fundamentals',
      'Vue 3 Composition API',
      'Reactivity System & Ref',
      'Component Communication',
      'Vue Router',
      'Pinia State Management',
      'Nuxt.js Framework & SSR',
      'Testing Vue Applications',
      'TypeScript with Vue',
      'Deployment Strategies',
    ],
    skills: ['Vue.js Development', 'Composition API', 'SSR with Nuxt'],
  },

  // Angular
  {
    id: 'angular-enterprise-developer',
    name: 'Angular Enterprise Developer',
    description:
      'Master Angular for large-scale applications with RxJS, NgRx, and enterprise patterns',
    duration: '12 weeks',
    level: 'advanced',
    category: 'Web Development',
    topics: [
      'Angular Fundamentals & Architecture',
      'Components, Directives & Pipes',
      'Services & Dependency Injection',
      'RxJS & Reactive Programming',
      'NgRx State Management',
      'Angular Router & Guards',
      'Forms (Template-driven & Reactive)',
      'HTTP Client & Interceptors',
      'Testing (Jasmine, Karma)',
      'Performance & Change Detection',
    ],
    skills: [
      'Enterprise Angular Development',
      'Reactive Programming',
      'State Management',
      'Testing Strategies',
    ],
  },

  // PWA
  {
    id: 'mobile-web-development',
    name: 'Progressive Web Apps (PWAs)',
    description:
      'Build installable web applications with offline capabilities, push notifications, and native app features',
    duration: '8 weeks',
    level: 'intermediate',
    category: 'Web Development',
    topics: [
      'PWA Fundamentals & Service Workers',
      'Web App Manifest',
      'Offline-First Architecture',
      'Caching Strategies',
      'Push Notifications',
      'App Shell Architecture',
      'Installability & Add to Home Screen',
      'Performance & Lighthouse Audits',
    ],
    skills: ['PWA Development', 'Service Workers', 'Offline Capabilities'],
  },

  // Web Performance
  {
    id: 'web-performance-optimization',
    name: 'Web Performance & Optimization',
    description:
      'Master web performance techniques, Core Web Vitals, and optimization strategies for fast web applications',
    duration: '6 weeks',
    level: 'intermediate',
    category: 'Web Development',
    topics: [
      'Core Web Vitals (LCP, FID, CLS)',
      'Critical rendering path',
      'Image optimization & next-gen formats',
      'Caching strategies & service workers',
      'Bundle analysis & code splitting',
      'CDN & edge optimization',
    ],
    skills: ['Performance analysis', 'Optimization techniques', 'Monitoring & RUM'],
  },

  // GraphQL
  {
    id: 'api-development-graphql',
    name: 'API Development with GraphQL',
    description: 'Build modern APIs with GraphQL, Apollo Server, and client integration patterns',
    duration: '8 weeks',
    level: 'intermediate',
    category: 'Web Development',
    topics: [
      'GraphQL Fundamentals',
      'Schema Design & TypeDefs',
      'Resolvers & Data Fetching',
      'Apollo Server Setup',
      'Queries, Mutations & Subscriptions',
      'Client Integration (Apollo Client)',
      'Schema Stitching & Federation',
    ],
    skills: ['GraphQL API Design', 'Schema Architecture', 'Client Integration'],
  },

  // Ruby on Rails
  {
    id: 'ruby-on-rails-fullstack',
    name: 'Ruby on Rails Full-Stack Developer',
    description:
      'Build full-stack web applications with Ruby on Rails, including MVC architecture and modern practices',
    duration: '14 weeks',
    level: 'intermediate',
    category: 'Web Development',
    topics: [
      'Ruby Fundamentals',
      'Rails MVC Architecture',
      'Active Record & Database Design',
      'Authentication (Devise)',
      'Testing (RSpec, Capybara)',
      'Deployment & Heroku',
    ],
    skills: ['Rails Development', 'MVC Architecture', 'ORM Design', 'Testing & Deployment'],
  },
];
