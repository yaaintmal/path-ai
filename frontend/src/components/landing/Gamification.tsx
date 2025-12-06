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
  Crown,
  Target,
  Users,
  Palette,
  FileText,
  Layout,
  Gift,
  TrendingUp,
  Lock,
  Unlock,
  Lightbulb,
  Rocket,
} from 'lucide-react';

const studentAchievements = [
  { icon: '🔥', name: '7-Tage-Streak', points: 100, unlocked: true },
  { icon: '🎯', name: 'Perfekte Woche', points: 200, unlocked: true },
  { icon: '📚', name: 'Bücherwurm', points: 150, unlocked: false },
  { icon: '⚡', name: 'Speed Learner', points: 250, unlocked: true },
  { icon: '🏆', name: 'Champion', points: 500, unlocked: false },
  { icon: '💎', name: 'Diamant Status', points: 1000, unlocked: false },
];

const avatarItems = [
  { icon: '👨‍🎓', name: 'Student Avatar', price: 500, category: 'avatar' },
  { icon: '🦸‍♂️', name: 'Superheld', price: 1000, category: 'avatar' },
  { icon: '🧙‍♂️', name: 'Magier', price: 1500, category: 'avatar' },
  { icon: '🌟', name: 'Gold Badge', price: 300, category: 'badge' },
  { icon: '💫', name: 'Stern Badge', price: 400, category: 'badge' },
  { icon: '🎨', name: 'Neon Theme', price: 800, category: 'theme' },
];

const teacherRewards = [
  {
    icon: Users,
    title: 'Kollaborations-Badge',
    description: 'Für erfolgreiche Teamarbeit mit Kollegen',
    type: 'Badge',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    icon: FileText,
    title: 'Premium Templates',
    description: 'Exklusive Vorlagen für Unterrichtseinheiten',
    type: 'Template',
    color: 'from-purple-600 to-pink-600',
  },
  {
    icon: Layout,
    title: 'Custom Klassenräume',
    description: 'Individualisierbare digitale Lernumgebungen',
    type: 'Feature',
    color: 'from-green-600 to-emerald-600',
  },
  {
    icon: Sparkles,
    title: 'KI-Boost',
    description: 'Erweiterte KI-Funktionen für Unterrichtsvorbereitung',
    type: 'Upgrade',
    color: 'from-orange-600 to-red-600',
  },
];

