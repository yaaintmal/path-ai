import type { LearningTemplate } from '../../types/templates';

export const FRAMEWORK_TEMPLATES: LearningTemplate[] = [
  {
    id: 'frameworks-nextjs',
    name: 'Next.js — Modern React Framework',
    description:
      'Build production-ready, fast React apps with Next.js, including SSR, SSG and App Router patterns',
    duration: '6 weeks',
    level: 'intermediate',
    category: 'Frameworks',
    topics: ['Next.js basics', 'SSR/SSG/ISR', 'Data fetching', 'Image optimization'],
    skills: ['Server Rendering', 'Routing & Data Fetching', 'Performance'],
  },
  {
    id: 'frameworks-nestjs',
    name: 'NestJS — Scalable Backend Framework',
    description: 'Design scalable backends using NestJS with DI, modules and enterprise patterns',
    duration: '8 weeks',
    level: 'intermediate',
    category: 'Frameworks',
    topics: ['DI', 'Controllers', 'Microservices', 'GraphQL with Nest'],
    skills: ['Scalable Backend Design', 'DI Patterns'],
  },
  {
    id: 'fastify-backend',
    name: 'Fastify Backend Mastery',
    description: 'Build high-performance backends with the Fastify framework',
    duration: '6 weeks',
    level: 'intermediate',
    category: 'Frameworks',
    topics: ['Fastify basics', 'Plugins & Hooks', 'TypeScript integration', 'Performance tuning'],
    skills: ['High-performance Node.js', 'Plugin-based architecture'],
  },
];
