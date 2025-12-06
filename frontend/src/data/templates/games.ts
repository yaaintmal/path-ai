import type { LearningTemplate } from '../../types/templates';

export const GAMES_TEMPLATES: LearningTemplate[] = [
  {
    id: 'game-dev-phaser',
    name: 'Game Development with Phaser',
    description:
      'Learn how to build 2D browser games using the Phaser framework and game development fundamentals',
    duration: '6 weeks',
    level: 'beginner',
    category: 'Game Development',
    topics: ['Phaser setup', 'Game loop & Scenes', 'Sprites & Animations', 'Physics & Collisions'],
    skills: ['Game Logic', 'Phaser API'],
  },
  {
    id: 'game-dev-pixijs',
    name: '2D Rendering with PixiJS',
    description: 'Build high-performance 2D engines and UI using PixiJS',
    duration: '5 weeks',
    level: 'beginner',
    category: 'Game Development',
    topics: ['PixiJS basics', 'Asset management', 'Interaction & Performance'],
    skills: ['2D rendering', 'Asset optimization'],
  },
  {
    id: 'game-dev-multiplayer',
    name: 'Multiplayer Game Development',
    description: 'Architect multiplayer games using WebSockets/WebRTC',
    duration: '8 weeks',
    level: 'advanced',
    category: 'Game Development',
    topics: ['Realtime networking basics', 'WebSockets vs WebRTC', 'State sync patterns'],
    skills: ['Realtime architecture', 'Networked game design'],
  },
  {
    id: 'game-dev-godot',
    name: 'Godot Engine — Game Development',
    description: 'Create 2D & 3D games using Godot',
    duration: '8 weeks',
    level: 'beginner',
    category: 'Game Development',
    topics: ['Godot engine setup', 'GDScript basics', 'Physics & Tilemaps'],
    skills: ['Game prototyping', 'Scripting'],
  },
];
