import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Ziele definieren',
    description:
      'Gib an, was du lernen möchtest, welche Vorkenntnisse du hast und wie viel Zeit du investieren kannst.',
  },
  {
    number: '02',
    title: 'KI erstellt deinen Plan',
    description:
      'Unsere KI analysiert deine Angaben und erstellt einen personalisierten Lernplan mit den besten Ressourcen.',
  },
  {
    number: '03',
    title: 'Interaktiv lernen',
    description:
      'Lerne mit hochwertigen Lernmaterialien, interaktiven Übungen und lass dir von der KI bei Fragen helfen.',
  },
  {
    number: '04',
    title: 'Fortschritt verfolgen',
    description:
      'Sieh in deinem Dashboard, was du bereits erreicht hast und was als nächstes kommt.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-br from-blue-50 to-purple-50 py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">So einfach geht's</h2>
          <p className="text-xl text-gray-600">
            In nur vier Schritten zu deinem persönlichen KI-Lernplan
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-md h-full">
                <div className="text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 opacity-50">
                  {step.number}
                </div>
                <h3 className="text-xl mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="size-8 text-blue-600 opacity-30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
