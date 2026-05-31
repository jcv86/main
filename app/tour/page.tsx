'use client';

import SiteTourVideo from '@/components/site-tour-video';

export default function TourPage() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            Recorrido Completo de la Plataforma - 120 Segundos
          </h1>
          <p className="text-white/70 text-lg">
            Demostración completa del módulo A3 Entrenamiento y el Sistema de Entrevistas con Coach de IA
          </p>
        </div>

        {/* Video Player */}
        <SiteTourVideo />

        {/* Sections Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Secciones del Recorrido</h2>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">1.</span>
                <span><strong>Introducción A3</strong> - Vista completa del programa de entrenamiento (Ruta Nivel Básico)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">2.</span>
                <span><strong>Viaje de 3 Meses</strong> - Mes 1 (Fundamentos), Mes 2 (Aceleración), Mes 3 (Dominio)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">3.</span>
                <span><strong>10 Módulos de Entrenamiento</strong> - Ruta completa: 90 tareas, 1,340 XP, opciones avanzadas</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">4.</span>
                <span><strong>Detalles de Módulos</strong> - Espejo de Carrera, Minería de Valor, Constructor CV, Decodificador</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">5.</span>
                <span><strong>Módulos de Entrevista</strong> - Arquitectura de Respuestas, Sala del Coach ⭐, Gimnasio Comunicación</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">6.</span>
                <span><strong>Simulaciones & Maestría</strong> - Simulación Reclutador, Preguntas Difíciles, Certificación Final</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">7.</span>
                <span><strong>Sala de Práctica del Coach</strong> ⭐ - Entrenamiento interactivo con Coach IA + 3 preguntas</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[rgb(80,160,170)]">8.</span>
                <span><strong>Estudio Constructor CV</strong> - Optimización ATS y construcción profesional de documentos</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Características Clave</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.2)]">
                <p className="text-[rgb(80,160,170)] font-bold mb-1">10 Módulos Completos</p>
                <p className="text-white/80 text-sm">1,340 XP en recorrido progresivo de 90 días</p>
              </div>
              <div className="p-4 rounded-lg bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.2)]">
                <p className="text-[rgb(80,160,170)] font-bold mb-1">Preguntas de Entrevista</p>
                <p className="text-white/80 text-sm">3 preguntas clave con retroalimentación de Coach IA en tiempo real</p>
              </div>
              <div className="p-4 rounded-lg bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.2)]">
                <p className="text-[rgb(80,160,170)] font-bold mb-1">Arquitectura de Respuestas</p>
                <p className="text-white/80 text-sm">Métodos STAR & CAR para respuestas estructuradas</p>
              </div>
              <div className="p-4 rounded-lg bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.2)]">
                <p className="text-[rgb(80,160,170)] font-bold mb-1">Simulaciones Reales</p>
                <p className="text-white/80 text-sm">Simulación con Reclutador & Laboratorio de Preguntas Difíciles</p>
              </div>
              <div className="p-4 rounded-lg bg-[rgba(80,160,170,0.1)] border border-[rgba(80,160,170,0.2)]">
                <p className="text-[rgb(80,160,170)] font-bold mb-1">Coach IA Integrado</p>
                <p className="text-white/80 text-sm">Retroalimentación en tiempo real y sugerencias de mejora</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Coaching Details */}
        <div className="bg-[rgba(80,160,170,0.05)] border border-[rgba(80,160,170,0.2)] rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Sala de Práctica del Coach - Sistema de Entrevistas con IA</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-[rgb(80,160,170)] font-bold">Pregunta 1: El Coach</h3>
              <p className="text-white/80 text-sm">
                "Cuéntame sobre ti"
              </p>
              <p className="text-white/60 text-xs">Coach IA proporciona retroalimentación en tiempo real sobre estructura, relevancia, duración y detalles</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[rgb(80,160,170)] font-bold">Pregunta 2: El Entrevistador</h3>
              <p className="text-white/80 text-sm">
                "¿Por qué quieres trabajar aquí?"
              </p>
              <p className="text-white/60 text-xs">Simulación de entrevistador real evaluando investigación, alineación cultural y motivación</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[rgb(80,160,170)] font-bold">Pregunta 3: Reclutador</h3>
              <p className="text-white/80 text-sm">
                "Situación desafiante que superaste..."
              </p>
              <p className="text-white/60 text-xs">Reclutador profesional evaluando método STAR, resolución de problemas e impacto</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-black/30 rounded border border-[rgba(80,160,170,0.1)]">
            <p className="text-white/70 text-sm">
              <strong>Bucle de Práctica:</strong> Responde → Recibe Retroalimentación IA → Revisa Criterios → Mejora y Reintenta → Continúa
            </p>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-[rgba(80,160,170,0.05)] border border-[rgba(80,160,170,0.2)] rounded-lg p-4 text-center">
            <div className="text-2xl font-black text-[rgb(80,160,170)]">95s</div>
            <p className="text-white/70 text-sm mt-1">Duración del Recorrido</p>
          </div>
          <div className="bg-[rgba(80,160,170,0.05)] border border-[rgba(80,160,170,0.2)] rounded-lg p-4 text-center">
            <div className="text-2xl font-black text-[rgb(80,160,170)]">16</div>
            <p className="text-white/70 text-sm mt-1">Fotogramas</p>
          </div>
          <div className="bg-[rgba(80,160,170,0.05)] border border-[rgba(80,160,170,0.2)] rounded-lg p-4 text-center">
            <div className="text-2xl font-black text-[rgb(80,160,170)]">10</div>
            <p className="text-white/70 text-sm mt-1">Módulos de Entrenamiento</p>
          </div>
          <div className="bg-[rgba(80,160,170,0.05)] border border-[rgba(80,160,170,0.2)] rounded-lg p-4 text-center">
            <div className="text-2xl font-black text-[rgb(80,160,170)]">1,340</div>
            <p className="text-white/70 text-sm mt-1">XP Total</p>
          </div>
        </div>
      </div>
    </main>
  );
}
