import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionWrapper } from "@/components/session-wrapper"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://tucarrera.cl"),
  title: {
    default: "TuCarrera.cl - Plataforma de Desarrollo Profesional con IA | Tests Psicométricos y Coaching",
    template: "%s | TuCarrera.cl",
  },
  description:
    "Plataforma líder en Chile para desarrollo profesional. Descubre tu potencial con tests psicométricos (DISC, MBTI, Big Five), accede a 120+ libros profesionales y recibe coaching personalizado con IA. Aprende de expertos en liderazgo, productividad e inteligencia emocional.",
  keywords: [
    "desarrollo profesional Chile",
    "tests psicométricos",
    "coaching con inteligencia artificial",
    "test DISC Chile",
    "test MBTI en español",
    "Big Five personalidad",
    "inteligencia emocional test",
    "biblioteca desarrollo profesional",
    "cursos liderazgo Chile",
    "evaluación competencias laborales",
    "crecimiento profesional",
    "habilidades blandas",
    "orientación vocacional",
    "coaching carrera profesional",
    "libros desarrollo personal",
    "test RIASEC Chile",
    "evaluación soft skills",
    "mentor virtual IA",
    "planificación carrera",
    "empleabilidad Chile",
  ],
  authors: [{ name: "TuCarrera.cl", url: "https://tucarrera.cl" }],
  creator: "TuCarrera.cl",
  publisher: "TuCarrera.cl",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://tucarrera.cl",
    siteName: "TuCarrera.cl",
    title: "TuCarrera.cl - Desarrollo Profesional con IA y Tests Psicométricos",
    description:
      "Transforma tu carrera con evaluaciones psicométricas científicas, 120+ libros profesionales y coaching personalizado con inteligencia artificial. La plataforma #1 en Chile para desarrollo profesional.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TuCarrera.cl - Plataforma de Desarrollo Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TuCarrera.cl - Desarrollo Profesional con IA",
    description: "Tests psicométricos, 120+ libros profesionales y coaching con IA. Impulsa tu carrera hoy.",
    images: ["/twitter-image.png"],
    creator: "@tucarreracl",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://tucarrera.cl",
    languages: {
      "es-CL": "https://tucarrera.cl",
      es: "https://tucarrera.cl/es",
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    other: {
      "msvalidate.01": "bing-verification-code",
    },
  },
  category: "education",
  classification: "Professional Development Platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CL">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          {children}
          <Toaster />
        </SessionWrapper>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "TuCarrera.cl",
              description:
                "Plataforma líder en Chile para desarrollo profesional con IA, tests psicométricos y coaching personalizado",
              url: "https://tucarrera.cl",
              logo: "https://tucarrera.cl/logo.png",
              sameAs: [
                "https://www.linkedin.com/company/tucarrera",
                "https://twitter.com/tucarreracl",
                "https://www.facebook.com/tucarreracl",
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: "CL",
                addressLocality: "Santiago",
              },
              areaServed: {
                "@type": "Country",
                name: "Chile",
              },
              offers: {
                "@type": "Offer",
                category: "Professional Development Services",
                price: "0",
                priceCurrency: "CLP",
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
