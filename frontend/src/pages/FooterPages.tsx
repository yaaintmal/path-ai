import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { RoadmapPage } from './RoadmapPage';

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
          content:
            'Discover the powerful features that make Path AI your ultimate learning companion.',
        };
      case 'pricing':
        return {
          title: 'Pricing',
          content: 'Flexible pricing plans designed to scale with your learning journey.',
        };
      case 'faq':
        return {
          title: 'Frequently Asked Questions',
          content:
            'Find answers to common questions about Path AI and how to get the most out of it.',
        };

      // Company
      case 'about':
        return {
          title: 'About Us',
          content: 'Learn more about the mission and the team behind Path AI.',
        };
      case 'blog':
        return {
          title: 'Blog',
          content: 'Insights, updates, and stories from the world of AI-powered learning.',
        };
      case 'career':
        return {
          title: 'Careers',
          content: 'Join us in shaping the future of education. Check out our open positions.',
        };
      case 'contact':
        return {
          title: 'Contact Us',
          content: 'Have questions or feedback? We would love to hear from you.',
        };

      // Legal
      case 'data-protection':
        return {
          title: 'Data Protection',
          content: 'We take your privacy seriously. Read about how we protect your data.',
        };
      case 'legal-notice':
        return {
          title: 'Legal Notice',
          content: 'Important legal information regarding the use of our platform.',
        };
      case 'imprint':
        return {
          title: 'Imprint',
          content: 'Information about the service provider required by law.',
        };
      case 'cookie-policy':
        return {
          title: 'Cookie Policy',
          content: 'Understand how we use cookies to improve your experience.',
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
              <p className="text-muted-foreground leading-relaxed">{content}</p>
              <div className="mt-8 p-4 bg-secondary/30 rounded-lg border border-border/50 text-sm text-muted-foreground italic">
                This is a template page. Content will be added soon.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
