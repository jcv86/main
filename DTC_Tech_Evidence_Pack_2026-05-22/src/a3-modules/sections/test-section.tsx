'use client';

// Test Section Component
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { TestContent, ScoringRule } from '@/lib/a3-modules/types';

interface TestSectionProps {
  content: TestContent;
  scoring: ScoringRule;
  moduleId: string;
  sectionId: string;
  userId: string;
  onComplete: (score: number) => void;
}

export function TestSection({
  content,
  scoring,
  moduleId,
  sectionId,
  userId,
  onComplete,
}: TestSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = content.questions[currentQuestionIndex];
  const answered = currentQuestionIndex in answers;

  const handleAnswerChange = useCallback((answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < content.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, content.questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Submit responses for evaluation
      const response = await fetch('/api/a3/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          moduleId,
          sectionId,
          response: {
            answers: Object.values(answers),
            questionCount: content.questions.length,
          },
          responseType: 'multiple-choice-test',
          sectionContent: content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit test');
      }

      const result = await response.json();
      setScore(result.score);
      setSubmitted(true);
      onComplete(result.score);
    } catch (error) {
      console.error('[Test Submission Error]', error);
      alert('Error al enviar el test. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, content.questions.length, moduleId, sectionId, userId, onComplete]);

  if (submitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Resultados del Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="text-4xl font-bold">{Math.round(score)}%</div>
          <p className="text-muted-foreground">
            {score >= content.passingScore
              ? '¡Aprobaste!'
              : `Necesitas ${content.passingScore}% para aprobar`}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pregunta {currentQuestionIndex + 1} de {content.questions.length}</CardTitle>
        <CardDescription>{currentQuestion.question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <RadioGroup value={answers[currentQuestionIndex] || ''} onValueChange={handleAnswerChange}>
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                  <Label htmlFor={`option-${i}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}

        {currentQuestion.type === 'free-response' && (
          <Textarea
            placeholder="Escribe tu respuesta aquí..."
            value={answers[currentQuestionIndex] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="min-h-[120px]"
          />
        )}

        {/* Hints */}
        {currentQuestion.hints && currentQuestion.hints.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm font-semibold mb-2">Sugerencia:</p>
            <p className="text-sm">{currentQuestion.hints[0]}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Anterior
          </Button>

          {currentQuestionIndex < content.questions.length - 1 ? (
            <Button onClick={handleNext} disabled={!answered}>
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!answered || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Test'}
            </Button>
          )}
        </div>

        {/* Progress */}
        <div className="text-xs text-muted-foreground text-center">
          {Object.keys(answers).length} de {content.questions.length} preguntas respondidas
        </div>
      </CardContent>
    </Card>
  );
}
