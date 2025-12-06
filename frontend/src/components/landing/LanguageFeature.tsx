
import { Globe, Youtube, Languages, Subtitles, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';
import { motion, useInView } from 'framer-motion';
import { useRef, useMemo } from 'react';
import { useLanguage } from '../../contexts/useLanguage';

const languages = [
  '🇩🇪 Deutsch',
  '🇬🇧 Englisch',
  '🇪🇸 Spanisch',
  '🇫🇷 Französisch',
  '🇮🇹 Italienisch',
  '🇵🇹 Portugiesisch',
  '🇯🇵 Japanisch',
  '🇨🇳 Chinesisch',
  '🇰🇷 Koreanisch',
  '🇷🇺 Russisch',
  '🇦🇪 Arabisch',
  '🇹🇷 Türkisch',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const languageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const languageItemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

export function LanguageFeature() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const cardData = useMemo(
    () => [
      {
        icon: Languages,
        title: t('languageFeature.card1Title'),
        description: t('languageFeature.card1Description'),
        color: 'from-blue-500 to-blue-600',
      },
      {
        icon: Youtube,
        title: t('languageFeature.card2Title'),
        description: t('languageFeature.card2Description'),
        color: 'from-red-500 to-red-600',
      },
      {
        icon: Subtitles,
        title: t('languageFeature.card3Title'),
        description: t('languageFeature.card3Description'),
        color: 'from-purple-500 to-purple-600',
      },
    ],
    [t]
  );

  return (
    <section
      ref={sectionRef}
      id="languages"
      className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-950 py-20 md:py-32 text-white relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-9xl">🌍</div>
        <div className="absolute bottom-10 right-10 text-9xl">💬</div>
        <div className="absolute top-1/2 left-1/4 text-7xl">🎥</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <Badge className="bg-white/20 text-white border-0 mb-4">{t('languageFeature.badge')}</Badge>
          <h2 className="text-4xl md:text-6xl mb-6">
            {t('languageFeature.title')} <br />
            <span className="text-white/90">{t('languageFeature.titleSub')}</span>
          </h2>
          <p className="text-xl text-white/90 mb-8">{t('languageFeature.description')}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          {cardData.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div key={index} variants={cardVariants}>
                <Card className="p-8 bg-card dark:bg-card text-foreground dark:text-foreground border-2 border-border dark:border-border shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2">
                  <div
                    className={`size-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${card.color} shadow-lg`}
                  >
                    <IconComponent className="size-8 text-white" />
                  </div>
                  <h3 className="text-2xl mb-3 font-bold text-foreground">{card.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{card.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/95 dark:bg-card/95 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 dark:border-border shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Globe className="size-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{t('languageFeature.availableLanguages')}</h3>
          </div>
          <motion.div
            variants={languageContainerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {languages.map((lang, index) => (
              <motion.div
                key={index}
                variants={languageItemVariants}
                className="flex items-center gap-2 bg-card-foreground/5 dark:bg-card-foreground/10 rounded-lg px-4 py-3 border border-blue-200/50 dark:border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <CheckCircle2 className="size-4 flex-shrink-0 text-primary dark:text-primary-foreground" />
                <span className="text-sm font-medium text-foreground">{lang}</span>
              </motion.div>
            ))}
          </motion.div>
          <p className="text-center text-muted-foreground mt-6 text-sm font-medium">{t('languageFeature.moreLanguages')}</p>
        </motion.div>
      </div>
    </section>
  );
}

export default LanguageFeature;
