interface DashboardProps {
  setShowOnboardingEditor: (show: boolean) => void;
  mode: 'learning' | 'statistics' | 'store';
}

import { useState } from 'react';
// import { DashboardHeader } from './dashboard/DashboardHeader';
import { LearningSection } from './dashboard/LearningSection';
import { OpenTopicsPage } from './dashboard/OpenTopicsPage';
import { CompletedTopicsPage } from './dashboard/CompletedTopicsPage';
import { TemplatesPage } from './dashboard/TemplatesPage.clean';
import { TemplateDetailsPage } from './dashboard/TemplateDetailsPage';
import { useLearning } from '../contexts/useLearning';
import { StatisticsOverview } from './dashboard/StatisticsOverview';
import { StorePage } from './StorePage';
import type { LearningTemplate } from '../types/templates';
import type { LearningPath, LearningPathItem } from '../types/learning';

//* refactored out widgets below
// import { CommonWidgetsRow } from './dashboard/CommonWidgetsRow';
// import { FullWidthWidget } from './dashboard/FullWidthWidget';
// import { StreakWidget } from './dashboard/StreakWidget';

export function Dashboard({ mode: initialMode }: DashboardProps) {
  const [mode, setMode] = useState<
    | 'learning'
    | 'statistics'
    | 'store'
    | 'open-topics'
    | 'completed-topics'
    | 'templates'
    | 'template-details'
  >(initialMode ?? 'learning');
  const [selectedTemplate, setSelectedTemplate] = useState<LearningTemplate | null>(null);
  const { setCurrentLearningPath, setCurrentPath, triggerSubtopicGeneration } = useLearning();

  // const handleEditDashboard = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   setShowOnboardingEditor(true);
  //   window.scrollTo(0, 0);
  // };

  const handleStatisticsClick = () => {
    setMode('statistics');
  };

  // video-statistics mode removed - nothing to do here

  const handleBackToLearning = () => {
    setMode('learning');
  };

  // back-to-video-translation removed

  const handleStoreClick = () => {
    setMode('store');
  };

  const handleOpenTopicsClick = () => {
    setMode('open-topics');
  };

  const handleCompletedTopicsClick = () => {
    setMode('completed-topics');
  };

  const handleTemplatesClick = () => {
    setMode('templates');
  };

  const makeLearningPathFromTemplate = (template: LearningTemplate): LearningPath => {
    const items: LearningPathItem[] = (template.topics || []).map((t) => ({
      title: t,
      titleNormalized: t.toLowerCase().replace(/\s+/g, '-'),
      type: 'starting_point' as const,
      addedAt: new Date().toISOString(),
      timesStarted: 0,
      totalCompletions: 0,
      lastActivityAt: new Date().toISOString(),
    }));

    return {
      id: `template-${template.id}-${Date.now()}`,
      baseTopic: template.name,
      items,
      stats: {
        totalItems: items.length,
        completedItems: 0,
        inProgressItems: 0,
        totalStartEvents: 0,
        totalCompletionEvents: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as LearningPath;
  };

  const handleSelectTemplate = (template: LearningTemplate) => {
    setSelectedTemplate(template);
    // create a minimal learning path from the template and set it as currentPath
    const path = makeLearningPathFromTemplate(template);
    setCurrentPath(path);
    // set the current learning path topic so the UI opens into the learning view
    setCurrentLearningPath({ title: template.name, type: 'topic' });
    setMode('template-details');
  };

  // templates are rendered within the main layout below so they keep the same header and padding

  if (mode === 'store') {
    return <StorePage onBack={handleBackToLearning} />;
  }

  if (mode === 'open-topics') {
    return (
      <OpenTopicsPage
        onBack={handleBackToLearning}
        onStartTopic={(t) => {
          setCurrentLearningPath({ title: t, type: 'topic' });
          setMode('learning');
          // trigger an automatic generation so the LearnWidget fetches details
          triggerSubtopicGeneration({ title: t, type: 'topic' });
        }}
      />
    );
  }

  if (mode === 'completed-topics') {
    return (
      <CompletedTopicsPage
        onBack={handleBackToLearning}
        onStartTopic={(t) => {
          setCurrentLearningPath({ title: t, type: 'topic' });
          setMode('learning');
          triggerSubtopicGeneration({ title: t, type: 'topic' });
        }}
      />
    );
  }

  if (mode === 'statistics') {
    return <StatisticsOverview onBack={handleBackToLearning} />;
  }

  // video-statistics handling removed

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        {/* <DashboardHeader
          mode={mode as 'learning'}
          onEdit={handleEditDashboard}
        /> */}

        {/* Mode-specific content */}
        {mode === 'templates' ? (
          <TemplatesPage onBack={handleBackToLearning} onSelectTemplate={handleSelectTemplate} />
        ) : mode === 'template-details' && selectedTemplate ? (
          <TemplateDetailsPage
            template={selectedTemplate}
            onBack={() => setMode('templates')}
            onUseTemplate={() => setMode('learning')}
          />
        ) : (
          <LearningSection
            onStatisticsClick={handleStatisticsClick}
            onStoreClick={handleStoreClick}
            onOpenTopicsClick={handleOpenTopicsClick}
            onCompletedTopicsClick={handleCompletedTopicsClick}
            onTemplatesClick={handleTemplatesClick}
          />
        )}

        {/*  Full width widget */}
        {/* //*will be shown in both modes at this point */}
        {/* <FullWidthWidget /> */}
      </div>
    </div>
  );
}
