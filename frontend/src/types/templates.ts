export interface LearningTemplate {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g., "16 weeks", "8 weeks"
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  skills: string[];
  category: string; // e.g., "Web Development", "Mobile", "Backend"
}

export interface TemplateContext {
  selectedTemplate: LearningTemplate | null;
  setSelectedTemplate: (template: LearningTemplate | null) => void;
}
