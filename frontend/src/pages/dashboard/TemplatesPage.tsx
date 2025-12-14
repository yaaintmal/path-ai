import { ChevronLeft, BookMarked, Award, Clock, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { LEARNING_TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/learningTemplates';
import type { LearningTemplate } from '../../types/templates';

interface TemplatesPageProps {
  onBack: () => void;
  onSelectTemplate: (template: LearningTemplate) => void;
}

export function TemplatesPageClean({ onBack, onSelectTemplate }: TemplatesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  const filteredTemplates =
    selectedCategory === 'All'
      ? LEARNING_TEMPLATES
      : LEARNING_TEMPLATES.filter((t) => t.category === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'advanced':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default:
        return 'bg-card-foreground/5 dark:bg-card-foreground/30 text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded hover:bg-card-foreground/5 transition-colors"
          title="Back to learning"
          aria-label="Back to learning"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Learning Templates</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a structured learning path to get started
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-purple-500 text-white dark:bg-purple-600'
              : 'bg-card-foreground/5 text-foreground dark:bg-card-foreground/30'
          }`}
        >
          All
        </button>
        {TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-purple-500 text-white dark:bg-purple-600'
                : 'bg-card-foreground/5 text-foreground dark:bg-card-foreground/30'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow"
          >
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-foreground mb-2">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(template.level)}`}
                >
                  <Award className="w-3 h-3" />
                  {template.level.charAt(0).toUpperCase() + template.level.slice(1)}
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                  <Clock className="w-3 h-3" />
                  {template.duration}
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                setExpandedTemplate(expandedTemplate === template.id ? null : template.id)
              }
              className="w-full text-left mb-3 p-3 bg-card-foreground/5 dark:bg-card-foreground/30 rounded-lg hover:bg-card-foreground/10 dark:hover:bg-card-foreground/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {template.topics.length} topics, {template.skills.length} skills
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {expandedTemplate === template.id ? '▼' : '▶'}
                </span>
              </div>
            </button>

            {expandedTemplate === template.id && (
              <div className="mb-3 max-h-60 overflow-y-auto">
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-foreground mb-2">Topics:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-2">Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => onSelectTemplate(template)}
              className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Start Learning
            </button>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <BookMarked className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No templates found in this category.</p>
        </div>
      )}
    </div>
  );
}

export const TemplatesPage = TemplatesPageClean;
export default TemplatesPageClean;
