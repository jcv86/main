'use client';

// Interview Section Component
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff } from 'lucide-react';
import type { InterviewContent, ScoringRule } from '@/lib/a3-modules/types';

interface InterviewSectionProps {
  content: InterviewContent;
  scoring: ScoringRule;
  moduleId: string;
  sectionId: string;
  userId: string;
  onComplete: (score: number) => void;
}

export function InterviewSection({
  content,
  scoring,
  moduleId,
  sectionId,
  userId,
  onComplete,
}: InterviewSectionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Blob | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecording(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('[Recording Error]', error);
      alert('Error al acceder al micrófono');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!recording) {
      alert('Por favor graba una respuesta');
      return;
    }

    try {
      // Convert blob to base64 for API
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const response = await fetch('/api/a3/submit-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            moduleId,
            sectionId,
            response: {
              audioData: base64,
              questionAsked: content.prompt,
            },
            responseType: 'interview',
            sectionContent: content,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit interview');
        }

        const result = await response.json();
        setScore(result.score);
        setSubmitted(true);
        onComplete(result.score);
      };

      reader.readAsDataURL(recording);
    } catch (error) {
      console.error('[Interview Submission Error]', error);
      alert('Error al enviar la respuesta');
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Respuesta Evaluada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{Math.round(score)}%</div>
            <p className="text-muted-foreground">
              Tu respuesta ha sido evaluada por IA
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrevista Grabada</CardTitle>
        <CardDescription>{content.scenario}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Pregunta:</h4>
          <p>{content.prompt}</p>
        </div>

        {/* Recording Status */}
        <div className="text-center">
          {!recording && !isRecording && !recording && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Tiempo máximo: {Math.round(content.recordingTime / 60)} minutos
              </p>
              <Button
                onClick={handleStartRecording}
                size="lg"
                className="bg-[rgba(80,160,170,0.5)]-600 hover:bg-[rgba(80,160,170,0.5)]-700"
              >
                <Mic className="w-4 h-4 mr-2" />
                Comenzar Grabación
              </Button>
            </div>
          )}

          {isRecording && (
            <div className="space-y-4 animate-pulse">
              <div className="inline-block p-4 bg-[rgba(80,160,170,0.5)]-100 rounded-full">
                <Mic className="w-8 h-8 text-[rgb(80,160,170)]-600" />
              </div>
              <p className="text-[rgb(80,160,170)]-600 font-semibold">Grabando...</p>
              <Button
                onClick={handleStopRecording}
                size="lg"
                variant="outline"
              >
                <MicOff className="w-4 h-4 mr-2" />
                Detener Grabación
              </Button>
            </div>
          )}

          {recording && !isRecording && (
            <div className="space-y-4">
              <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-green-600 font-semibold">
                  ✓ Grabación completada
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setRecording(null)}
                >
                  Grabar de Nuevo
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Enviar Respuesta
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-yellow-50 p-4 rounded-lg text-sm">
          <p className="font-semibold mb-2">Consejos:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Habla claramente y con confianza</li>
            <li>• Tómate un momento para pensar antes de responder</li>
            <li>• Usa la estructura STAR si es relevante</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
