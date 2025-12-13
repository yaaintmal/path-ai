import { useState } from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { toast } from 'sonner';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { Slider } from '../../ui/slider';
import {
  GraduationCap,
  BookOpen,
  Users,
  Target,
  Brain,
  Clock,
  Gamepad2,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
} from 'lucide-react';

interface OnboardingData {
  role: string;
  level: string;
  goals: string[];
  subjects: string[];
  skillLevels: Record<string, number>;
  learningType: string[];
  weeklyHours: number;
  schedule: string;
  bestTime: string[];
  gamification: string;
  rewards: string[];
  communicationStyle: string;
}

const steps = [
  { id: 1, title: 'Rolle', icon: GraduationCap },
  { id: 2, title: 'Ziele', icon: Target },
  { id: 3, title: 'Skills', icon: Brain },
  { id: 4, title: 'Typ', icon: BookOpen },
  { id: 5, title: 'Zeit', icon: Clock },
  { id: 6, title: 'Game', icon: Gamepad2 },
  { id: 7, title: 'Stil', icon: MessageSquare },
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({
    role: '',
    level: '',
    goals: [],
    subjects: [],
    skillLevels: {},
    learningType: [],
    weeklyHours: 5,
    schedule: '',
    bestTime: [],
    gamification: '',
    rewards: [],
    communicationStyle: '',
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData({ ...data, [field]: value });
  };

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleComplete = () => {
    setConfirmOpen(true);
  };

  const handleSave = () => {
    localStorage.setItem('onboarddata', JSON.stringify(data));
    setConfirmOpen(false);
    toast.success('Danke! Deine Antworten wurden gespeichert. Weiterleitung zur Startseite...');
    setTimeout(() => {
      window.location.href = '/';
    }, 1200);
  };

  const toggleArrayItem = (field: keyof OnboardingData, item: string) => {
    const currentArray = (data[field] as string[]) || [];
    if (currentArray.includes(item)) {
      updateData(
        field,
        currentArray.filter((i) => i !== item)
      );
    } else {
      updateData(field, [...currentArray, item]);
    }
  };

  return (
    <section className="min-h-screen bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
            <Sparkles className="size-4" />
            <span className="text-sm font-medium">Persönliches Setup</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Dein{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              perfektes Dashboard
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Beantworte ein paar Fragen und wir passen alles an deine Bedürfnisse an.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
            {/* Progress Header */}
            <div className="bg-muted/30 p-6 border-b border-border">
              <div className="flex items-center justify-between mb-6 px-2">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center relative z-10">
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 shadow-sm ${
                        currentStep === step.id
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white scale-110 ring-4 ring-blue-600/20'
                          : currentStep > step.id
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="size-5" />
                      ) : (
                        <step.icon className="size-5" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold hidden md:block ${
                        currentStep === step.id ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2 w-full bg-muted" indicatorClassName="bg-gradient-to-r from-blue-600 to-purple-600" />
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-10 min-h-[400px]">
              {/* Step 1: Role & Context */}
              {currentStep === 1 && <Step1Role data={data} updateData={updateData} />}

              {/* Step 2: Goals */}
              {currentStep === 2 && (
                <Step2Goals data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />
              )}

              {/* Step 3: Skills */}
              {currentStep === 3 && <Step3Skills data={data} updateData={updateData} />}

              {/* Step 4: Learning Type */}
              {currentStep === 4 && (
                <Step4LearningType data={data} toggleArrayItem={toggleArrayItem} />
              )}

              {/* Step 5: Time & Routine */}
              {currentStep === 5 && (
                <Step5Time data={data} updateData={updateData} toggleArrayItem={toggleArrayItem} />
              )}

              {/* Step 6: Gamification */}
              {currentStep === 6 && (
                <Step6Gamification
                  data={data}
                  updateData={updateData}
                  toggleArrayItem={toggleArrayItem}
                />
              )}

              {/* Step 7: Communication Style */}
              {currentStep === 7 && <Step7Communication data={data} updateData={updateData} />}
            </div>

            {/* Footer Navigation */}
            <div className="p-6 bg-muted/30 border-t border-border flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2 hover:bg-background"
              >
                <ArrowLeft className="size-4" />
                Zurück
              </Button>

              <div className="text-sm font-medium text-muted-foreground">
                Schritt {currentStep} von {steps.length}
              </div>

              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  Weiter
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:opacity-90 shadow-lg shadow-blue-600/20"
                >
                  Dashboard erstellen
                  <Check className="size-4" />
                </Button>
              )}
            </div>
          </div>
          
          <SummaryDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            data={data}
            onSave={handleSave}
            onEdit={() => {
              setConfirmOpen(false);
              setCurrentStep(1);
            }}
          />
        </div>
      </div>
    </section>
  );
}

// --- Step Components ---

function Step1Role({ data, updateData }: any) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Welche Rolle hast du?</h2>
        <p className="text-muted-foreground">
          Wir passen das Dashboard sofort an deine Rolle an.
        </p>
      </div>

      <RadioGroup value={data.role} onValueChange={(value) => updateData('role', value)}>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { id: 'student', icon: GraduationCap, label: 'Student', sub: 'Uni & Co.', color: 'text-blue-600' },
            { id: 'pupil', icon: BookOpen, label: 'Schüler', sub: 'Schule', color: 'text-orange-600' },
            { id: 'teacher', icon: Users, label: 'Lehrkraft', sub: 'Dozent', color: 'text-green-600' },
          ].map((item) => (
            <div key={item.id}>
              <RadioGroupItem value={item.id} id={item.id} className="peer sr-only" />
              <Label
                htmlFor={item.id}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-muted bg-card hover:border-primary/50 hover:bg-accent/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all h-full text-center"
              >
                <item.icon className={`size-8 mb-3 ${item.color}`} />
                <div className="font-semibold text-lg mb-1">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.sub}</div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      {data.role && (
        <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-bottom-2">
          <Label className="text-base font-medium">
            {data.role === 'student' && 'Welches Semester?'}
            {data.role === 'pupil' && 'Welche Klassenstufe?'}
            {data.role === 'teacher' && 'Welche Schulart?'}
          </Label>
          <input
            type="text"
            placeholder={
              data.role === 'student'
                ? 'z.B. 3. Semester'
                : data.role === 'pupil'
                  ? 'z.B. 8. Klasse'
                  : 'z.B. Gymnasium'
            }
            value={data.level || ''}
            onChange={(e) => updateData('level', e.target.value)}
            className="w-full p-4 rounded-xl border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}
    </div>
  );
}

function Step2Goals({ data, updateData, toggleArrayItem }: any) {
  const pupilGoals = [
    'Noten verbessern',
    'Grundlagen verstehen',
    'Schneller lernen',
    'Spaß am Lernen',
    'Prüfungsvorbereitung',
    'Hausaufgabenhilfe',
  ];

  const studentGoals = [
    'Prüfungen bestehen',
    'Sehr gute Noten',
    'Fachlich tiefer gehen',
    'Praxisbezug',
    'Effizienter lernen',
    'Lerngruppen finden',
  ];

  const teacherGoals = [
    'Materialerstellung',
    'Differenzierung',
    'Feedback-Prozesse',
    'Lernpfade erstellen',
    'Gamification',
    'Digitale Tools',
  ];

  const goals =
    data.role === 'pupil' ? pupilGoals : data.role === 'student' ? studentGoals : teacherGoals;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Was sind deine Ziele?</h2>
        <p className="text-muted-foreground">
          Wähle alles aus, was auf dich zutrifft.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <div
            key={goal}
            onClick={() => toggleArrayItem('goals', goal)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
              data.goals?.includes(goal)
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/50 hover:bg-accent/50'
            }`}
          >
            <Checkbox checked={data.goals?.includes(goal)} className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
            <span className="font-medium">{goal}</span>
          </div>
        ))}
      </div>

      {(data.role === 'pupil' || data.role === 'student') && (
        <div className="mt-8 space-y-3">
          <Label className="text-base font-medium">
            {data.role === 'pupil'
              ? 'Welche Fächer möchtest du verbessern?'
              : 'Welche Module belegst du aktuell?'}
          </Label>
          <input
            type="text"
            placeholder="z.B. Mathematik, Englisch, Physik"
            value={data.subjects?.join(', ') || ''}
            onChange={(e) =>
              updateData(
                'subjects',
                e.target.value.split(',').map((s: string) => s.trim())
              )
            }
            className="w-full p-4 rounded-xl border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}
    </div>
  );
}

function Step3Skills({ data, updateData }: any) {
  const subjects = data.subjects && data.subjects.length > 0 ? data.subjects : ['Mathematik', 'Englisch', 'Informatik'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Wie schätzt du deine Skills ein?</h2>
        <p className="text-muted-foreground">
          Hilf uns, das richtige Level für dich zu finden.
        </p>
      </div>

      <div className="space-y-8">
        {subjects.slice(0, 3).map((subject: string) => (
          <div key={subject} className="space-y-4 p-6 rounded-2xl border border-border bg-card/50">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">{subject}</Label>
              <Badge variant="secondary" className="text-sm px-3 py-1">Level {data.skillLevels?.[subject] || 3}</Badge>
            </div>
            <Slider
              value={[data.skillLevels?.[subject] || 3]}
              onValueChange={(value) => {
                const newLevels = { ...data.skillLevels, [subject]: value[0] };
                updateData('skillLevels', newLevels);
              }}
              max={5}
              min={1}
              step={1}
              className="w-full py-4"
            />
            <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <span>Anfänger</span>
              <span>Fortgeschritten</span>
              <span>Experte</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 flex gap-3">
        <Sparkles className="size-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Basierend auf deinen Angaben empfehlen wir passende Lernmaterialien und passen die
          Schwierigkeit automatisch an.
        </p>
      </div>
    </div>
  );
}

function Step4LearningType({ data, toggleArrayItem }: any) {
  const learningTypes = [
    { id: 'reading', label: 'Lesen & Schreiben', icon: '📚' },
    { id: 'media', label: 'Videos & Medien', icon: '🎬' },
    { id: 'audio', label: 'Audio & Podcasts', icon: '🎧' },
    { id: 'interactive', label: 'Interaktiv', icon: '✍️' },
    { id: 'games', label: 'Spiele', icon: '🎮' },
    { id: 'group', label: 'Gruppe', icon: '👥' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Wie lernst du am liebsten?</h2>
        <p className="text-muted-foreground">
          Wähle deine bevorzugten Lernmethoden.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {learningTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => toggleArrayItem('learningType', type.id)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-3 ${
              data.learningType?.includes(type.id)
                ? 'border-purple-500 bg-purple-500/5'
                : 'border-muted hover:border-purple-500/30 hover:bg-accent/50'
            }`}
          >
            <span className="text-3xl mb-1">{type.icon}</span>
            <div className="font-medium">{type.label}</div>
            <Checkbox checked={data.learningType?.includes(type.id)} className="sr-only" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Step5Time({ data, updateData, toggleArrayItem }: any) {
  const scheduleTypes = [
    { id: 'fixed', label: 'Feste Zeiten', description: 'Strukturiert' },
    { id: 'flexible', label: 'Spontan', description: 'Flexibel' },
    { id: 'mixed', label: 'Gemischt', description: 'Kombiniert' },
  ];

  const timeSlots = ['Morgens', 'Vormittags', 'Mittags', 'Nachmittags', 'Abends', 'Nachts'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Wann kannst du lernen?</h2>
        <p className="text-muted-foreground">
          Hilf uns, deinen perfekten Lernplan zu erstellen.
        </p>
      </div>

      <div className="space-y-4 p-6 rounded-2xl border border-border bg-card/50">
        <div className="flex justify-between items-center mb-2">
          <Label className="text-base font-medium">Stunden pro Woche</Label>
          <Badge className="bg-primary text-primary-foreground text-base px-3">{data.weeklyHours || 5}h</Badge>
        </div>
        <Slider
          value={[data.weeklyHours || 5]}
          onValueChange={(value) => updateData('weeklyHours', value[0])}
          max={40}
          min={1}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Lernrhythmus</Label>
        <RadioGroup value={data.schedule} onValueChange={(value) => updateData('schedule', value)}>
          <div className="grid md:grid-cols-3 gap-4">
            {scheduleTypes.map((type) => (
              <div key={type.id}>
                <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                <Label
                  htmlFor={type.id}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-muted bg-card hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all text-center h-full"
                >
                  <div className="font-semibold mb-1">{type.label}</div>
                  <div className="text-xs text-muted-foreground">{type.description}</div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Beste Tageszeiten</Label>
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map((slot) => (
            <div
              key={slot}
              onClick={() => toggleArrayItem('bestTime', slot)}
              className={`p-3 text-center rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
                data.bestTime?.includes(slot)
                  ? 'border-green-500 bg-green-500/5 text-green-700 dark:text-green-400'
                  : 'border-muted hover:border-green-500/30'
              }`}
            >
              {slot}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step6Gamification({ data, updateData, toggleArrayItem }: any) {
  const gamificationLevels = [
    { id: 'full', label: 'Voll aktiv!', description: 'Alles nutzen', icon: '🎮' },
    { id: 'light', label: 'Leicht', description: 'Nur Basics', icon: '📊' },
    { id: 'none', label: 'Klassisch', description: 'Ohne', icon: '📚' },
  ];

  const rewardTypes = [
    { id: 'games', label: 'Spiele', icon: '🎯' },
    { id: 'visual', label: 'Visuals', icon: '✨' },
    { id: 'collectibles', label: 'Sammeln', icon: '🏆' },
    { id: 'none', label: 'Keine', icon: '🎓' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Gamification</h2>
        <p className="text-muted-foreground">
          Wie motivierend soll dein Lernerlebnis sein?
        </p>
      </div>

      <RadioGroup
        value={data.gamification}
        onValueChange={(value) => updateData('gamification', value)}
      >
        <div className="grid md:grid-cols-3 gap-4">
          {gamificationLevels.map((level) => (
            <div key={level.id}>
              <RadioGroupItem value={level.id} id={level.id} className="peer sr-only" />
              <Label
                htmlFor={level.id}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-muted bg-card hover:border-yellow-500/50 peer-data-[state=checked]:border-yellow-500 peer-data-[state=checked]:bg-yellow-500/5 cursor-pointer transition-all text-center h-full"
              >
                <span className="text-3xl mb-3">{level.icon}</span>
                <div className="font-semibold mb-1">{level.label}</div>
                <div className="text-xs text-muted-foreground">{level.description}</div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      {data.gamification !== 'none' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <Label className="text-base font-medium">Belohnungen</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {rewardTypes
              .filter((r) => r.id !== 'none' || data.gamification === 'light')
              .map((reward) => (
                <div
                  key={reward.id}
                  onClick={() => toggleArrayItem('rewards', reward.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                    data.rewards?.includes(reward.id)
                      ? 'border-orange-500 bg-orange-500/5'
                      : 'border-muted hover:border-orange-500/30'
                  }`}
                >
                  <span className="text-2xl">{reward.icon}</span>
                  <span className="text-sm font-medium">{reward.label}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Step7Communication({ data, updateData }: any) {
  const communicationStyles = [
    {
      id: 'motivating',
      label: 'Motivierend',
      icon: '😊',
      desc: 'Freundlich & unterstützend',
    },
    {
      id: 'casual',
      label: 'Locker',
      icon: '😄',
      desc: 'Humorvoll & entspannt',
    },
    {
      id: 'professional',
      label: 'Sachlich',
      icon: '💼',
      desc: 'Direkt & effizient',
    },
    {
      id: 'minimal',
      label: 'Minimal',
      icon: '🎯',
      desc: 'Nur das Nötigste',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dein Assistent</h2>
        <p className="text-muted-foreground">
          Wie soll dein AI-Lernbegleiter mit dir sprechen?
        </p>
      </div>

      <RadioGroup
        value={data.communicationStyle}
        onValueChange={(value) => updateData('communicationStyle', value)}
      >
        <div className="grid md:grid-cols-2 gap-4">
          {communicationStyles.map((style) => (
            <div key={style.id}>
              <RadioGroupItem value={style.id} id={style.id} className="peer sr-only" />
              <Label
                htmlFor={style.id}
                className="flex items-center gap-4 p-5 rounded-2xl border-2 border-muted bg-card hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
              >
                <span className="text-3xl bg-muted/50 p-3 rounded-xl">{style.icon}</span>
                <div>
                  <div className="font-semibold text-lg">{style.label}</div>
                  <div className="text-sm text-muted-foreground">{style.desc}</div>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      <div className="p-6 bg-gradient-to-r from-[var(--tw-gradient-from)] via-[var(--tw-gradient-via)] to-purple-600/10 rounded-2xl border border-purple-200/20 flex gap-4 items-start">
        <Sparkles className="size-6 text-purple-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">Fast fertig!</h4>
          <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
            Basierend auf deinen Antworten erstellen wir jetzt dein
            perfekt personalisiertes Dashboard mit individuellen Lernplänen und Empfehlungen.
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryDialog({
  open,
  onOpenChange,
  data,
  onSave,
  onEdit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: Partial<OnboardingData>;
  onSave: () => void;
  onEdit: () => void;
}) {
  const summaryItems = [
    { label: 'Rolle', value: data.role },
    { label: 'Ziele', value: `${data.goals?.length ?? 0} ausgewählt` },
    { label: 'Fächer', value: data.subjects?.join(', ') },
    { label: 'Lerntyp', value: data.learningType?.join(', ') },
    { label: 'Zeit', value: `${data.weeklyHours ?? 5}h / Woche` },
    { label: 'Rhythmus', value: data.schedule },
    { label: 'Gamification', value: data.gamification },
    { label: 'Stil', value: data.communicationStyle },
  ];

  return open ? (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => onOpenChange(false)} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-3xl shadow-2xl p-8 max-w-md w-full z-[101] max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="size-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">Alles korrekt?</h3>
          <p className="text-muted-foreground">Deine Einstellungen im Überblick</p>
        </div>
        
        <div className="space-y-3 mb-8 bg-muted/30 p-4 rounded-2xl">
          {summaryItems.map((item) => (
            <div key={item.label} className="flex justify-between text-sm border-b border-border/50 last:border-0 pb-2 last:pb-0">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-right truncate max-w-[200px]">{item.value || '-'}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onEdit} className="flex-1 h-12 rounded-xl">
            Anpassen
          </Button>
          <Button
            onClick={onSave}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:opacity-90"
          >
            Los geht's!
          </Button>
        </div>
      </div>
    </>
  ) : null;
}
