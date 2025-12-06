import type { LearningTemplate } from '../../types/templates';

export const GRAPHICS_TEMPLATES: LearningTemplate[] = [
  {
    id: 'graphics-threejs',
    name: '3D Graphics with Three.js',
    description: 'Explore 3D graphics, rendering and interaction with the Three.js library',
    duration: '8 weeks',
    level: 'intermediate',
    category: 'Graphics & Animation',
    topics: [
      'Scene, Camera & Renderer basics',
      'Geometry & Materials',
      'Lighting & Shadows',
      '3D Models & Importing',
    ],
    skills: ['3D Rendering', 'Shaders & GLSL'],
  },
  {
    id: 'animation-gsap',
    name: 'Animation with GSAP',
    description: 'Master powerful animations for UI and 3D using GSAP',
    duration: '4 weeks',
    level: 'beginner',
    category: 'Graphics & Animation',
    topics: [
      'GSAP core concepts',
      'Timelines & sequencing',
      'SVG animations',
      'Scroll-driven animations',
    ],
    skills: ['Motion Design', 'GSAP'],
  },
];
