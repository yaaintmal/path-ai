import { ArrowLeft, CheckCircle2, Circle, Hammer, Lightbulb, type LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import roadmapData from '../data/roadmap.json';

interface RoadmapPageProps {
  onBack: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Hammer,
  Circle,
  Lightbulb,
  CheckCircle2,
};

export function RoadmapPage({ onBack }: RoadmapPageProps) {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button variant="ghost" onClick={onBack} className="mb-8 hover:bg-secondary/50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Roadmap
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-600 rounded-full" />
            <p className="text-muted-foreground text-lg max-w-2xl">
              See what we are working on, what's coming next, and how we are improving Path AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmapData.map((section) => {
              const Icon = iconMap[section.iconName] || Circle;
              return (
                <div key={section.id} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={`h-5 w-5 ${section.color}`} />
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <Badge variant="secondary" className="ml-auto">
                      {section.items.length}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {section.items.map((item, i) => (
                      <Card
                        key={i}
                        className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-border/80 transition-colors"
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-base font-medium leading-tight">
                              {item.title}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <CardDescription className="text-xs mb-3">
                            {item.description}
                          </CardDescription>
                          <Badge variant="outline" className="text-[10px] px-2 py-0 h-5">
                            {item.tag}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
