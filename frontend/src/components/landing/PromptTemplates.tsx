import { useState } from 'react';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { BookOpen, Clock, BarChart, ArrowRight, Code, Cloud, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LEARNING_TEMPLATES } from '../../data/learningTemplates';

export function PromptTemplates() {
  const { t } = useTranslation('landing');
  const [selectedTemplate, setSelectedTemplate] = useState(LEARNING_TEMPLATES[0]);

  return (
    <section id="templates" className="container mx-auto px-4 py-20 md:py-32 bg-background">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 mb-4">
          <BookOpen className="size-4 mr-2" />
          {t('prompttemplates.badge')}
        </Badge>
        <h2 className="text-4xl md:text-5xl mb-4">
          {t('prompttemplates.headingPart1')}{' '}
          <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t('prompttemplates.headingHighlight')}
          </span>
        </h2>
        <p className="text-xl text-muted-foreground">{t('prompttemplates.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Template List */}
        <div className="lg:col-span-4 space-y-4">
          {LEARNING_TEMPLATES.slice(0, 4).map((template) => (
            <Card
              key={template.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate.id === template.id
                  ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10 ring-1 ring-green-500'
                  : 'hover:border-green-200 dark:hover:border-green-800'
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-background">
                  {template.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" /> {template.duration}
                </span>
              </div>
              <h3 className="font-semibold mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
            </Card>
          ))}
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-8">
          <Card className="p-8 h-full border-2 border-muted/50 bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <Code className="size-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedTemplate.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <BarChart className="size-4" /> {selectedTemplate.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-4" /> {selectedTemplate.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground">{selectedTemplate.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Database className="size-4 text-green-500" />
                    {t('prompttemplates.overviewTitle')}
                  </h4>
                  <ul className="space-y-3">
                    {selectedTemplate.topics.slice(0, 6).map((topic, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="mt-1 min-w-4 size-4 rounded-full border border-green-500 flex items-center justify-center">
                          <div className="size-2 rounded-full bg-green-500" />
                        </div>
                        {topic}
                      </li>
                    ))}
                    {selectedTemplate.topics.length > 6 && (
                      <li className="text-sm text-muted-foreground pl-6">
                        {t('prompttemplates.moreTopics', {
                          count: selectedTemplate.topics.length - 6,
                        })}
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Cloud className="size-4 text-blue-500" />
                    {t('prompttemplates.skillsTitle')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-secondary/50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-border flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                  {t('prompttemplates.cta.start')} <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
