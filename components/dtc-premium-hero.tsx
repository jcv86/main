'use client'

import React from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DtcPremiumHeroProps {
  userName?: string
  currentPhase?: 'ritual' | 'exploration' | 'training' | 'reality'
}

const phaseConfig = {
  ritual: {
    accent: 'yellow',
    label: 'El Ritual',
    description: 'Autoconocimiento científico',
    content: 'DISC, Big Five, habilidades críticas',
  },
  exploration: {
    accent: 'orange',
    label: 'Exploración',
    description: 'Diseña tu ruta de 90 días',
    content: 'Estrategia de carrera estructurada',
  },
  training: {
    accent: 'red',
    label: 'Entrenamiento',
    description: 'Simulación intensiva con IA',
    content: 'Entrevistas, presentaciones, decisiones',
  },
  reality: {
    accent: 'blue',
    label: 'La Realidad',
    description: 'Ejecución con coach IA 24/7',
    content: 'Aplicación real en el mercado laboral',
  },
}

export const DtcPremiumHero: React.FC<DtcPremiumHeroProps> = ({ userName, currentPhase = 'ritual' }) => {
  return (
    <section className="relative min-h-screen bg-black pt-24 pb-20 px-4 md:px-8">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Main Hero Section */}
        <div className="mb-24">
          {/* Tagline */}
          <div className="mb-8 inline-block">
            <p className="text-sm font-semibold tracking-widest text-muted/40 uppercase">
              Transformación Profesional Estructurada
            </p>
          </div>

          {/* Main Headline - Lora Display Font */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
            Tu camino a la empleabilidad se construye en 4 fases
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted/30 max-w-3xl mb-8 leading-relaxed">
            No es coaching. No es motivación. Es un sistema científico y estructurado que te transforma desde el autoconocimiento hasta la ejecución en el mercado laboral real.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button className="bg-yellow text-black font-semibold px-8 py-4 rounded-[20px] flex items-center justify-center gap-2 hover:bg-yellow/90 transition-colors group">
              Comenzar Mi Transformación
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-muted/60 text-white font-semibold px-8 py-4 rounded-[20px] hover:bg-muted/90/50 transition-colors">
              Ver Cómo Funciona
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="p-6 rounded-[20px] bg-muted/90/40 border border-muted/80">
              <p className="text-3xl font-bold text-yellow mb-2">4</p>
              <p className="text-sm text-muted/40">Fases Estructuradas</p>
            </div>
            <div className="p-6 rounded-[20px] bg-muted/90/40 border border-muted/80">
              <p className="text-3xl font-bold text-orange mb-2">90</p>
              <p className="text-sm text-muted/40">Días de Transformación</p>
            </div>
            <div className="p-6 rounded-[20px] bg-muted/90/40 border border-muted/80">
              <p className="text-3xl font-bold text-red mb-2">∞</p>
              <p className="text-sm text-muted/40">Coach IA 24/7</p>
            </div>
            <div className="p-6 rounded-[20px] bg-muted/90/40 border border-muted/80">
              <p className="text-3xl font-bold text-blue mb-2">1:1</p>
              <p className="text-sm text-muted/40">Personalizado</p>
            </div>
          </div>
        </div>

        {/* The 4 Phases - Premium Grid */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16" style={{ fontFamily: 'Lora, serif' }}>
            Las 4 Fases de Tu Transformación
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(phaseConfig).map(([key, phase]) => {
              const phaseColors = {
                yellow: { bg: 'bg-yellow/5', border: 'border-yellow/30', accent: 'text-yellow' },
                orange: { bg: 'bg-orange/5', border: 'border-orange/30', accent: 'text-orange' },
                red: { bg: 'bg-red/5', border: 'border-red/30', accent: 'text-red' },
                blue: { bg: 'bg-blue/5', border: 'border-blue/30', accent: 'text-blue' },
              }
              const colors = phaseColors[phase.accent as keyof typeof phaseColors]

              return (
                <div
                  key={key}
                  className={cn(
                    'p-8 rounded-[28px] border transition-all duration-300 hover:shadow-lg hover:scale-105',
                    colors.bg,
                    colors.border,
                    'border-2'
                  )}
                >
                  {/* Phase Number & Accent */}
                  <div className={cn('text-5xl font-bold mb-4 opacity-20', colors.accent)}>
                    {String.fromCharCode(65 + Object.keys(phaseConfig).indexOf(key))}
                  </div>

                  {/* Phase Name - Lora Display */}
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Lora, serif' }}>
                    {phase.label}
                  </h3>

                  {/* Description */}
                  <p className="text-muted/40 text-sm mb-4 font-medium">
                    {phase.description}
                  </p>

                  {/* Content Line */}
                  <p className="text-muted/30 text-sm leading-relaxed mb-6">
                    {phase.content}
                  </p>

                  {/* Divider */}
                  <div className={cn('h-px mb-6 opacity-50', colors.border)}></div>

                  {/* Key Benefits */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle size={16} className={cn('mt-1 flex-shrink-0', colors.accent)} />
                      <p className="text-xs text-muted/30">Autoevaluación científica</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle size={16} className={cn('mt-1 flex-shrink-0', colors.accent)} />
                      <p className="text-xs text-muted/30">Feedback personalizado</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Why Despega - Value Proposition */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{ fontFamily: 'Lora, serif' }}>
            ¿Por qué Despega?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Científico',
                description: 'Basado en psicometría validada y ciencia del comportamiento',
                accent: 'yellow',
              },
              {
                title: 'Estructurado',
                description: '90 días divididos en 4 fases con objetivos claros',
                accent: 'orange',
              },
              {
                title: 'Intensivo',
                description: 'Entrenamientos con video, feedback multimodal, coach IA',
                accent: 'red',
              },
              {
                title: 'Medible',
                description: 'Tu score de empleabilidad mejora tangiblemente cada sesión',
                accent: 'blue',
              },
              {
                title: 'Personalizado',
                description: 'Adaptado a tu perfil DISC, habilidades y metas',
                accent: 'green',
              },
              {
                title: 'Real',
                description: 'Aplicación inmediata en procesos de selección reales',
                accent: 'purple',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-[20px] bg-muted/90/30 border border-muted/80 hover:border-muted/70 transition-colors">
                <div className={`text-lg font-bold mb-3 text-${item.accent}`}>
                  {item.title}
                </div>
                <p className="text-muted/40 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center pt-12 border-t border-muted/80">
          <p className="text-muted/40 mb-8">
            Tu transformación comienza hoy. Sin condiciones. Sin promesas vacías.
          </p>
          <button className="bg-red text-white font-semibold px-10 py-5 rounded-[20px] text-lg hover:bg-red/90 transition-colors inline-flex items-center gap-2 group">
            Inicia Tu Ruta de 90 Días
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default DtcPremiumHero
