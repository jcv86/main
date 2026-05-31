"use client"

import { Star, ArrowRight } from "lucide-react"

export interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  company: string
  image?: string
  rating?: number
}

export function TestimonialCard({
  quote,
  author,
  role,
  company,
  image,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="bg-purple/5 border border-purple/10 rounded-lg p-6 hover:border-cyan/30 transition-colors h-full flex flex-col">
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-cyan text-cyan" : "text-purple/20"}`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-white mb-6 flex-grow">&ldquo;{quote}&rdquo;</p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-purple/10">
        {image && (
          <img
            src={image}
            alt={author}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-white font-semibold text-sm">{author}</p>
          <p className="text-purple/60 text-xs">
            {role} {company && `@ ${company}`}
          </p>
        </div>
      </div>
    </div>
  )
}

export function TestimonialCarousel({
  testimonials,
  title,
  description,
}: {
  testimonials: TestimonialCardProps[]
  title: string
  description?: string
}) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        {description && <p className="text-purple/60">{description}</p>}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, idx) => (
          <TestimonialCard key={idx} {...testimonial} />
        ))}
      </div>
    </div>
  )
}

export interface CaseStudyProps {
  title: string
  subtitle: string
  company: string
  industry: string
  challenge: string
  solution: string
  results: Array<{ metric: string; value: string }>
  image?: string
}

export function CaseStudyCard({
  title,
  subtitle,
  company,
  industry,
  challenge,
  solution,
  results,
  image,
}: CaseStudyProps) {
  return (
    <div className="bg-purple/5 border border-purple/10 rounded-xl p-8 hover:border-cyan/30 transition-colors">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-block px-3 py-1 bg-cyan/10 rounded-full mb-3">
          <span className="text-xs font-semibold text-cyan">{industry}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
        <p className="text-cyan font-medium">{company}</p>
      </div>

      {/* Image */}
      {image && (
        <img
          src={image}
          alt={company}
          className="w-full h-48 object-cover rounded-lg mb-6"
        />
      )}

      {/* Challenge & Solution */}
      <div className="space-y-6 mb-8">
        <div>
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red/50 rounded-full"></span>
            El Desafío
          </h4>
          <p className="text-purple/60 text-sm">{challenge}</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green/50 rounded-full"></span>
            La Solución
          </h4>
          <p className="text-purple/60 text-sm">{solution}</p>
        </div>
      </div>

      {/* Results */}
      <div className="bg-background rounded-lg p-4 border border-cyan/10">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan rounded-full"></span>
          Resultados
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {results.map((result, idx) => (
            <div key={idx}>
              <p className="text-cyan font-bold text-lg">{result.value}</p>
              <p className="text-purple/60 text-xs">{result.metric}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export interface TrustBadgeProps {
  icon: React.ReactNode
  label: string
  value: string
  description?: string
}

export function TrustBadge({
  icon,
  label,
  value,
  description,
}: TrustBadgeProps) {
  return (
    <div className="bg-purple/5 border border-purple/10 rounded-lg p-4 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <p className="text-purple/60 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {description && <p className="text-purple/60 text-xs">{description}</p>}
    </div>
  )
}

export function TrustMetrics({
  title,
  metrics,
}: {
  title: string
  metrics: TrustBadgeProps[]
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <TrustBadge key={idx} {...metric} />
        ))}
      </div>
    </div>
  )
}

export interface SuccessMetricProps {
  before: string
  after: string
  label: string
  improvement: string
}

export function SuccessMetric({
  before,
  after,
  label,
  improvement,
}: SuccessMetricProps) {
  return (
    <div className="bg-gradient-to-r from-purple/5 to-cyan/5 border border-cyan/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-purple/60 text-sm mb-1">Antes</p>
          <p className="text-2xl font-bold text-white">{before}</p>
        </div>
        <ArrowRight className="w-6 h-6 text-cyan" />
        <div className="text-right">
          <p className="text-purple/60 text-sm mb-1">Después</p>
          <p className="text-2xl font-bold text-cyan">{after}</p>
        </div>
      </div>
      <div className="pt-4 border-t border-purple/10">
        <p className="text-white font-semibold text-sm mb-1">{label}</p>
        <p className="text-green font-bold">{improvement}</p>
      </div>
    </div>
  )
}

export function SuccessStories({
  title,
  metrics,
}: {
  title: string
  metrics: SuccessMetricProps[]
}) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <SuccessMetric key={idx} {...metric} />
        ))}
      </div>
    </div>
  )
}
