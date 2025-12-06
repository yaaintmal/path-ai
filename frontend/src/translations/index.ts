export const translations = {
  de: {
    // Navigation
    nav: {
      start: 'Start',
      languages: 'Sprachen',
      targetAudiences: 'Zielgruppen',
      features: 'Features',
      howItWorks: "So geht's",
      gamification: 'Gamification',
      templates: 'Templates',
      dashboard: 'Dashboard',
      cta: 'Jetzt starten',
      yourDashboard: 'Dein Dashboard',
    },
    // Header
    header: {
      login: 'Anmelden',
      logout: 'Logout',
      createDashboard: 'Dashboard erstellen',
      editDashboard: 'Dashboard anpassen',
      adjust: 'Anpassen',
      start: 'Start',
      hey: 'Hey',
    },
    // Language Switch
    language: {
      de: 'DE',
      en: 'EN',
    },
    // Hero Section
    hero: {
      forAll: 'Für alle',
      students: 'Studenten',
      pupils: 'Schüler',
      teachers: 'Lehrkräfte',
      allTitle: 'Dein verlässlicher Partner fürs Lernen – unterstützt durch KI.',
      allItems: [
        'Individuelle Lernpläne abgestimmt auf Deine Fähigkeiten.',
        'Berücksichtigt Deine persönliche Art zu lernen.',
        'Empfohlene Videos – automatisch übersetzt in Deine Sprache.',
        'Dein persönliches Dashboard als flexibler Lernraum.',
      ],
      studentsTitle: 'Dein individueller Lernplan für jedes Lernziel.',
      studentsItems: [
        'Entwickle klare Lernziele mit Hilfe von Learnbuddy.',
        'Entdecke Deine optimale Lernmethode und verbessere Dich kontinuierlich.',
        'Finde passende Videos – Learnbuddy fasst zusammen und übersetzt.',
        'Lerne strukturiert, arbeite Wissenslücken gezielt auf und feiere Erfolge.',
      ],
      pupilsTitle: 'Effektiv lernen – perfekt vorbereitet.',
      pupilsItems: [
        'Dein individueller Lernplan passend zu Deinem Wissensstand.',
        'Perfekte Vorbereitung auf Tests, Klassenarbeiten und Prüfungen.',
        'Sammle Punkte, schalte Erfolge frei und gewinne Badges.',
        'Lerne, wie Du richtig und effektiv lernst.',
      ],
      teachersTitle: 'Dein individuelles Dashboard für Planung & Entwicklung.',
      teachersItems: [
        'Erstelle Lehrpläne abgestimmt auf Deine Klasse.',
        'Verwalte Materialien und erstelle passende Aufgaben.',
        'Behalte den Überblick über alle Fächer und Inhalte.',
        'Plane, organisiere und verbessere Deinen Unterricht mit Learnbuddy.',
      ],
      ctaButton: 'Jetzt direkt loslegen',
    },
  },
  en: {
    // Navigation
    nav: {
      start: 'Home',
      languages: 'Languages',
      targetAudiences: 'Target Audiences',
      features: 'Features',
      howItWorks: 'How It Works',
      gamification: 'Gamification',
      templates: 'Templates',
      dashboard: 'Dashboard',
      cta: 'Get Started',
      yourDashboard: 'Your Dashboard',
    },
    // Header
    header: {
      login: 'Login',
      logout: 'Logout',
      createDashboard: 'Create Dashboard',
      editDashboard: 'Edit Dashboard',
      adjust: 'Adjust',
      start: 'Start',
      hey: 'Hey',
    },
    // Language Switch
    language: {
      de: 'DE',
      en: 'EN',
    },
    // Hero Section
    hero: {
      forAll: 'For Everyone',
      students: 'Students',
      pupils: 'Pupils',
      teachers: 'Teachers',
      allTitle: 'Your reliable learning partner – powered by AI.',
      allItems: [
        'Individual learning plans tailored to your abilities.',
        'Takes into account your personal learning style.',
        'Recommended videos – automatically translated into your language.',
        'Your personal dashboard as a flexible learning space.',
      ],
      studentsTitle: 'Your individual learning plan for every learning goal.',
      studentsItems: [
        'Develop clear learning goals with the help of Learnbuddy.',
        'Discover your optimal learning method and continuously improve.',
        'Find suitable videos – Learnbuddy summarizes and translates.',
        'Learn structured, work on knowledge gaps systematically and celebrate successes.',
      ],
      pupilsTitle: 'Learn effectively – perfectly prepared.',
      pupilsItems: [
        'Your individual learning plan matching your knowledge level.',
        'Perfect preparation for tests, exams and assessments.',
        'Collect points, unlock achievements and win badges.',
        'Learn how to learn correctly and effectively.',
      ],
      teachersTitle: 'Your individual dashboard for planning & development.',
      teachersItems: [
        'Create curricula tailored to your class.',
        'Manage materials and create appropriate tasks.',
        'Keep track of all subjects and content.',
        'Plan, organize and improve your teaching with Learnbuddy.',
      ],
      ctaButton: 'Get started now',
    },
  },
};

export type TranslationKey = keyof typeof translations.de;
