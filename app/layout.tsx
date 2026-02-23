import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionWrapper } from "@/components/session-wrapper"
import { CoachStrategicProvider } from "@/components/coach-strategic-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://despegatucarrera.cl"),
  title: {
    default: "Despega Tu Carrera - Plataforma de Desarrollo Profesional con IA | Tests Psicométricos y Coaching",
    template: "%s | Despega Tu Carrera",
  },
  description:
    "Plataforma líder en Chile para desarrollo profesional. Descubre tu potencial con evaluaciones psicométricas, accede a 120+ libros profesionales y recibe coaching personalizado con IA. Aprende de expertos en liderazgo, productividad e inteligencia emocional.",
  keywords: [
    "desarrollo profesional Chile",
    "evaluaciones psicométricas",
    "coaching con inteligencia artificial",
    "evaluación personalidad",
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
    "evaluación vocacional Chile",
    "evaluación soft skills",
    "mentor virtual IA",
    "planificación carrera",
    "empleabilidad Chile",
  ],
  authors: [{ name: "Despega Tu Carrera", url: "https://despegatucarrera.cl" }],
  creator: "Despega Tu Carrera",
  publisher: "Despega Tu Carrera",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://despegatucarrera.cl",
    siteName: "Despega Tu Carrera",
    title: "Despega Tu Carrera - Desarrollo Profesional con IA y Tests Psicométricos",
    description:
      "Transforma tu carrera con evaluaciones psicométricas científicas, 120+ libros profesionales y coaching personalizado con inteligencia artificial. La plataforma #1 en Chile para desarrollo profesional.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Despega Tu Carrera - Plataforma de Desarrollo Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Despega Tu Carrera - Desarrollo Profesional con IA",
    description: "Tests psicométricos, 120+ libros profesionales y coaching con IA. Impulsa tu carrera hoy.",
    images: ["/twitter-image.png"],
    creator: "@despegatucarrera",
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
    canonical: "https://despegatucarrera.cl",
    languages: {
      "es-CL": "https://despegatucarrera.cl",
      es: "https://despegatucarrera.cl/es",
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
    <html lang="es-CL" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme-preference">
          <CoachStrategicProvider>
            <SessionWrapper>
              {children}
              <Toaster />
            </SessionWrapper>
          </CoachStrategicProvider>
        </ThemeProvider>

        <Analytics />
        <SpeedInsights />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Despega Tu Carrera",
              description:
                "Plataforma líder en Chile para desarrollo profesional con IA, tests psicométricos y coaching personalizado",
              url: "https://despegatucarrera.cl",
              logo: "https://despegatucarrera.cl/logo.png",
              sameAs: [
                "https://www.linkedin.com/company/despegatucarrera",
                "https://twitter.com/despegatucarrera",
                "https://www.facebook.com/despegatucarrera",
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