export function Gamification() {
  const [selectedTab, setSelectedTab] = useState('students');
  const [studentPoints] = useState(2450);

  return (
    <section className="container mx-auto px-4 py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0 mb-4">
          <Gamepad2 className="size-4 mr-2" />
          Gamification
        </Badge>
        <h2 className="text-4xl md:text-5xl mb-4">
          Lernen wird zum{' '}
          <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Abenteuer
          </span>
        </h2>
        <p className="text-xl text-gray-600">
          Bleib motiviert mit Achievements, Punkten und Belohnungen - für Schüler, Studenten und
          Lehrkräfte
        </p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
          <TabsTrigger value="students" className="gap-2">
            <Trophy className="size-4" />
            Schüler & Studenten
          </TabsTrigger>
          <TabsTrigger value="teachers" className="gap-2">
            <Award className="size-4" />
            Lehrkräfte
          </TabsTrigger>
        </TabsList>

        {/* Students & Pupils Gamification */}
        <TabsContent value="students" className="mt-0">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Points & Achievements */}
            <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Deine Punkte</div>
                  <div className="text-4xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {studentPoints.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-4 rounded-2xl">
                  <Star className="size-8 text-white" />
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-yellow-600" />
                    <span className="text-sm">Aufgabe abgeschlossen</span>
                  </div>
                  <Badge className="bg-yellow-600 text-white border-0">+50</Badge>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="size-4 text-orange-600" />
                    <span className="text-sm">Streak-Bonus</span>
                  </div>
                  <Badge className="bg-orange-600 text-white border-0">+100</Badge>
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Target className="size-4 text-green-600" />
                    <span className="text-sm">Wochenziel erreicht</span>
                  </div>
                  <Badge className="bg-green-600 text-white border-0">+200</Badge>
                </div>
              </div>

              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Award className="size-5 text-yellow-600" />
                Deine Achievements
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {studentAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`relative p-4 rounded-xl text-center ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-600 to-orange-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <div className="text-3xl mb-1">{achievement.icon}</div>
                    <div className="text-xs text-white">{achievement.points}</div>
                    {!achievement.unlocked && (
                      <Lock className="absolute top-2 right-2 size-3 text-gray-500" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Rewards Shop */}
            <Card className="p-8">
              <h3 className="text-2xl mb-4 flex items-center gap-2">
                <Gift className="size-6 text-purple-600" />
                Belohnungs-Shop
              </h3>
              <p className="text-gray-600 mb-6">Tausche deine Punkte gegen coole Items ein!</p>

              <div className="space-y-3 mb-6">
                {avatarItems.slice(0, 4).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{item.icon}</div>
                      <div>
                        <div className="text-sm">{item.name}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="size-4 text-yellow-600" />
                      <span className="text-sm">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                Zum Shop
              </Button>
            </Card>
          </div>

          {/* Game Features */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 size-16 rounded-2xl flex items-center justify-center mb-4">
                <Lightbulb className="size-8 text-white" />
              </div>
              <h3 className="text-2xl mb-3">Tipps & Lösungen</h3>
              <p className="text-gray-600 mb-4">
                Steckst du fest? Nutze Punkte für hilfreiche Tipps oder die komplette Lösung.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>💡 Kleiner Tipp</span>
                  <Badge variant="outline">50 Punkte</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>💭 Ausführlicher Hinweis</span>
                  <Badge variant="outline">100 Punkte</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>✅ Komplette Lösung</span>
                  <Badge variant="outline">200 Punkte</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 size-16 rounded-2xl flex items-center justify-center mb-4">
                <Gamepad2 className="size-8 text-white" />
              </div>
              <h3 className="text-2xl mb-3">Lern-Spiele</h3>
              <p className="text-gray-600 mb-4">
                Nimm an Spielen teil, level deine Spielfigur und schalte neue Inhalte frei!
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="text-2xl">🎮</div>
                  <div className="flex-1">
                    <div className="text-sm">Quest Mode</div>
                    <div className="text-xs text-gray-600">Level 12 • 85% XP</div>
                  </div>
                  <TrendingUp className="size-4 text-green-600" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="text-2xl">⚔️</div>
                  <div className="flex-1">
                    <div className="text-sm">Battle Arena</div>
                    <div className="text-xs text-gray-600">5 Siege diese Woche</div>
                  </div>
                  <Crown className="size-4 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 size-16 rounded-2xl flex items-center justify-center mb-4">
                <Palette className="size-8 text-white" />
              </div>
              <h3 className="text-2xl mb-3">Lernraum-Design</h3>
              <p className="text-gray-600 mb-4">
                Gestalte deinen persönlichen Lernraum mit individuellen Themes und Designs.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {['🌙 Dark', '🌸 Sakura', '🌊 Ocean', '🔥 Fire', '❄️ Ice', '🌈 Rainbow'].map(
                  (theme, i) => (
                    <div key={i} className="p-2 bg-white rounded-lg text-center text-xs">
                      {theme}
                    </div>
                  )
                )}
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
              <div className="bg-gradient-to-br from-orange-600 to-red-600 size-16 rounded-2xl flex items-center justify-center mb-4">
                <Rocket className="size-8 text-white" />
              </div>
              <h3 className="text-2xl mb-3">Charaktere & Items</h3>
              <p className="text-gray-600 mb-4">
                Schalte neue Avatare, Badges und spezielle Items frei, um dich von anderen
                abzuheben.
              </p>
              <div className="flex items-center justify-around text-center">
                <div>
                  <div className="text-2xl mb-1">👕</div>
                  <div className="text-xs text-gray-600">12 Outfits</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">🎭</div>
                  <div className="text-xs text-gray-600">8 Masken</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">✨</div>
                  <div className="text-xs text-gray-600">15 Effekte</div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Teachers Gamification */}
        <TabsContent value="teachers" className="mt-0">
          <div className="max-w-5xl mx-auto">
            <Card className="p-8 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl mb-2">Professionelles Gamification-System</h3>
                <p className="text-gray-600">
                  Verdiene Belohnungen für herausragende Leistungen und schalte exklusive Features
                  frei
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                {teacherRewards.map((reward, index) => (
                  <Card
                    key={index}
                    className="p-6 text-center hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div
                      className={`bg-gradient-to-br ${reward.color} size-16 rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <reward.icon className="size-8 text-white" />
                    </div>
                    <Badge className="mb-3" variant="secondary">
                      {reward.type}
                    </Badge>
                    <h4 className="text-sm mb-2">{reward.title}</h4>
                    <p className="text-xs text-gray-600">{reward.description}</p>
                  </Card>
                ))}
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Collaboration Badges */}
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl">
                    <Users className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl">Kollaborations-Badges</h3>
                    <p className="text-sm text-gray-600">Für erfolgreiche Teamarbeit</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="text-2xl">🤝</div>
                    <div className="flex-1">
                      <div className="text-sm">Team Player</div>
                      <div className="text-xs text-gray-600">3 gemeinsame Projekte</div>
                    </div>
                    <Unlock className="size-4 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="text-2xl">💡</div>
                    <div className="flex-1">
                      <div className="text-sm">Innovator</div>
                      <div className="text-xs text-gray-600">5 neue Unterrichtsideen geteilt</div>
                    </div>
                    <Unlock className="size-4 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
                    <div className="text-2xl">🌟</div>
                    <div className="flex-1">
                      <div className="text-sm">Master Collaborator</div>
                      <div className="text-xs text-gray-600">10 Fachbereichs-Projekte</div>
                    </div>
                    <Lock className="size-4 text-gray-400" />
                  </div>
                </div>
              </Card>

              {/* Premium Templates */}
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl">
                    <FileText className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl">Exklusive Templates</h3>
                    <p className="text-sm text-gray-600">Für Unterrichtsvorbereitung</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'MINT-Unterrichtseinheit', icon: '🔬', unlocked: true },
                    { name: 'Projektbasiertes Lernen', icon: '📊', unlocked: true },
                    { name: 'Gamified Lerneinheit', icon: '🎮', unlocked: true },
                    { name: 'Digitales Klassenzimmer', icon: '💻', unlocked: false },
                  ].map((template, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-4 rounded-lg border ${
                        template.unlocked
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="text-2xl">{template.icon}</div>
                      <div className="flex-1">
                        <div className="text-sm">{template.name}</div>
                      </div>
                      {template.unlocked ? (
                        <Unlock className="size-4 text-purple-600" />
                      ) : (
                        <Lock className="size-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Custom Classrooms */}
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl">
                    <Layout className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl">Custom Klassenräume</h3>
                    <p className="text-sm text-gray-600">Individualisierbare Lernumgebungen</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm">Klasse 8b - Mathematik</span>
                      <Badge className="bg-green-600 text-white border-0">Aktiv</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div className="bg-white rounded p-2">📊 Dashboard</div>
                      <div className="bg-white rounded p-2">🎨 Theme: Blau</div>
                      <div className="bg-white rounded p-2">👥 24 Schüler</div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Neuen Klassenraum erstellen
                  </Button>
                </div>
              </Card>

              {/* Unit Templates */}
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-orange-600 to-red-600 p-3 rounded-xl">
                    <Sparkles className="size-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl">KI-Template Generator</h3>
                    <p className="text-sm text-gray-600">Für Unterrichtseinheiten</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="text-sm text-gray-600">
                    Erstelle in Sekunden komplette Unterrichtseinheiten:
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded">45 Min</div>
                    <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded">90 Min</div>
                    <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded">
                      Doppelstunde
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
                  Template erstellen
                </Button>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
