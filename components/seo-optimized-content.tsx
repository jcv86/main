"use client"

import type React from "react"

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

export function FAQSection({ faqs, title = "Preguntas Frecuentes" }: FAQSectionProps) {
  return (
    <section className="py-12" itemScope itemType="https://schema.org/FAQPage">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="max-w-4xl mx-auto space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-900" itemProp="name">
              {faq.question}
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <div itemProp="text" className="text-gray-700 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
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
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="font-medium text-gray-900">{item.name}</span>
              ) : (
                <a href={item.url} className="hover:text-blue-600">
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
