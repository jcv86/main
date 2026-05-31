'use client';

// Task Section Component
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import type { TaskContent, ScoringRule } from '@/lib/a3-modules/types';

interface TaskSectionProps {
  content: TaskContent;
  scoring: ScoringRule;
  moduleId: string;
  sectionId: string;
  userId: string;
  onComplete: (score: number) => void;
}

export function TaskSection({
  content,
  scoring,
  moduleId,
  sectionId,
  userId,
  onComplete,
}: TaskSectionProps) {
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const apiResponse = await fetch('/api/a3/submit-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          moduleId,
          sectionId,
          response: {
            text: response,
            submissionType: content.submissionType,
          },
          responseType: 'task',
          sectionContent: content,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to submit task');
      }

      const result = await apiResponse.json();
      setScore(result.score);
      setSubmitted(true);
      onComplete(result.score);
    } catch (error) {
      console.error('[Task Submission Error]', error);
      alert('Error al enviar la tarea');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Tarea Evaluada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{Math.round(score)}%</div>
            <p className="text-muted-foreground">
              Tu tarea ha sido evaluada
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarea Práctica</CardTitle>
        <CardDescription>Completa la siguiente tarea</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Instrucciones:</h4>
          <p className="whitespace-pre-wrap">{content.instructions}</p>
        </div>

        {/* Evaluation Criteria */}
        <div>
          <h4 className="font-semibold mb-2">Criterios de Evaluación:</h4>
          <ul className="space-y-2">
            {content.evaluationCriteria.map((criteria, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{criteria}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        {content.resources && content.resources.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Recursos Útiles:</h4>
            <ul className="space-y-1">
              {content.resources.map((resource, i) => (
                <li key={i}>
                  <a href={resource} className="text-sm text-blue-600 hover:underline">
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submission */}
        {content.submissionType === 'text' && (
          <div className="space-y-2">
            <label className="font-semibold text-sm">Tu Respuesta:</label>
            <Textarea
              placeholder="Escribe tu respuesta aquí..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        )}

        {content.submissionType === 'file' && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="font-semibold mb-1">Carga tu archivo</p>
            <p className="text-sm text-muted-foreground">
              Haz clic o arrastra para subir
            </p>
            <input type="file" className="hidden" />
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!response || isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Tarea'}
        </Button>
      </CardContent>
    </Card>
  );
}
