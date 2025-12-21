import { ArrowRight } from 'lucide-react';
import { Card } from '../../ui/card';
import { useTranslation } from 'react-i18next';

const stepsMeta = [
  { number: '01', bgHover: 'rgba(217, 119, 6, 0.1)', delay: 0.1 },
  { number: '02', bgHover: 'rgba(217, 119, 6, 0.1)', delay: 0.2 },
  { number: '03', bgHover: 'rgba(217, 119, 6, 0.1)', delay: 0.3 },
  { number: '04', bgHover: 'rgba(217, 119, 6, 0.1)', delay: 0.4 },
];

export function HowItWorks() {
  const { t } = useTranslation('landing');
  const rawSteps = t('howItWorks.steps', { returnObjects: true });
  const steps = (Array.isArray(rawSteps) ? rawSteps : []) as Array<{
    title: string;
    description: string;
  }>;

  return (
    <section
      id="how-it-works"
      className="container mx-auto px-4 py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight animate-fade-in">
            {t('howItWorks.headingPart1')}{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {t('howItWorks.headingHighlight')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 animate-fade-in-delayed">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="animate-slide-up relative group"
              style={{
                animationDelay: `${stepsMeta[index].delay}s`,
              }}
            >
              <Card
                className="h-full p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = stepsMeta[index].bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                }}
              >
                <div className="text-6xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4 font-bold opacity-75 group-hover:opacity-100 transition-opacity">
                  {stepsMeta[index].number}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 pointer-events-none">
                  <ArrowRight className="size-8 text-amber-600 opacity-30 group-hover:opacity-60 transition-opacity" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
