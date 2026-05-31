'use client';

// Main Module Frame Component - orchestrates the module experience
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Module, Section, LectureContent, TestContent, InterviewContent, TaskContent } from '@/lib/a3-modules/types';
import { LectureSection } from './sections/lecture-section';
import { TestSection } from './sections/test-section';
import { InterviewSection } from './sections/interview-section';
import { TaskSection } from './sections/task-section';

interface ModuleFrameProps {
  module: Module;
  userId: string;
  onComplete?: (score: number) => void;
  onProgress?: (sectionId: string, score: number) => void;
}

export function ModuleFrame({ module, userId, onComplete, onProgress }: ModuleFrameProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionScores, setSectionScores] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const currentSection = module.sections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / module.sections.length) * 100;

  // Handle section completion with score
  const handleSectionComplete = useCallback(
    (sectionId: string, score: number) => {
      setSectionScores((prev) => ({
        ...prev,
        [sectionId]: score,
      }));

      onProgress?.(sectionId, score);

      // Move to next section or complete module
      if (currentSectionIndex < module.sections.length - 1) {
        setCurrentSectionIndex((prev) => prev + 1);
      } else {
        completeModule();
      }
    },
    [currentSectionIndex, module.sections.length, onProgress]
  );

  const completeModule = useCallback(() => {
    // Calculate weighted final score
    const requiredSections = module.sections.filter((s) => s.required);
    const totalScore =
      requiredSections.length > 0
        ? requiredSections.reduce((sum, section) => {
            const score = sectionScores[section.id] || 0;
            const weight = section.scoring.maxPoints / 100;
            return sum + score * weight;
          }, 0) / requiredSections.length
        : 0;

    setFinalScore(totalScore);
    setIsCompleted(true);
    onComplete?.(totalScore);
  }, [module.sections, sectionScores, onComplete]);

  // Skip to next section
  const handleSkip = useCallback(() => {
    if (currentSectionIndex < module.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
    } else {
      completeModule();
    }
  }, [currentSectionIndex, module.sections.length, completeModule]);

  // Go back to previous section
  const handlePrevious = useCallback(() => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  }, [currentSectionIndex]);

  if (isCompleted) {
    return <ModuleCompletionCard module={module} finalScore={finalScore} />;
  }

  return (
    <div className="w-full space-y-6">
      {/* Module Header */}
      <Card>
        <CardHeader>
          <CardTitle>{module.name}</CardTitle>
          <CardDescription>{module.description}</CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Sección {currentSectionIndex + 1} de {module.sections.length}
          </span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Current Section */}
      <div className="min-h-[400px]">
        <SectionRenderer
          section={currentSection}
          moduleId={module.id}
          userId={userId}
          onComplete={handleSectionComplete}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
        >
          Anterior
        </Button>

        <div className="space-x-2">
          {!currentSection.required && (
            <Button variant="outline" onClick={handleSkip}>
              Saltar
            </Button>
          )}
          <Button
            onClick={() => handleSectionComplete(currentSection.id, 0)}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}

// Section Renderer - determines which component to render
interface SectionRendererProps {
  section: Section;
  moduleId: string;
  userId: string;
  onComplete: (sectionId: string, score: number) => void;
}

function SectionRenderer({
  section,
  moduleId,
  userId,
  onComplete,
}: SectionRendererProps) {
  const handleComplete = useCallback(
    (score: number) => {
      onComplete(section.id, score);
    },
    [section.id, onComplete]
  );

  switch (section.type) {
    case 'lecture':
      return (
        <LectureSection
          content={section.content as LectureContent}
          onComplete={handleComplete}
        />
      );
    case 'test':
      return (
        <TestSection
          content={section.content as TestContent}
          scoring={section.scoring}
          moduleId={moduleId}
          sectionId={section.id}
          userId={userId}
          onComplete={handleComplete}
        />
      );
    case 'interview':
      return (
        <InterviewSection
          content={section.content as InterviewContent}
          scoring={section.scoring}
          moduleId={moduleId}
          sectionId={section.id}
          userId={userId}
          onComplete={handleComplete}
        />
      );
    case 'task':
      return (
        <TaskSection
          content={section.content as TaskContent}
          scoring={section.scoring}
          moduleId={moduleId}
          sectionId={section.id}
          userId={userId}
          onComplete={handleComplete}
        />
      );
    default:
      return <div>Unknown section type</div>;
  }
}

// Module Completion Card
interface ModuleCompletionCardProps {
  module: Module;
  finalScore: number;
}

function ModuleCompletionCard({
  module,
  finalScore,
}: ModuleCompletionCardProps) {
  const isPassing = finalScore >= module.passingScore;
  const xpEarned = isPassing ? module.xp : 0;

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isPassing ? '¡Módulo Completado!' : 'Módulo No Aprobado'}
        </CardTitle>
        <CardDescription>
          {isPassing
            ? 'Avanzaste con éxito'
            : 'Necesitas mejorar para aprobar'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-accent rounded-lg">
            <div className="text-3xl font-bold">{Math.round(finalScore)}%</div>
            <div className="text-sm text-muted-foreground">Puntuación</div>
          </div>
          <div className="p-4 bg-accent rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">{xpEarned} XP</div>
            <div className="text-sm text-muted-foreground">Ganados</div>
          </div>
        </div>

        {isPassing ? (
          <div className="text-center text-sm text-green-600">
            ¡Aprobaste! Has ganado {xpEarned} XP. Ahora puedes acceder a los
            siguientes módulos.
          </div>
        ) : (
          <div className="text-center text-sm text-orange-600">
            Necesitas {module.passingScore}% para aprobar. Intenta nuevamente.
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Ver Retroalimentación
          </Button>
          <Button className="flex-1">
            {module.allowRetakes && !isPassing ? 'Reintentar' : 'Ir al Dashboard'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
