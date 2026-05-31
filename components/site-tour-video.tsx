import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function SiteTourVideo() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const frames = [
    // A3 Intro Section
    { image: '/tour-videos/a3-main-intro.png', title: 'A3 Entrenamiento - "Ruta de Entrenamiento Nivel Básico"', duration: 6 },
    { image: '/tour-videos/a3-intro-modules.png', title: 'Viaje de 3 Meses (Mes 1: Fundamentos, Mes 2: Aceleración, Mes 3: Dominio)', duration: 5 },
    { image: '/tour-videos/a3-10-modules.png', title: 'Ruta Completa de 10 Módulos (90 tareas, 0% progreso)', duration: 6 },
    { image: '/tour-videos/a3-simulations-menu.png', title: 'Opciones Nivel Avanzado & Módulo 1: Espejo de Carrera', duration: 6 },
    
    // A3 Training Modules Detail
    { image: '/tour-videos/a3-all-modules.png', title: 'Módulos 2-3: Laboratorio de Minería de Valor & Constructor CV', duration: 6 },
    { image: '/tour-videos/a3-interview-modules.png', title: 'Módulos 4-5: Decodificador de Ofertas & Arquitectura de Respuestas (STAR/CAR)', duration: 6 },
    { image: '/tour-videos/a3-interview-sim-modules.png', title: 'Módulos 6-7: Sala del Coach & Gimnasio de Comunicación', duration: 6 },
    { image: '/tour-videos/a3-final-modules.png', title: 'Módulos 8-9: Simulación con Reclutador & Laboratorio de Preguntas Difíciles', duration: 6 },
    { image: '/tour-videos/a3-module-10.png', title: 'Módulo 10: Misión de Entrevista Básica (Certificación Final - 220 XP)', duration: 6 },
    
    // Interview & Coaching Sections
    { image: '/tour-videos/coach-practice-room.png', title: 'Sala de Práctica del Coach - Entrenamiento Interactivo de Entrevistas', duration: 7 },
    { image: '/tour-videos/coach-questions.png', title: 'Pregunta 1: "Cuéntame sobre ti" con Retroalimentación del Coach IA', duration: 8 },
    { image: '/tour-videos/coach-more-questions.png', title: 'Entrenamiento de Entrevistas con Criterios de Evaluación y Campo de Respuesta', duration: 8 },
    { image: '/tour-videos/a3-second-question.png', title: 'Las 3 Preguntas de Entrevista: Personal + Motivación + Historia de Desafío', duration: 7 },
    
    // CV Builder & Completion
    { image: '/tour-videos/a3-cv-builder.png', title: 'Estudio Constructor CV - Construcción de Documentos Optimizada para ATS', duration: 6 },
    { image: '/tour-videos/a3-cv-content.png', title: 'Contenido del Módulo CV con Consejos de Email Profesional y LinkedIn', duration: 6 },
  ];

  const totalDuration = frames.reduce((sum, f) => sum + f.duration, 0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 3000); // Change frame every 3 seconds

    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  const progressPercent = ((currentFrame + 1) / frames.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Video Display */}
      <div className="relative bg-background/50">
        <img 
          src={frames[currentFrame].image} 
          alt={frames[currentFrame].title}
          className="w-full h-auto"
        />
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
          <h3 className="text-white font-semibold">{frames[currentFrame].title}</h3>
          <p className="text-white/70 text-sm">
            Fotograma {currentFrame + 1} de {frames.length} • {totalDuration}s total
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/20">
        <div 
          className="h-full bg-gradient-to-r from-[rgb(80,160,170)] to-[rgb(170,70,170)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="bg-black/80 p-4 space-y-3">
        {/* Frame Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {frames.map((frame, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentFrame(idx)}
              className={`flex-shrink-0 h-12 w-12 rounded border-2 transition-all ${
                idx === currentFrame 
                  ? 'border-[rgb(80,160,170)] scale-105' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              title={frame.title}
            >
              <img 
                src={frame.image} 
                alt={`Frame ${idx + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-[rgb(80,160,170)] hover:bg-[rgb(80,160,170)]/80 text-white transition-all"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              title={isMuted ? 'Habilitar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
          <div className="text-white/70 text-sm">
            {frames[currentFrame].duration}s
          </div>
        </div>

        {/* Info */}
        <div className="text-white/60 text-xs space-y-1">
          <p>🎯 <span className="text-white">Contenido del Recorrido:</span> Login • Dashboard • Módulo A3 • Sala del Coach • Preguntas de Entrevista • Constructor CV</p>
          <p>⏱️ <span className="text-white">Duración Total:</span> {totalDuration} segundos • 16 fotogramas principales</p>
          <p>📍 <span className="text-white">Áreas de Enfoque:</span> Sistema de entrevistas con Coach IA y Módulo A3 Entrenamiento</p>
        </div>
      </div>
    </div>
  );
}
