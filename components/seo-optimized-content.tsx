"use client"

import type React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface SEOContentProps {
  children: React.ReactNode
  className?: string
}

export function SEOContent({ children, className = "" }: SEOContentProps) {
  return (
    <article className={className} itemScope itemType="https://schema.org/Article">
      {children}
    </article>
  )
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
}

function FAQSection({ faqs, title = "Preguntas Frecuentes" }: FAQSectionProps) {
  return (
    <section className="py-20 bg-background border-t border-border" itemScope itemType="https://schema.org/FAQPage">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{title}</h2>
          <p className="text-lg text-foreground opacity-75 mb-6">
            Respuestas a las preguntas más comunes sobre Despega Tu Carrera
          </p>
          <a
            href="/faq"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Ver todas las preguntas frecuentes
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
                <AccordionTrigger className="hover:text-foreground text-lg font-semibold py-4 px-0 text-left" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <span itemProp="name">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-foreground opacity-75 leading-relaxed pb-4" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <div itemProp="text">{faq.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* JSON-LD for FAQs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-foreground opacity-75">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="font-medium text-foreground">{item.name}</span>
              ) : (
                <a href={item.url} className="hover:text-blue-600 dark:hover:text-blue-400">
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* JSON-LD for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: `https://tucarrera.cl${item.url}`,
            })),
          }),
        }}
      />
    </>
  )
}

interface TestSchemaProps {
  name: string
  description: string
  duration: number
  questions: number
}

export function TestStructuredData({ name, description, duration, questions }: TestSchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          name: name,
          description: description,
          provider: {
            "@type": "Organization",
            name: "TuCarrera.cl",
            url: "https://tucarrera.cl",
          },
          educationalLevel: "Professional",
          timeRequired: `PT${duration}M`,
          numberOfQuestions: questions,
          inLanguage: "es-CL",
          isAccessibleForFree: true,
          learningResourceType: "Assessment",
        }),
      }}
    />
  )
}

export default FAQSection
