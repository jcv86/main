// JSON-LD Schema Helpers for SEO
// Usage: Add these schemas to the <head> of pages for better search engine understanding

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Despega Tu Carrera",
    url: "https://despegatucarrera.com",
    logo: "https://despegatucarrera.com/logo.png",
    description: "Plataforma de desarrollo profesional impulsada por IA que transforma carreras en 90 días",
    sameAs: [
      "https://linkedin.com/company/despega-tu-carrera",
      "https://twitter.com/despegatucarrera",
      "https://facebook.com/despegatucarrera",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "contacto@despegatucarrera.com",
      telephone: "+56-9-6316-0187",
      areaServed: "CL",
      availableLanguage: ["es", "en"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "CL",
      addressLocality: "Santiago",
      streetAddress: "Santiago, Chile",
    },
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
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
  }
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

export function generateProductSchema(product: {
  name: string
  description: string
  price: string
  currency: string
  rating: number
  ratingCount: number
  availability: string
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.availability,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      ratingCount: product.ratingCount,
    },
  }
}

export function generateReviewSchema(review: {
  productName: string
  author: string
  reviewRating: number
  reviewBody: string
  datePublished: string
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "Review",
    itemReviewed: {
      "@type": "Thing",
      name: review.productName,
    },
    author: {
      "@type": "Person",
      name: review.author,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.reviewRating,
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
  }
}

export function generateArticleSchema(article: {
  headline: string
  image: string
  datePublished: string
  author: string
  description: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    image: article.image,
    datePublished: article.datePublished,
    author: {
      "@type": "Person",
      name: article.author,
    },
    description: article.description,
  }
}

export function generateCourseSchema(course: {
  name: string
  description: string
  provider: string
  duration: string
  price: string
  currency: string
  rating: number
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: course.provider,
    },
    duration: course.duration,
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: course.currency,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: course.rating,
      bestRating: "5",
      worstRating: "1",
    },
  }
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Despega Tu Carrera",
    image: "https://despegatucarrera.com/logo.png",
    description: "Plataforma de desarrollo profesional",
    url: "https://despegatucarrera.com",
    telephone: "+56-9-6316-0187",
    email: "contacto@despegatucarrera.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CL",
      addressLocality: "Santiago",
    },
    priceRange: "$$",
    areaServed: "CL",
  }
}

export function generateJobPostingSchema(job: {
  title: string
  description: string
  employmentType: string
  salary: string
  currency: string
  location: string
  company: string
}) {
  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    baseSalary: {
      "@type": "PriceSpecification",
      priceCurrency: job.currency,
      price: job.salary,
    },
    description: job.description,
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
    title: job.title,
  }
}

// Schema.org types for TypeScript
export interface SchemaProps {
  json: Record<string, any>
}

export function JsonLdSchema({ json }: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
