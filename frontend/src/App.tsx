// Landing Page Components
import { Hero } from './components/landing/Hero';

import { TargetAudiences } from './components/landing/TargetAudiences';
import { Gamification } from './components/landing/Gamification';
import { Features } from './components/landing/Features';
import { PromptTemplates } from './components/landing/PromptTemplates';
import { HowItWorks } from './components/landing/HowItWorks';
import { DashboardPreview } from './components/landing/DashboardPreview';
// import { FAQ } from './components/landing/FAQ';
import { CTA } from './components/landing/CTA';

// Onboarding Component(s) > it's more like THE component
import { OnboardingWizard } from './components/landing/onboarding';

// Pages
import { OnboardingEditor } from './pages/OnboardingEditor';
import { Registration } from './pages/Registration';
import { Dashboard } from './pages/Dashboard';
import { ChangelogPage } from './pages/Changelog';
import { DashboardSelection } from './components/dashboard/DashboardSelection';
import { TimerPage } from './pages/TimerPage';

// Global Elements
import { Header } from './components/global/Header';
import { Footer } from './components/global/Footer';
import { VersionIndicator } from './components/global/VersionIndicator';

// Contexts
import { useAuth } from './contexts/useAuth';
import { TimerProvider } from './contexts/TimerContext';
import { useState, useEffect } from 'react';
import config from './config/app.config';

