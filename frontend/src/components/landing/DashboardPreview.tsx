import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
  TrendingUp,
  PlayCircle,
  Target,
  Flame,
  ShoppingCart,
  Bookmark,
  Archive,
  Sparkles,
  Search,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function DashboardPreview() {
  const { t } = useTranslation('landing');
  return (
    <section id="dashboard" className="container mx-auto px-4 py-20 md:py-32">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl mb-4">
          {t('pages.dashboard.titlePart1')}{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('pages.dashboard.titleHighlight')}
          </span>
        </h2>
        <p className="text-xl text-muted-foreground">{t('pages.dashboard.subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto bg-gray-50/50 dark:bg-gray-900/50 p-4 md:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl">
        {/* Widget 1: LearnWidget (Full Width) */}
        <div className="mb-6">
          <Card className="p-6 border-border shadow-md">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
                <input
                  type="text"
                  placeholder={t('pages.dashboard.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  readOnly
                />
              </div>
              <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Sparkles className="size-5" />
                {t('pages.dashboard.cta.startLearning')}
              </button>
            </div>
          </Card>
        </div>

        {/* Row 2: NextLesson (2/3) + Streak (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* NextLessonWidget Mock */}
          <div className="md:col-span-2">
            <Card className="h-full p-6 border-border shadow-md flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{t('pages.dashboard.nextLesson.title')}</h2>
                <div className="size-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Target className="size-6 text-white" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t('pages.dashboard.nextLesson.pathLabel')}
                  </p>
                  <p className="text-xl font-bold mb-1">
                    {t('pages.dashboard.nextLesson.titleExample')}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {t('pages.dashboard.nextLesson.badge')}
                  </Badge>
                </div>
                <button className="w-full py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-medium flex items-center justify-center gap-2">
                  <PlayCircle className="size-5" />
                  {t('pages.dashboard.nextLesson.cta')}
                </button>
              </div>
            </Card>
          </div>

          {/* CompactStreakWidget Mock */}
          <Card className="h-full p-6 border-border shadow-md flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('pages.dashboard.streak.title')}</h2>
              <div className="size-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <Flame className="size-6 text-white" />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-br from-orange-500 to-red-500 bg-clip-text text-transparent">
                12
              </div>
              <p className="text-muted-foreground font-medium">
                {t('pages.dashboard.streak.daysStreak', { days: 12 })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">
                  {t('pages.dashboard.streak.bestLabel')}
                </div>
                <div className="font-bold">{t('pages.dashboard.streak.bestValue')}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">
                  {t('pages.dashboard.streak.totalXpLabel')}
                </div>
                <div className="font-bold">{t('pages.dashboard.streak.totalXpValue')}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Row 3: Progress (1/3) + SavedThemes (2/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ProgressWidget Mock */}
          <Card className="p-6 border-border shadow-md flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('dashboardPreview.progress.title')}</h2>
              <div className="flex items-center gap-2">
                <div className="size-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                  <ShoppingCart className="size-5 text-white" />
                </div>
                <div className="size-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                  <TrendingUp className="size-6 text-white" />
                </div>
              </div>
            </div>

            <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xl shadow-sm">
                  🚀
                </div>
                <div>
                  <p className="font-bold text-sm">{t('dashboardPreview.progress.levelText')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('dashboardPreview.progress.expText')}
                  </p>
                </div>
              </div>
              <div className="h-2 bg-white/50 dark:bg-gray-800/50 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {t('dashboardPreview.progress.toNextLevel')}
              </p>
            </div>
          </Card>

          {/* SavedThemesWidget Mock */}
          <div className="md:col-span-2">
            <Card className="h-full p-6 border-border shadow-md flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{t('dashboardPreview.savedTopics.title')}</h2>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-card-foreground/5">
                    <Archive className="size-5 text-yellow-500" />
                  </div>
                  <div className="size-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Bookmark className="size-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'TypeScript Generics', type: 'subtopic' },
                  { title: 'CSS Grid Layout', type: 'topic' },
                  { title: 'Node.js Streams', type: 'subtopic' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2 rounded-full ${
                          item.type === 'topic' ? 'bg-yellow-500' : 'bg-orange-400'
                        }`}
                      />
                      <span className="font-medium text-sm">{item.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                          item.type === 'topic'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                        }`}
                      >
                        {item.type === 'topic'
                          ? t('dashboardPreview.savedTopics.types.main')
                          : t('dashboardPreview.savedTopics.types.sub')}
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-500"
                        aria-label={t('dashboardPreview.savedTopics.generate')}
                      >
                        <Sparkles className="size-4" />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-400 hover:text-purple-500"
                        aria-label={t('dashboardPreview.savedTopics.open')}
                      >
                        <PlayCircle className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
