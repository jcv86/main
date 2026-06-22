'use client'

import React from 'react'
import LandingNavbar from '@/components/landing/navbar'
import HeroSection from '@/components/landing/hero-section'
import BentoFeatures from '@/components/landing/bento-features'
import FourStages from '@/components/landing/four-stages'
import ProblemSolution from '@/components/landing/problem-solution'
import Testimonials from '@/components/landing/testimonials'
import ComparisonTable from '@/components/comparison-table'
import OutcomesGrid from '@/components/outcomes-grid'
import VeraChatLive from '@/components/vera-chat-live'
import PricingSection from '@/components/landing/pricing-section'
import FinalCtaSection from '@/components/landing/final-cta-section'
import FaqSection from '@/components/landing/faq-section'

const TEAL = 'rgb(80, 160, 170)'

export default function LandingPageOptimized() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero */}
      <HeroSection />

      {/* Bento Features Grid */}
      <BentoFeatures />

      {/* 4 Stages */}
      <FourStages />

      {/* Problem → Solution */}
      <ProblemSolution />

      {/* Comparison Table */}
      <section className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: TEAL }}
            >
              Comparación
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
              Por qué DTC no se parece a nada de lo que ya conoces.
            </h2>
          </div>
          <ComparisonTable />
        </div>
      </section>

      {/* Outcomes Grid */}
      <section className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: TEAL }}
            >
              Lo que te llevas
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
              Claridad primero. Resultados, en consecuencia.
            </h2>
            <p className="mt-4 text-base text-white/50 leading-relaxed">
              Lo que tienes después de 90 días con DTC
            </p>
          </div>
          <OutcomesGrid />
        </div>
      </section>

      {/* Vera Chat */}
      <section className="relative py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: TEAL }}
            >
              Vera — tu coach IA
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
              Un acompañamiento que no se apaga.
            </h2>
            <p className="mt-4 text-base text-white/50 leading-relaxed">
              Vera tiene contexto completo de quién eres. Está disponible 24/7, cuando tú lo necesitas.
            </p>
          </div>
          <VeraChatLive />
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing */}
      <PricingSection />

      {/* Final CTA */}
      <FinalCtaSection />

      {/* FAQ */}
      <FaqSection />
    </div>
  )
}
