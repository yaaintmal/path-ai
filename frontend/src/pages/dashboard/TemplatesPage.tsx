import { ChevronLeft, BookMarked, Award, Clock, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { LEARNING_TEMPLATES, TEMPLATE_CATEGORIES } from '../../data/learningTemplates';
import type { LearningTemplate } from '../../types/templates';

interface TemplatesPageProps {
  onBack: () => void;
  onSelectTemplate: (template: LearningTemplate) => void;
}

export function TemplatesPage({ onBack, onSelectTemplate }: TemplatesPageProps) {
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
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Back to learning"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Learning Templates
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Choose a structured learning path to get started
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedCategory === 'All'
              ? 'bg-purple-500 text-white dark:bg-purple-600'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
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
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            {/* Template Header */}
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {template.description}
              </p>

              {/* Meta Info */}
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

            {/* Topics & Skills Preview */}
            <button
              onClick={() =>
                setExpandedTemplate(expandedTemplate === template.id ? null : template.id)
              }
              className="w-full text-left mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {template.topics.length} topics, {template.skills.length} skills
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {expandedTemplate === template.id ? '▼' : '▶'}
                </span>
              </div>
            </button>

            {/* Expanded Content */}
            {expandedTemplate === template.id && (
              <div className="mb-3 max-h-60 overflow-y-auto">
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Topics:
                  </h4>
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
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Skills:
                  </h4>
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

            {/* Select Button */}
            <button
              onClick={() => onSelectTemplate(template)}
              className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Start Learning
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <BookMarked className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No templates found in this category.</p>
        </div>
      )}
    </div>
  );
}
