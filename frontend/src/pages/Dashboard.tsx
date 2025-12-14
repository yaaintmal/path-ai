interface DashboardProps {
  setShowOnboardingEditor: (show: boolean) => void;
  mode: 'learning' | 'statistics' | 'store' | 'completed-topics' | null;
  onBackToSelection?: () => void;
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
import { useAuth } from '../contexts/useAuth';
import config from '../config/app.config';
import { StorePage } from './StorePage';
import type { LearningTemplate } from '../types/templates';
import type { LearningPath, LearningPathItem } from '../types/learning';
import { getApiUrl } from '../config/app.config';

//* refactored out widgets below
// import { CommonWidgetsRow } from './dashboard/CommonWidgetsRow';
// import { FullWidthWidget } from './dashboard/FullWidthWidget';
// import { StreakWidget } from './dashboard/StreakWidget';

export function Dashboard({ mode: initialMode, onBackToSelection }: DashboardProps) {
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

  // Debug (admin only): Test API connection
  const { user, isAuthenticated, userDetails } = useAuth();

  const isAdmin = (() => {
    try {
      if (!isAuthenticated) return false;
      // Accept a few shapes for admin information to be robust across environments
      const u = user as { role?: string; isAdmin?: boolean; email?: string } | null;
      const ud = userDetails as { roles?: string[] } | null;
      if (u?.role === 'admin' || u?.isAdmin === true) return true;
      if (ud?.roles && Array.isArray(ud.roles) && ud.roles.includes('admin')) return true;
      // fallback to email whitelist (development convenience)
      if (u?.email && u.email === 'mal@dot.com') return true;
      return false;
    } catch {
      return false;
    }
  })();

  const [apiTestResult, setApiTestResult] = useState<string>('');

  const testApiConnection = async () => {
    try {
      const url = getApiUrl('/api/health');
      console.log('[Debug] Testing API connection to:', url);
      const response = await fetch(url);
      const data = await response.json();
      setApiTestResult(`✅ Success: ${JSON.stringify(data)}`);
      console.log('[Debug] API test successful:', data);
    } catch (error) {
      setApiTestResult(`❌ Error: ${error}`);
      console.error('[Debug] API test failed:', error);
    }
  };

  const testLoginEndpoint = async () => {
    try {
      const url = getApiUrl('/api/users/login');
      console.log('[Debug] Testing login endpoint to:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'test' }),
        credentials: 'include',
        mode: 'cors',
      });
      const data = await response.json();
      setApiTestResult(`🔐 Login test: ${response.status} - ${JSON.stringify(data)}`);
      console.log('[Debug] Login test result:', response.status, data);
    } catch (error) {
      setApiTestResult(`❌ Login test error: ${error}`);
      console.error('[Debug] Login test failed:', error);
    }
  };

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
            onBack={() => {
              // If an app-level handler is provided, prefer it so we return to the dashboard selection
              if (onBackToSelection) {
                onBackToSelection();
              } else {
                // fall back to returning to the default learning view
                setMode('learning');
              }
            }}
          />
        )}

        {/*  Full width widget */}
        {/* //*will be shown in both modes at this point */}
        {/* <FullWidthWidget /> */}
        {/* Debug: API Connection Test (admin only) - moved to the end of the dashboard */}
        {isAdmin && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🔧 Debug: API Connection Test</h3>
            <div className="flex gap-2 mb-2">
              <button
                onClick={testApiConnection}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Test Health Endpoint
              </button>
              <button
                onClick={testLoginEndpoint}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Test Login Endpoint
              </button>
            </div>
            <div className="text-sm text-muted mt-2">
              <div>
                Computed API baseUrl: <code>{config.api.baseUrl}</code>
              </div>
              <div>
                VITE_API_URL: <code>{import.meta.env.VITE_API_URL ?? '<unset>'}</code>
              </div>
            </div>
            {apiTestResult && (
              <div className="mt-2 p-2 bg-white dark:bg-gray-700 rounded text-sm font-mono">
                {apiTestResult}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
