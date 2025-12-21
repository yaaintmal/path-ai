import {
  ArrowLeft,
  Sparkles,
  Languages,
  Trophy,
  LayoutDashboard,
  LineChart,
  Clock,
  Heart,
  ShieldCheck,
  Target,
  HelpCircle,
  Globe,
  User,
  Compass,
} from 'lucide-react';
import { Button } from '../ui/button';
import { RoadmapPage } from './RoadmapPage';
import { Card } from '../ui/card';

interface FooterPageProps {
  page: string;
  onBack: () => void;
}

export function FooterPage({ page, onBack }: FooterPageProps) {
  if (page === 'roadmap') {
    return <RoadmapPage onBack={onBack} />;
  }

  const getPageContent = (pageKey: string) => {
    switch (pageKey) {
      // Product
      case 'features':
        return {
          title: 'Features',
          content: (
            <div className="space-y-12">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-900/20">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  PathAI.One is designed to help learners of all backgrounds succeed. We've built a
                  suite of tools that make learning structured, enjoyable, and effective—no matter
                  what your goals are.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="p-6 hover:shadow-md transition-shadow border-amber-100/50 dark:border-amber-900/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="bg-amber-100 dark:bg-amber-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Sparkles className="text-amber-600 dark:text-amber-400 size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Create Your Learning Path</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Start with thousands of pre-built templates for popular careers, subjects, and
                    goals. Or tell our AI what you want to learn, and we'll build a personalized
                    plan just for you.
                  </p>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow border-amber-100/50 dark:border-amber-900/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Languages className="text-orange-600 dark:text-orange-400 size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Study in Your Language</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Learning shouldn't be limited by language. PathAI.One automatically translates
                    videos, articles, and explanations into your preferred language instantly.
                  </p>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow border-amber-100/50 dark:border-amber-900/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="bg-amber-100 dark:bg-amber-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Trophy className="text-amber-600 dark:text-amber-400 size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Stay Motivated</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Earn points for completing lessons, build daily streaks, unlock achievements,
                    and redeem rewards in our store. Watch your skills grow week by week.
                  </p>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow border-amber-100/50 dark:border-amber-900/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <LayoutDashboard className="text-orange-600 dark:text-orange-400 size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Organized Dashboard</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    No more scattered notes. Your personal dashboard organizes everything—your
                    courses, progress, points, and upcoming milestones—all in one place.
                  </p>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow border-amber-100/50 dark:border-amber-900/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="bg-amber-100 dark:bg-amber-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <LineChart className="text-amber-600 dark:text-amber-400 size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    See exactly where you are in your learning journey. Track how much time you've
                    invested and which topics you've mastered with detailed analytics.
                  </p>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow border-amber-100/50 dark:border-amber-900/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="text-orange-600 dark:text-orange-400 size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Flexible Sessions</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Whether you have 10 minutes or an hour, PathAI.One adapts to your schedule.
                    Short, focused study sessions are proven to boost retention.
                  </p>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow border-amber-100/50 dark:border-amber-900/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="bg-amber-100 dark:bg-amber-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Heart className="text-amber-600 dark:text-amber-400 size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Completely Free</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    No hidden fees. No premium tiers. No advertising. PathAI.One is free because we
                    believe education should be accessible to everyone.
                  </p>
                </Card>

                <Card className="p-6 hover:shadow-md transition-shadow border-amber-100/50 dark:border-amber-900/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="bg-orange-100 dark:bg-orange-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <ShieldCheck className="text-orange-600 dark:text-orange-400 size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Privacy-First</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Your data belongs to you. We're fully open source, which means transparency,
                    security, and the option to self-host if you prefer.
                  </p>
                </Card>
              </div>
            </div>
          ),
        };
      case 'demo':
        return {
          title: 'Demo',
          content: (
            <div className="space-y-6">
              <p>
                The demo is free to use and intended to showcase PathAI.One's Learning Mode and
                templates, but demo access is required at the moment. You can request access by
                emailing{' '}
                <a href="mailto:me@malick.cloud?subject=Demo%20access%20request">me@malick.cloud</a>{' '}
                or by opening an issue on the EDU repo to request a demo account.
              </p>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href="mailto:me@malick.cloud?subject=Demo%20access%20request"
                  className="inline-flex items-center gap-2 bg-amber-300 text-black px-3 py-1 rounded text-sm font-medium hover:opacity-90"
                  aria-label="Request demo access via email"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 4h16v16H4z" fill="none" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Request demo access
                </a>

                <a
                  href="https://github.com/yaaintmal/path-ai/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-300 hover:underline text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  Request via GitHub issue
                </a>
              </div>
              <div className="rounded-lg overflow-hidden border border-border/50 bg-card/50">
                {/* Placeholder screenshot: replace with actual image in /public/assets/images/demo-screenshot.png */}
                <div className="w-full h-44 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center text-sm text-gray-400">
                  Demo screenshot placeholder — replace with an actual screenshot at{' '}
                  <code>/public/assets/images/demo-screenshot.png</code>
                </div>
                <div className="p-3 text-xs text-muted-foreground italic">
                  Quick demo preview (replace with real images for the showcase).
                </div>
              </div>

              <p>
                If you prefer to run your own instance immediately, the EDU repo contains
                self-hosting instructions and examples to help you get started.
              </p>

              <div>
                <a
                  href="https://github.com/yaaintmal/path-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-300 hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  View EDU repo — self‑host & learn
                </a>
              </div>
            </div>
          ),
        };
      case 'faq':
        return {
          title: 'Frequently Asked Questions',
          content:
            'Find answers to common questions about PathAI.One and how to get the most out of it.',
        };

      // Company
      case 'about':
        return {
          title: 'About',
          content: (
            <div className="space-y-12">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-900/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl">
                    <Target className="text-amber-600 dark:text-amber-400 size-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>Free knowledge for everyone.</strong> PathAI.One was built with a simple
                  but powerful vision: to democratize access to structured, personalized learning.
                  We believe that quality education shouldn't be locked behind paywalls, and that
                  learning should adapt to the learner—not the other way around.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <HelpCircle className="text-orange-600 dark:text-orange-400 size-5" />
                    <h3 className="text-xl font-bold">The Problem We Solve</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Learning can feel overwhelming. Whether you're a student, a career changer, or a
                    teacher, the challenge is the same:{' '}
                    <strong>
                      how do you organize, prioritize, and retain knowledge effectively?
                    </strong>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Most platforms are either too rigid or too expensive. PathAI.One bridges this
                    gap by offering a platform that respects your learning style, budget, and time.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="text-amber-600 dark:text-amber-400 size-5" />
                    <h3 className="text-xl font-bold">Why Free & Open Source?</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Knowledge should be accessible to everyone. By making PathAI.One free and open
                    source, we ensure:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      No financial barriers to learning
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Complete privacy and data control
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Community-driven improvements via our{' '}
                      <a
                        href="https://github.com/yaaintmal/path-ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:underline font-medium"
                      >
                        EDU repo
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="p-6 border-amber-100/50 dark:border-amber-900/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                      <User className="text-amber-600 dark:text-amber-400 size-5" />
                    </div>
                    <h3 className="font-bold">Who Built This?</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    PathAI.One is built and maintained by{' '}
                    <a
                      href="https://malick.wtf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline font-medium"
                    >
                      Malick
                    </a>
                    . This is a labor of love—a single-developer project driven by the belief that
                    technology should serve learners, not exploit them.
                  </p>
                </Card>

                <Card className="p-6 border-orange-100/50 dark:border-orange-900/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                      <Compass className="text-orange-600 dark:text-orange-400 size-5" />
                    </div>
                    <h3 className="font-bold">Looking Forward</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    PathAI.One is constantly evolving. Our{' '}
                    <a
                      href="https://github.com/yaaintmal/path-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline font-medium"
                    >
                      EDU repo
                    </a>{' '}
                    provides full transparency into our roadmap. We welcome contributions from
                    educators, developers, and learners alike.
                  </p>
                </Card>
              </div>
            </div>
          ),
        };

      case 'contact':
        return {
          title: 'Contact',
          content: (
            <div className="space-y-4">
              <p>
                Email:{' '}
                <a href="mailto:me@malick.cloud?subject=Demo%20access%20request">me@malick.cloud</a>{' '}
                — use subject <strong>"Demo access request"</strong> to speed handling.
              </p>

              <p>
                Request demo access via GitHub:{' '}
                <a
                  href="https://github.com/yaaintmal/path-ai/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open an issue on the EDU repo
                </a>{' '}
                and include your email and a short note about your use case.
              </p>

              <p>
                Homepage:{' '}
                <a href="https://malick.wtf" target="_blank" rel="noopener noreferrer">
                  https://malick.wtf
                </a>
              </p>
            </div>
          ),
        };

      case 'code':
        return {
          title: 'Code & Learning Examples',
          content: (
            <div className="space-y-4">
              <p>Parts of the codebase are available as learning examples on GitHub:</p>
              <ul className="list-disc pl-6">
                <li>
                  <a
                    href="https://github.com/yaaintmal/path-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Repository — path-ai
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/yaaintmal/path-ai/tree/main/frontend"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    frontend/
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/yaaintmal/path-ai/tree/main/backend"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    backend/
                  </a>
                </li>
              </ul>
              <p className="text-sm italic">
                Use these for learning; commercial reuse is subject to the project's PolyForm
                Noncommercial 1.0.0 license.
              </p>
            </div>
          ),
        };

      // Legal
      case 'imprint':
        return {
          title: 'Imprint',
          content: (
            <div className="space-y-4">
              <p>
                <strong>Information according to § 5 DDG:</strong> [Dein Vorname] [Dein Nachname]
                c/o [Name des Impressum-Dienstleisters] [Straße Hausnummer des Dienstleisters] [PLZ]
                [Ort des Dienstleisters]
              </p>

              <p>
                <strong>Contact:</strong> E‑Mail:{' '}
                <a href="mailto:me@malick.cloud">me@malick.cloud</a> | Phone: [Deine virtuelle
                Nummer]
              </p>

              <p>
                <strong>Responsible for content according to § 18 MStV:</strong> [Dein Vorname]
                [Dein Nachname] (Address as above)
              </p>
            </div>
          ),
        };

      case 'privacy-policy':
        return {
          title: 'Privacy Policy',
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Data Protection at a Glance</h3>
              <p>
                We operate this application with a "Privacy First" approach. All personal data is
                processed exclusively on our own server infrastructure in Germany.
              </p>

              <h3 className="text-lg font-semibold">2. Infrastructure & Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Self-Hosting:</strong> This service is hosted on our own servers. No data
                  is sent to external cloud providers for AI processing or database management.
                </li>
                <li>
                  <strong>Encryption:</strong> This site is only accessible via HTTPS. All data
                  traffic is encrypted.
                </li>
                <li>
                  <strong>Cloudflare:</strong> We use Cloudflare as a security proxy (DDoS
                  protection). Cloudflare processes your IP address to ensure the security of our
                  infrastructure. This is based on our legitimate interest (Art. 6 (1) (f) GDPR).
                </li>
              </ul>

              <h3 className="text-lg font-semibold">3. Data Collection and Usage</h3>
              <p>
                We store the following data in a MongoDB database to provide our learning services
                (Art. 6 (1) (b) GDPR):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Data:</strong> Name, email address, and hashed password.
                </li>
                <li>
                  <strong>Learning Data:</strong> Your preferences, search topics, and saved
                  learning sessions. This data is stored until you delete your account.
                </li>
              </ul>

              <h3 className="text-lg font-semibold">4. Cookies</h3>
              <p>
                We do not use tracking or marketing cookies. We only use technically necessary
                cookies (e.g., by Cloudflare for bot detection or for session management).
                Therefore, no consent banner is required according to § 25 (2) TDDDG.
              </p>

              <h3 className="text-lg font-semibold">5. Your Rights</h3>
              <p>
                You have the right to receive information about the origin, recipient, and purpose
                of your stored personal data at any time free of charge. You also have a right to
                request the correction or deletion of this data.
              </p>
            </div>
          ),
        };

      case 'license':
        return {
          title: 'License',
          content: (
            <div className="space-y-4">
              <p>
                This application and its contents are licensed under the{' '}
                <strong>PolyForm Noncommercial License 1.0.0</strong>.
              </p>

              <ul className="list-disc pl-6">
                <li>
                  <strong>Usage:</strong> You are free to use this software for personal and
                  non-commercial purposes.
                </li>
                <li>
                  <strong>Restrictions:</strong> Commercial use of this software is strictly
                  prohibited without prior written permission.
                </li>
              </ul>

              <p>
                For the full legal terms, please visit:{' '}
                <a
                  href="https://polyformproject.org/licenses/noncommercial/1.0.0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PolyForm Noncommercial License 1.0.0
                </a>
                .
              </p>
            </div>
          ),
        };

      default:
        return {
          title: 'Page Not Found',
          content: 'The requested page could not be found.',
        };
    }
  };

  const { title, content } = getPageContent(page);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" onClick={onBack} className="mb-8 hover:bg-secondary/50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-600 rounded-full" />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
              {typeof content === 'string' ? (
                <p className="text-muted-foreground leading-relaxed">{content}</p>
              ) : (
                <div className="text-muted-foreground leading-relaxed">{content}</div>
              )}

              {/* Only show the template note for generic placeholder pages (string content) */}
              {typeof content === 'string' && (
                <div className="mt-8 p-4 bg-secondary/30 rounded-lg border border-border/50 text-sm text-muted-foreground italic">
                  This is a template page. Content will be added soon.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
