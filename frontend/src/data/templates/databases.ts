import type { LearningTemplate } from '../../types/templates';

export const DATABASE_TEMPLATES: LearningTemplate[] = [
  {
    id: 'database-design',
    name: 'Database Design & SQL',
    description: 'Learn database design principles and SQL for efficient data management',
    duration: '10 weeks',
    level: 'intermediate',
    category: 'Databases',
    topics: ['Relational theory', 'SQL basics', 'Indexing', 'Normalization', 'Transactions'],
    skills: ['SQL', 'Database design', 'Query optimization'],
  },
  {
    id: 'mongodb-deep-dive',
    name: 'MongoDB Deep Dive',
    description: 'Comprehensive guide to MongoDB internals, scaling, and practical usage patterns',
    duration: '10 weeks',
    level: 'intermediate',
    category: 'Databases',
    topics: ['Schema design', 'Aggregation', 'Replication & Sharding', 'Atlas & Hosting'],
    skills: ['MongoDB performance', 'Replication & Sharding', 'Aggregation pipelines'],
  },
  {
    id: 'sqlite3-practical',
    name: 'SQLite3 Practical Projects',
    description: 'Learn SQLite3 for local storage, small apps, and embedded use-cases',
    duration: '4 weeks',
    level: 'beginner',
    category: 'Databases',
    topics: ['SQLite basics', 'WAL mode & performance', 'Migrations & tools'],
    skills: ['Embedded DB usage', 'Local persistence'],
  },
  {
    id: 'databases-advanced',
    name: 'Databases Advanced: Scaling & Performance',
    description: 'Advanced practices for scaling databases and performance tuning',
    duration: '10 weeks',
    level: 'intermediate',
    category: 'Databases',
    topics: ['Partitioning & Sharding', 'Performance tuning', 'Caching patterns'],
    skills: ['Scaling & replication', 'Performance tuning'],
  },
];
