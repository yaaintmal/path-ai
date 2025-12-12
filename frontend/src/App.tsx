// Landing Page Components
import { Hero } from './components/landing/Hero';
// import { LanguageFeature } from './components/landing/LanguageFeature';
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

// Global Elements
import { Header } from './components/global/Header';
import { Footer } from './components/global/Footer';
import { VersionIndicator } from './components/global/VersionIndicator';

// Contexts
import { useAuth } from './contexts/useAuth';
import { useState, useEffect } from 'react';

export default function App() {
  const { isAuthenticated } = useAuth();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showOnboardingEditor, setShowOnboardingEditor] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [dashboardMode, setDashboardMode] = useState<'learning' | 'statistics' | null>(null);
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
  }, [isAuthenticated]);

  if (showDashboard) {
    if (!dashboardMode) {
      return (
        <div className="min-h-screen bg-background transition-colors duration-300">
          <Header
            setShowOnboarding={setShowOnboarding}
            setShowRegistration={setShowRegistration}
            setShowOnboardingEditor={setShowOnboardingEditor}
            setShowDashboard={setShowDashboard}
            setDashboardMode={setDashboardMode}
            hasOnboardingData={hasOnboardingData}
          />
          <DashboardSelection onSelect={setDashboardMode} />
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
          setDashboardMode={setDashboardMode}
          hasOnboardingData={hasOnboardingData}
        />
        <Dashboard setShowOnboardingEditor={setShowOnboardingEditor} mode={dashboardMode} />
        <Footer />
      </div>
    );
  }
  if (showRegistration) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header
          setShowOnboarding={setShowOnboarding}
          setShowRegistration={setShowRegistration}
          setShowOnboardingEditor={setShowOnboardingEditor}
          setShowDashboard={setShowDashboard}
          hasOnboardingData={hasOnboardingData}
        />
        <Registration onAuthSuccess={() => setShowRegistration(false)} />
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
            setDashboardMode={setDashboardMode}
            hasOnboardingData={hasOnboardingData}
          />
          <DashboardSelection onSelect={setDashboardMode} />
          <Footer />
          <VersionIndicator onClick={() => setShowChangelog(true)} />
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
          setDashboardMode={setDashboardMode}
          hasOnboardingData={hasOnboardingData}
        />
        <Dashboard setShowOnboardingEditor={setShowOnboardingEditor} mode={dashboardMode} />
        <Footer />
        <VersionIndicator onClick={() => setShowChangelog(true)} />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background transition-colors duration-700 ease-in-out">
      {' '}
      <Header
        setShowOnboarding={setShowOnboarding}
        setShowRegistration={setShowRegistration}
        setShowOnboardingEditor={setShowOnboardingEditor}
        setShowDashboard={setShowDashboard}
        hasOnboardingData={hasOnboardingData}
      />
      {/* 1. Hero: Was ist PathStudio? */}
      <Hero setShowOnboarding={setShowOnboarding} />
      {/* 2. Features */}
      <Features />
      {/* 3. Mehrsprachig / Sprachen */}
      {/* <LanguageFeature /> */}
      {/* 4. Weitere Sections */}
      <TargetAudiences />
      <Gamification />
      <PromptTemplates />
      <HowItWorks />
      <DashboardPreview />
      {/* <FAQ /> */}
      {/* //TODO: CTA right now not displayed but should be implemented in next phase */}
      {/* <CTA /> */}
      <Footer />
      <VersionIndicator onClick={() => setShowChangelog(true)} />
    </div>
  );
}
