import { ChevronLeft, CheckCircle2, Circle, Sparkles, Target } from 'lucide-react';
import { useLearning } from '../../contexts/useLearning';
import type { LearningTemplate } from '../../types/templates';
import { useState } from 'react';

interface TemplateDetailsPageProps {
  template: LearningTemplate;
  onBack: () => void;
  onUseTemplate?: () => void;
}

export function TemplateDetailsPage({ template, onBack, onUseTemplate }: TemplateDetailsPageProps) {
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const { setCurrentGoal, triggerSubtopicGeneration, setCurrentLearningPath } = useLearning();

  const toggleTopicCompletion = (topic: string) => {
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(topic)) {
      newCompleted.delete(topic);
    } else {
      newCompleted.add(topic);
    }
    setCompletedTopics(newCompleted);
  };

  const progressPercentage = Math.round((completedTopics.size / template.topics.length) * 100);

  return (
  <div className="min-h-screen bg-gradient-to-b from-background to-card-foreground/5 dark:from-card/80 dark:to-card/60 rounded-lg shadow-md p-6 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded hover:bg-card-foreground/5 dark:hover:bg-card-foreground/30 transition-colors"
          title="Back to templates"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 ml-4">
          <h2 className="text-2xl font-semibold text-foreground">{template.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
        </div>
      </div>

      {/* Meta Info */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm">
          <span className="capitalize">{template.level}</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium text-sm">
          <span>{template.duration}</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium text-sm">
          <span>{template.category}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">
            Learning Progress
          </h3>
          <span className="text-sm font-medium text-muted-foreground">
            {completedTopics.size} of {template.topics.length} topics
          </span>
        </div>
        <div className="w-full bg-card-foreground/5 dark:bg-card-foreground/30 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {progressPercentage}% complete
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics Section */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
              Topics to Learn
            </h3>
            <div className="space-y-2">
              {template.topics.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleTopicCompletion(topic)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {completedTopics.has(topic) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <Circle className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                    )}
                  </div>
                  <span
                    className={`flex-1 ${
                      completedTopics.has(topic)
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    }`}
                  >
                    {topic}
                  </span>
                  {/* Action buttons next to each topic: set as goal, create subtopics */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentGoal?.({ title: topic, pathId: template.id, pathTopic: topic });
                      }}
                      title="Set as goal"
                      className="p-1 rounded hover:bg-card-foreground/5 dark:hover:bg-card-foreground/30 text-muted-foreground hover:text-purple-600 transition-colors"
                    >
                      <Target className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // set the current goal/path then open learning page and trigger generation
                        setCurrentGoal?.({ title: topic, pathId: template.id, pathTopic: topic });
                        setCurrentLearningPath?.({ title: topic, type: 'topic' });
                        triggerSubtopicGeneration?.({ title: topic, type: 'topic' });
                        onUseTemplate?.();
                      }}
                      title="Create subtopics"
                        className="p-1 rounded hover:bg-card-foreground/5 dark:hover:bg-card-foreground/30 text-muted-foreground hover:text-blue-500 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <div className="bg-card rounded-lg border border-border p-6 sticky top-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
              Skills to Acquire
            </h3>
            <div className="space-y-2">
              {template.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm text-foreground">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => onUseTemplate && onUseTemplate()}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          Use template and open learning
        </button>
        <button
          onClick={() => onBack()}
          className="px-4 py-2 bg-card-foreground/5 hover:bg-card-foreground/10 dark:bg-card/80 dark:hover:bg-card/60 text-foreground rounded-lg transition-colors"
        >
          Back to templates
        </button>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>Click on topics to mark them as completed and track your progress</li>
          <li>Follow the recommended order to build a strong foundation</li>
          <li>Take your time with each topic - mastery is more important than speed</li>
          <li>Practice projects alongside the topics for better retention</li>
        </ul>
      </div>
    </div>
  );
}
