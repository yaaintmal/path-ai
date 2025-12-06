import type { LearningTemplate } from '../../types/templates';
import { WEB_TEMPLATES } from './web';
import { CLOUD_TEMPLATES } from './cloud';
import { DEVOPS_TEMPLATES } from './devops';
import { SECURITY_TEMPLATES } from './security';
import { FRAMEWORK_TEMPLATES } from './frameworks';
import { DATABASE_TEMPLATES } from './databases';
import { GAMES_TEMPLATES } from './games';
import { GRAPHICS_TEMPLATES } from './graphics';
import { PROFESSIONAL_TEMPLATES } from './professional';
import { BACKEND_TEMPLATES } from './backend';
import { LANGUAGE_TEMPLATES } from './languages';

export const LEARNING_TEMPLATES: LearningTemplate[] = [
  ...WEB_TEMPLATES,
  ...BACKEND_TEMPLATES,
  ...FRAMEWORK_TEMPLATES,
  ...DATABASE_TEMPLATES,
  ...CLOUD_TEMPLATES,
  ...DEVOPS_TEMPLATES,
  ...SECURITY_TEMPLATES,
  ...GAMES_TEMPLATES,
  ...GRAPHICS_TEMPLATES,
  ...PROFESSIONAL_TEMPLATES,
  ...LANGUAGE_TEMPLATES,
];

export const TEMPLATE_CATEGORIES: string[] = Array.from(
  new Set(LEARNING_TEMPLATES.map((t) => t.category))
).sort();

export default LEARNING_TEMPLATES;