function AppContent() {
  const { isAuthenticated } = useAuth();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showOnboardingEditor, setShowOnboardingEditor] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [dashboardMode, setDashboardMode] = useState<
    'learning' | 'statistics' | 'completed-topics' | null
  >(null);
  const [hasOnboardingData, setHasOnboardingData] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const checkOnboardingStatus = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/me`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const hasData =
              data.user.onboardingData && Object.keys(data.user.onboardingData).length > 0;
            setHasOnboardingData(hasData);
            if (!hasData) {
              setShowOnboarding(true);
            }
          }
        } catch (error) {
          console.error('Failed to check onboarding status:', error);
        }
      };
      checkOnboardingStatus();
    }
    // Listen for global requests to show the changelog (dispatched from widgets)
    const onShowChangelog = () => setShowChangelog(true);
    // Listen for requests to open completed topics page
    const onShowCompletedTopics = () => {
      setShowDashboard(true);
      setDashboardMode('completed-topics');
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('showChangelog', onShowChangelog as EventListener);
      window.addEventListener('showCompletedTopics', onShowCompletedTopics as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('showChangelog', onShowChangelog as EventListener);
        window.removeEventListener('showCompletedTopics', onShowCompletedTopics as EventListener);
      }
    };
  }, [isAuthenticated]);

  // Prevent non-authenticated users from opening the dashboard via programmatic calls
  useEffect(() => {
    if (showDashboard && !isAuthenticated) {
      // schedule state updates to avoid synchronous setState calls inside an effect
      setTimeout(() => {
        setShowRegistration(true);
        setShowDashboard(false);
      }, 0);
    }
  }, [showDashboard, isAuthenticated]);

  if (showTimer) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header
          setShowOnboarding={setShowOnboarding}
          setShowRegistration={setShowRegistration}
          setShowOnboardingEditor={setShowOnboardingEditor}
          setShowDashboard={setShowDashboard}
          setShowTimer={setShowTimer}
          setDashboardMode={setDashboardMode}
          hasOnboardingData={hasOnboardingData}
        />
        <TimerPage onBack={() => setShowTimer(false)} />
        <Footer />
        <VersionIndicator onClick={() => setShowChangelog(true)} />
      </div>
    );
  }

  if (showDashboard) {
    if (!dashboardMode) {
      return (
        <div className="min-h-screen bg-background transition-colors duration-300">
          <Header
            setShowOnboarding={setShowOnboarding}
            setShowRegistration={setShowRegistration}
            setShowOnboardingEditor={setShowOnboardingEditor}
            setShowDashboard={setShowDashboard}
            setShowTimer={setShowTimer}
            setDashboardMode={setDashboardMode}
            hasOnboardingData={hasOnboardingData}
          />
          <DashboardSelection
            onSelect={(mode) => {
              // ensure the dashboard container is visible and set the selected mode
              setShowDashboard(true);
              setDashboardMode(mode);
            }}
            onTimerClick={() => setShowTimer(true)}
          />
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header
          setShowOnboarding={setShowOnboarding}
          setShowRegistration={setShowRegistration}
          setShowOnboardingEditor={setShowOnboardingEditor}
          setShowDashboard={setShowDashboard}
          setShowTimer={setShowTimer}
          setDashboardMode={setDashboardMode}
          hasOnboardingData={hasOnboardingData}
        />
        <Dashboard
          setShowOnboardingEditor={setShowOnboardingEditor}
          mode={dashboardMode}
          onBackToSelection={() => setDashboardMode(null)}
        />
        <Footer />
      </div>
    );
  }
  if (showRegistration) {
    // Render the unified AuthWizard; if signup is disabled, allow only login mode
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header
          setShowOnboarding={setShowOnboarding}
          setShowRegistration={setShowRegistration}
          setShowOnboardingEditor={setShowOnboardingEditor}
          setShowDashboard={setShowDashboard}
          setShowTimer={setShowTimer}
          hasOnboardingData={hasOnboardingData}
        />
        <div className="container mx-auto px-4 py-12">
          <Registration
            onAuthSuccess={() => setShowRegistration(false)}
            allowRegister={config.features.enableSignup}
          />
        </div>
        <Footer />
      </div>
    );
  }
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header
          setShowOnboarding={setShowOnboarding}
          setShowRegistration={setShowRegistration}
          setShowOnboardingEditor={setShowOnboardingEditor}
          setShowDashboard={setShowDashboard}
          setShowTimer={setShowTimer}
          hasOnboardingData={hasOnboardingData}
        />
        <OnboardingWizard setHasOnboardingData={setHasOnboardingData} />
        <Footer />
      </div>
    );
  }
  if (showChangelog) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <ChangelogPage onBack={() => setShowChangelog(false)} />
      </div>
    );
  }

  if (showOnboardingEditor) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header
          setShowOnboarding={setShowOnboarding}
          setShowRegistration={setShowRegistration}
          setShowOnboardingEditor={setShowOnboardingEditor}
          setShowDashboard={setShowDashboard}
          setShowTimer={setShowTimer}
          hasOnboardingData={hasOnboardingData}
        />
        <OnboardingEditor
          setShowOnboardingEditor={setShowOnboardingEditor}
          setHasOnboardingData={setHasOnboardingData}
          setShowDashboard={setShowDashboard}
        />
        <Footer />
        <VersionIndicator onClick={() => setShowChangelog(true)} />
      </div>
    );
  }
  if (isAuthenticated && hasOnboardingData) {
    if (!dashboardMode) {
      return (
        <div className="min-h-screen bg-background transition-colors duration-300">
          <Header
            setShowOnboarding={setShowOnboarding}
            setShowRegistration={setShowRegistration}
            setShowOnboardingEditor={setShowOnboardingEditor}
            setShowDashboard={setShowDashboard}
            setShowTimer={setShowTimer}
            setDashboardMode={setDashboardMode}
            hasOnboardingData={hasOnboardingData}
          />
          <DashboardSelection
            onSelect={(mode) => {
              // ensure the dashboard container is visible and set the selected mode
              setShowDashboard(true);
              setDashboardMode(mode);
            }}
            onTimerClick={() => setShowTimer(true)}
          />
          <Footer />
          <VersionIndicator onClick={() => setShowChangelog(true)} />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-700 ease-in-out">
      {' '}
      <Header
        setShowOnboarding={setShowOnboarding}
        setShowRegistration={setShowRegistration}
        setShowOnboardingEditor={setShowOnboardingEditor}
        setShowDashboard={setShowDashboard}
        setShowTimer={setShowTimer}
        hasOnboardingData={hasOnboardingData}
      />
      {/* 1. Hero: Was ist PathStudio? */}
      <Hero setShowOnboarding={setShowOnboarding} />
      {/* 2. Features */}
      <Features />
      {/* 3. Mehrsprachig / Sprachen // Placeholder as video is fully removed in beta 5.2 */}
      {/* 4. Weitere Sections */}
      <TargetAudiences />
      <Gamification />
      <PromptTemplates />
      <HowItWorks />
      <DashboardPreview />
      {/* <FAQ /> */}
      <CTA />
      <Footer />
      <VersionIndicator onClick={() => setShowChangelog(true)} />
    </div>
  );
}

export default function App() {
  return (
    <TimerProvider>
      <AppContent />
    </TimerProvider>
  );
}
