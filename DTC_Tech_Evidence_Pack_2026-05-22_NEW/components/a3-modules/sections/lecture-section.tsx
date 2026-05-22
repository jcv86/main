'use client';

// Lecture Section Component
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import type { LectureContent } from '@/lib/a3-modules/types';

interface LectureSectionProps {
  content: LectureContent;
  onComplete: (score: number) => void;
}

export function LectureSection({ content, onComplete }: LectureSectionProps) {
  const [watched, setWatched] = useState(false);

  const handleComplete = () => {
    setWatched(true);
    onComplete(100); // Lectures don't have scoring
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lección de Video</CardTitle>
        <CardDescription>{content.duration} segundos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Player Placeholder */}
        <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
          <span className="text-white">Video: {Math.round(content.duration / 60)} minutos</span>
        </div>

        {/* Learning Objectives */}
        <div>
          <h4 className="font-semibold mb-2">Objetivos de Aprendizaje:</h4>
          <ul className="space-y-1">
            {content.learningObjectives.map((obj, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                • {obj}
              </li>
            ))}
          </ul>
        </div>

        {/* Key Points */}
        <div>
          <h4 className="font-semibold mb-2">Puntos Clave:</h4>
          <ul className="space-y-1">
            {content.keyPoints.map((point, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                • {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        {content.resources && content.resources.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Recursos:</h4>
            <ul className="space-y-1">
              {content.resources.map((resource, i) => (
                <li key={i}>
                  <a href={resource.url} className="text-sm text-blue-600 hover:underline">
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Completion Button */}
        <Button
          onClick={handleComplete}
          disabled={watched}
          className="w-full"
        >
          {watched ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completado
            </>
          ) : (
            'Marcar como Completado'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
