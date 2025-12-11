import { useState } from 'react';
import { Card } from '../../ui/card';
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
  { id: 1, title: 'role & context', icon: GraduationCap },
  { id: 2, title: 'goals', icon: Target },
  { id: 3, title: 'skills & knowledge', icon: Brain },
  { id: 4, title: 'lerning type', icon: BookOpen },
  { id: 5, title: 'time & routine', icon: Clock },
  { id: 6, title: 'gamification', icon: Gamepad2 },
  { id: 7, title: 'Communication style', icon: MessageSquare },
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
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-4">
            <Sparkles className="size-4" />
            <span className="text-sm">Persönliches Setup</span>
          </div>
          <h1 className="text-4xl md:text-5xl mb-3 dark:text-white">
            Lass uns dein{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              perfektes Dashboard
            </span>{' '}
            erstellen
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Beantworte ein paar Fragen und wir passen alles an deine Bedürfnisse an
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`size-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      currentStep === step.id
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white scale-110'
                        : currentStep > step.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="size-5" />
                    ) : (
                      <step.icon className="size-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs hidden md:block ${currentStep === step.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 dark:bg-gray-800 dark:border-gray-700">
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

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t dark:border-gray-700">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="size-4" />
                Zurück
              </Button>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Schritt {currentStep} von {steps.length}
              </div>

              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="gap-2">
                  Weiter
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
                >
                  Dashboard erstellen
                  <Check className="size-4" />
                </Button>
              )}
            </div>
          </Card>
          <SummaryDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            data={data}
            onSave={handleSave}
          />
        </div>
      </div>
    </section>
  );
}

// Step Components
function Step1Role({ data, updateData }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-2 dark:text-white">Welche Rolle hast du?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Wir passen das Dashboard sofort an deine Rolle an
      </p>

      <RadioGroup value={data.role} onValueChange={(value) => updateData('role', value)}>
        <div className="space-y-3">
          <div
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.role === 'student' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
          >
            <RadioGroupItem value="student" id="student" />
            <Label htmlFor="student" className="flex items-center gap-3 cursor-pointer flex-1">
              <GraduationCap className="size-6 text-blue-600" />
              <div>
                <div className="font-medium dark:text-white">Student / Weiterbildung</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Universität, Ausbildung, Zertifizierungen
                </div>
              </div>
            </Label>
          </div>

          <div
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.role === 'pupil' ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
          >
            <RadioGroupItem value="pupil" id="pupil" />
            <Label htmlFor="pupil" className="flex items-center gap-3 cursor-pointer flex-1">
              <BookOpen className="size-6 text-orange-600" />
              <div>
                <div className="font-medium dark:text-white">Schüler</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Grundschule bis Abitur
                </div>
              </div>
            </Label>
          </div>

          <div
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${data.role === 'teacher' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
          >
            <RadioGroupItem value="teacher" id="teacher" />
            <Label htmlFor="teacher" className="flex items-center gap-3 cursor-pointer flex-1">
              <Users className="size-6 text-green-600" />
              <div>
                <div className="font-medium dark:text-white">Lehrkraft</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Lehrer, Dozent, Trainer
                </div>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>

      {data.role && (
        <div className="mt-6 space-y-4">
          <Label className="dark:text-white">
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
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
    'Spaß am Lernen haben',
    'Prüfungsvorbereitung',
    'Hausaufgabenhilfe',
  ];

  const studentGoals = [
    'Prüfungen bestehen',
    'Sehr gute Noten',
    'Fachlich tiefer gehen',
    'Praktische Anwendung',
    'Schneller verstehen',
    'Zusammen mit anderen lernen',
  ];

  const teacherGoals = [
    'Materialerstellung optimieren',
    'Differenzierung verbessern',
    'Feedback-Prozesse',
    'Individuelle Lernpfade',
    'Gamification einsetzen',
    'Digitale Tools nutzen',
  ];

  const goals =
    data.role === 'pupil' ? pupilGoals : data.role === 'student' ? studentGoals : teacherGoals;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-2 dark:text-white">Was sind deine Ziele?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Wähle alles aus, was auf dich zutrifft (mehrere möglich)
      </p>

      <div className="grid md:grid-cols-2 gap-3">
        {goals.map((goal) => (
          <div
            key={goal}
            onClick={() => toggleArrayItem('goals', goal)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.goals?.includes(goal)
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={data.goals?.includes(goal)} />
              <span className="dark:text-white">{goal}</span>
            </div>
          </div>
        ))}
      </div>

      {(data.role === 'pupil' || data.role === 'student') && (
        <div className="mt-6 space-y-4">
          <Label className="dark:text-white">
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
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}

function Step3Skills({ data, updateData }: any) {
  const subjects = data.subjects || ['Mathematik', 'Englisch', 'Informatik'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-2 dark:text-white">Wie schätzt du deine Skills ein?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Hilf uns, das richtige Level für dich zu finden
      </p>

      <div className="space-y-6">
        {subjects.slice(0, 3).map((subject: string) => (
          <div key={subject} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="dark:text-white">{subject}</Label>
              <Badge variant="outline">Level {data.skillLevels?.[subject] || 3}</Badge>
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
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Anfänger</span>
              <span>Fortgeschritten</span>
              <span>Experte</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          💡 Basierend auf deinen Angaben empfehlen wir passende Lernmaterialien und passen die
          Schwierigkeit automatisch an.
        </p>
      </div>
    </div>
  );
}

function Step4LearningType({ data, toggleArrayItem }: any) {
  const learningTypes = [
    { id: 'reading', label: 'Lesen & Schreiben', icon: '📚' },
    { id: 'media', label: 'Inhalte ansehen', icon: '📚' },
    { id: 'audio', label: 'Hören & Erklärt bekommen', icon: '🎧' },
    { id: 'interactive', label: 'Interaktive Übungen', icon: '✍️' },
    { id: 'games', label: 'Lehrreiche Spiele', icon: '🎮' },
    { id: 'group', label: 'Gruppenarbeit', icon: '👥' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-2 dark:text-white">Wie lernst du am liebsten?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Wähle deine bevorzugten Lernmethoden (mehrere möglich)
      </p>

      <div className="grid md:grid-cols-2 gap-3">
        {learningTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => toggleArrayItem('learningType', type.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.learningType?.includes(type.id)
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{type.icon}</span>
              <div className="flex-1">
                <Checkbox checked={data.learningType?.includes(type.id)} />
                <span className="ml-3 dark:text-white">{type.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <p className="text-sm text-purple-900 dark:text-purple-200">
          🎯 Wir erstellen deinen Lernplan basierend auf deinem bevorzugten Lernstil und stellen
          passende Inhalte zusammen.
        </p>
      </div>
    </div>
  );
}

function Step5Time({ data, updateData, toggleArrayItem }: any) {
  const scheduleTypes = [
    { id: 'fixed', label: 'Feste Lernpläne', description: 'Strukturierte Zeiten' },
    { id: 'flexible', label: 'Spontane Sessions', description: 'Wann ich Zeit habe' },
    { id: 'mixed', label: 'Gemischt', description: 'Beides kombiniert' },
  ];

  const timeSlots = ['Morgens', 'Vormittags', 'Mittags', 'Nachmittags', 'Abends', 'Nachts'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-2 dark:text-white">Wann kannst du lernen?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Hilf uns, deinen perfekten Lernplan zu erstellen
      </p>

      <div className="space-y-4">
        <Label className="dark:text-white">Wie viele Stunden pro Woche?</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[data.weeklyHours || 5]}
            onValueChange={(value) => updateData('weeklyHours', value[0])}
            max={40}
            min={1}
            step={1}
            className="flex-1"
          />
          <Badge className="bg-blue-600 text-white border-0 px-4">{data.weeklyHours || 5}h</Badge>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="dark:text-white">Bevorzugter Lernrhythmus</Label>
        <RadioGroup value={data.schedule} onValueChange={(value) => updateData('schedule', value)}>
          {scheduleTypes.map((type) => (
            <div
              key={type.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                data.schedule === type.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={type.id} id={type.id} />
                <Label htmlFor={type.id} className="cursor-pointer flex-1">
                  <div className="font-medium dark:text-white">{type.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{type.description}</div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label className="dark:text-white">Beste Tageszeiten für dich</Label>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => (
            <div
              key={slot}
              onClick={() => toggleArrayItem('bestTime', slot)}
              className={`p-3 text-center rounded-lg border-2 cursor-pointer transition-all ${
                data.bestTime?.includes(slot)
                  ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <span className="text-sm dark:text-white">{slot}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step6Gamification({ data, updateData, toggleArrayItem }: any) {
  const gamificationLevels = [
    { id: 'full', label: 'Ja, voll aktiv!', description: 'Alle Features nutzen', icon: '🎮' },
    { id: 'light', label: 'Leicht', description: 'Nur Fortschritt & Level', icon: '📊' },
    { id: 'none', label: 'Nein, lieber klassisch', description: 'Ohne Gamification', icon: '📚' },
  ];

  const rewardTypes = [
    { id: 'games', label: 'Fortschritt in Spielen', icon: '🎯' },
    { id: 'visual', label: 'Visuelle Belohnungen', icon: '✨' },
    { id: 'collectibles', label: 'Sammelobjekte', icon: '🏆' },
    { id: 'none', label: 'Keine Belohnungen nötig', icon: '🎓' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-2 dark:text-white">Gamification-Einstellungen</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Wie motivierend soll dein Lernerlebnis sein?
      </p>

      <div className="space-y-3">
        <Label className="dark:text-white">Gamification-Level</Label>
        <RadioGroup
          value={data.gamification}
          onValueChange={(value) => updateData('gamification', value)}
        >
          {gamificationLevels.map((level) => (
            <div
              key={level.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                data.gamification === level.id
                  ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={level.id} id={level.id} />
                <span className="text-2xl">{level.icon}</span>
                <Label htmlFor={level.id} className="cursor-pointer flex-1">
                  <div className="font-medium dark:text-white">{level.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {level.description}
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {data.gamification !== 'none' && (
        <div className="space-y-3">
          <Label className="dark:text-white">Welche Belohnungen motivieren dich?</Label>
          <div className="grid md:grid-cols-2 gap-3">
            {rewardTypes
              .filter((r) => r.id !== 'none' || data.gamification === 'light')
              .map((reward) => (
                <div
                  key={reward.id}
                  onClick={() => toggleArrayItem('rewards', reward.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    data.rewards?.includes(reward.id)
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <div className="flex-1">
                      <Checkbox checked={data.rewards?.includes(reward.id)} />
                      <span className="ml-3 dark:text-white">{reward.label}</span>
                    </div>
                  </div>
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
      label: 'Motivierend & freundlich',
      icon: '😊',
      example: '"Du machst das super! Lass uns gemeinsam das nächste Kapitel angehen!"',
    },
    {
      id: 'casual',
      label: 'Locker & humorvoll',
      icon: '😄',
      example: '"Nice! Du rockst das! Weiter geht\'s mit dem nächsten Level 🚀"',
    },
    {
      id: 'professional',
      label: 'Sachlich & direkt',
      icon: '💼',
      example: '"Kapitel abgeschlossen. Nächster Schritt: Übungsaufgaben bearbeiten."',
    },
    {
      id: 'minimal',
      label: 'Sehr ruhig & minimalistisch',
      icon: '🎯',
      example: '"Fortschritt gespeichert. Weiter."',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-2 dark:text-white">Wie soll dein Assistent mit dir sprechen?</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Wähle den Kommunikationsstil, der am besten zu dir passt
      </p>

      <RadioGroup
        value={data.communicationStyle}
        onValueChange={(value) => updateData('communicationStyle', value)}
      >
        {communicationStyles.map((style) => (
          <div
            key={style.id}
            className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
              data.communicationStyle === style.id
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <RadioGroupItem value={style.id} id={style.id} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={style.id} className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{style.icon}</span>
                    <span className="font-medium dark:text-white">{style.label}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {style.example}
                  </div>
                </Label>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <Sparkles className="size-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-900 dark:text-purple-200">
            <strong>Fast fertig!</strong> Basierend auf deinen Antworten erstellen wir jetzt dein
            perfekt personalisiertes Dashboard mit individuellen Lernplänen und Empfehlungen.
          </div>
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
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: Partial<OnboardingData>;
  onSave: () => void;
}) {
  const summary = [
    `Rolle: ${data.role ?? '-'}`,
    `Ziele: ${data.goals?.length ?? 0}`,
    `Fächer: ${data.subjects?.join(', ') ?? '-'}`,
    `Lerntyp: ${data.learningType?.join(', ') ?? '-'}`,
    `Stunden pro Woche: ${data.weeklyHours ?? 5}`,
    `Bevorzugter Lernrhythmus: ${data.schedule ?? '-'}`,
    `Beste Tageszeiten: ${data.bestTime?.join(', ') ?? '-'}`,
    `Gamification: ${data.gamification ?? '-'}`,
    `Belohnungen: ${data.rewards?.join(', ') ?? '-'}`,
    `Kommunikation: ${data.communicationStyle ?? '-'}`,
  ].join('\n');

  return open ? (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => onOpenChange(false)} />
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 max-w-md w-full z-50 max-h-[80vh] overflow-auto">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Zusammenfassung deiner Angaben
        </h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          <pre className="whitespace-pre-wrap">{summary}</pre>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0"
          >
            Speichern
          </Button>
        </div>
      </div>
    </>
  ) : null;
}
