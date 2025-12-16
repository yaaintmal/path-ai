import { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  Trophy,
  Star,
  Zap,
  Gamepad2,
  Award,
  Sparkles,
  Users,
  Palette,
  FileText,
  Layout,
  Lightbulb,
  Rocket,
  ShoppingBag,
  Lock,
  Target,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const studentAchievements = [
  { icon: '🔥', name: '7-Tage-Streak', points: 100, unlocked: true },
  { icon: '🎯', name: 'Erstes Thema', points: 50, unlocked: true },
  { icon: '📚', name: 'Wissensdurst', points: 150, unlocked: false },
  { icon: '⚡', name: 'Schnellstarter', points: 250, unlocked: true },
  { icon: '🏆', name: 'Level Up', points: 500, unlocked: false },
  { icon: '💎', name: 'Meister', points: 1000, unlocked: false },
];

const storeItems = [
  { icon: '⚡', name: 'Double XP (24h)', price: 2500, category: 'boost', sold: 1240 },
  { icon: '🛡️', name: 'Streak Shield', price: 1500, category: 'boost', sold: 890 },
  { icon: '🏅', name: 'Golden Badge', price: 5000, category: 'badge', sold: 450 },
  { icon: '🌈', name: 'Rainbow Theme', price: 3000, category: 'theme', sold: 620 },
  { icon: '🖼️', name: 'Custom Frame', price: 2000, category: 'cosmetic', sold: 340 },
  { icon: '✨', name: 'Gold Border', price: 4000, category: 'cosmetic', sold: 510 },
];

const teacherRewards = [
  {
    icon: Users,
    title: 'Community-Held',
    description: 'Teile deine Templates mit der Community',
    type: 'Badge',
    color: 'from-amber-600 to-orange-600',
  },
  {
    icon: FileText,
    title: 'Template Creator',
    description: 'Erstelle 5 eigene Lernpfad-Templates',
    type: 'Achievement',
    color: 'from-amber-600 to-yellow-600',
  },
  {
    icon: Layout,
    title: 'Pfad-Architekt',
    description: 'Strukturiere komplexe Themen für andere',
    type: 'Status',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Sparkles,
    title: 'Top-Bewertet',
    description: 'Deine Templates werden oft genutzt',
    type: 'Bonus',
    color: 'from-yellow-500 to-orange-600',
  },
];

export function Gamification() {
  const { t } = useTranslation('landing');
  const [selectedTab, setSelectedTab] = useState('students');
  const [studentPoints] = useState(2450);

  return (
    <section
      id="gamification"
      className="container mx-auto px-4 py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0 mb-4">
            <Gamepad2 className="size-4 mr-2" />
            {t('gamification.title')}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight animate-fade-in">
            {t('gamification.headingPart1')}{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {t('gamification.headingHighlight')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 animate-fade-in-delayed">
            {t('gamification.subtitle')}
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="students" className="gap-2">
              <Trophy className="size-4" />
              {t('gamification.tabs.students')}
            </TabsTrigger>
            <TabsTrigger value="teachers" className="gap-2">
              <Award className="size-4" />
              {t('gamification.tabs.teachers')}
            </TabsTrigger>
          </TabsList>

          {/* Students & Pupils Gamification */}
          <TabsContent value="students" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Points & Achievements */}
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Card className="h-full p-8 hover:shadow-xl transition-all duration-300 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {t('gamification.pointsLabel')}
                      </div>
                      <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {studentPoints.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-600 to-orange-600 p-4 rounded-2xl shadow-lg">
                      <Star className="size-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Zap className="size-5 text-amber-600" />
                    {t('gamification.howToEarn.title')}
                  </h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between bg-amber-500/10 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Zap className="size-4 text-amber-600" />
                        <span className="text-sm">{t('gamification.howToEarn.completeTask')}</span>
                      </div>
                      <Badge className="bg-amber-600 text-white border-0">+50</Badge>
                    </div>
                    <div className="flex items-center justify-between bg-orange-500/10 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Trophy className="size-4 text-orange-600" />
                        <span className="text-sm">{t('gamification.howToEarn.weekStreak')}</span>
                      </div>
                      <Badge className="bg-orange-600 text-white border-0">+100</Badge>
                    </div>
                    <div className="flex items-center justify-between bg-green-500/10 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Target className="size-4 text-green-600" />
                        <span className="text-sm">{t('gamification.howToEarn.weekGoal')}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Award className="size-5 text-amber-600" />
                    {t('gamification.achievementsTitle')}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {studentAchievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`relative p-4 rounded-xl text-center transition-all ${
                          achievement.unlocked
                            ? 'bg-gradient-to-br from-amber-600 to-orange-600 shadow-lg'
                            : 'bg-gray-200 dark:bg-gray-700 opacity-50'
                        }`}
                      >
                        <div className="text-3xl mb-1">{achievement.icon}</div>
                        <div
                          className={`text-xs font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                          {achievement.points}
                        </div>
                        {!achievement.unlocked && (
                          <Lock className="absolute top-2 right-2 size-3 text-gray-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Rewards Shop */}
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Card className="h-full p-8 hover:shadow-xl transition-all duration-300 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <ShoppingBag className="size-6 text-amber-600" />
                      {t('gamification.store.title')}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t('gamification.store.description')}
                  </p>

                  <div className="space-y-3">
                    {storeItems.slice(0, 6).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-amber-500/10 rounded-lg hover:bg-amber-500/20 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{item.icon}</div>
                          <div>
                            <div className="text-sm font-bold">{item.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {t('gamification.store.sold', { count: item.sold })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 group-hover:text-amber-600 transition-colors">
                          <Star className="size-4 text-amber-600" />
                          <span className="text-sm font-bold">{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 hover:shadow-lg">
                    <ShoppingBag className="size-4 mr-2" />
                    {t('gamification.store.cta')}
                  </Button>
                </Card>
              </div>
            </div>

            {/* Game Features Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Lightbulb,
                  title: 'Tipps & Lösungen',
                  description:
                    'Steckst du fest? Nutze Punkte für hilfreiche Tipps oder die komplette Lösung.',
                  items: [
                    '💡 Kleiner Tipp - 50 Punkte',
                    '💭 Ausführlicher Hinweis - 100 Punkte',
                    '✅ Komplette Lösung - 200 Punkte',
                  ],
                  delay: '0.3s',
                },
                {
                  icon: Gamepad2,
                  title: 'Lern-Spiele',
                  description:
                    'Nimm an Spielen teil, level deine Spielfigur und schalte neue Inhalte frei!',
                  items: [
                    '🎮 Quest Mode - Level 12',
                    '⚔️ Battle Arena - 5 Siege',
                    '🏆 Rankings - Top 100',
                  ],
                  delay: '0.4s',
                },
                {
                  icon: Palette,
                  title: 'Lernraum-Design',
                  description:
                    'Gestalte deinen persönlichen Lernraum mit individuellen Themes und Designs.',
                  items: [
                    '🌙 Dark Mode',
                    '🌸 Sakura Theme',
                    '🌊 Ocean Blue',
                    '🔥 Fire Red',
                    '❄️ Ice Cold',
                    '🌈 Rainbow',
                  ],
                  delay: '0.5s',
                },
                {
                  icon: Rocket,
                  title: 'Charaktere & Items',
                  description:
                    'Schalte neue Avatare, Badges und spezielle Items frei, um dich von anderen abzuheben.',
                  items: ['👕 12 Outfits', '🎩 8 Hats', '✨ 20+ Effekte'],
                  delay: '0.6s',
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="animate-slide-up"
                  style={{ animationDelay: feature.delay }}
                >
                  <Card className="h-full p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm group">
                    <div className="bg-gradient-to-br from-amber-600 to-orange-600 size-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="size-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {t(`gamification.features.${idx}.title`)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                      {t(`gamification.features.${idx}.description`)}
                    </p>
                    <div className="space-y-2">
                      {(() => {
                        const items = t(`gamification.features.${idx}.items`, {
                          returnObjects: true,
                        });
                        const arr = Array.isArray(items) ? (items as string[]) : [String(items)];
                        return arr.map((item, i) => (
                          <div
                            key={i}
                            className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                            {item}
                          </div>
                        ));
                      })()}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="mt-0">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {teacherRewards.map((reward, index) => (
                <div
                  key={index}
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <Card className="h-full p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm group">
                    <div
                      className={`bg-gradient-to-br ${reward.color} size-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <reward.icon className="size-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {t(`gamification.teacherRewards.${index}.title`)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {t(`gamification.teacherRewards.${index}.description`)}
                    </p>
                    <Badge className={`bg-gradient-to-r ${reward.color} text-white border-0`}>
                      {t(`gamification.teacherRewards.${index}.type`)}
                    </Badge>
                  </Card>
                </div>
              ))}
            </div>

            <div className="text-center p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-800">
              <Sparkles className="size-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">{t('gamification.teacher.callout.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('gamification.teacher.callout.description')}
              </p>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 hover:shadow-lg">
                {t('gamification.teacher.callout.cta')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
