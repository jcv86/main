import type React from "react"
import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import "./design-system.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { validateEnvironment } from "@/lib/env-validation"
import LLMOOptimizedFooter from "@/components/footer"

// Validate environment on startup (skip for test routes)
if (typeof window === "undefined" && !process.env.SKIP_ENV_VALIDATION) {
  validateEnvironment()
}

// DESIGN.md: Montserrat is the only product typeface.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.despegatucarrera.com"),
  title: {
    default: "Despega Tu Carrera | Claridad y desarrollo profesional con IA",
    template: "%s | Despega Tu Carrera",
  },
  description:
    "Un recorrido conectado para comprender cómo funcionas, construir una ruta, practicar y tomar decisiones profesionales con más contexto y evidencia.",
  keywords: [
    "desarrollo profesional Chile",
    "autoconocimiento profesional",
    "coaching con inteligencia artificial",
    "identidad profesional",
    "biblioteca desarrollo profesional",
    "cursos liderazgo Chile",
    "evidencia profesional",
    "crecimiento profesional",
    "habilidades blandas",
    "orientación vocacional",
    "coaching carrera profesional",
    "libros desarrollo personal",
    "ruta profesional de 90 días",
    "mentor virtual IA",
    "planificación carrera",
    "empleabilidad Chile",
  ],
  authors: [{ name: "Despega Tu Carrera", url: "https://www.despegatucarrera.com" }],
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
    url: "https://www.despegatucarrera.com",
    siteName: "Despega Tu Carrera",
    title: "Despega Tu Carrera | Desarrollo profesional con evidencia",
    description:
      "Transforma tu carrera con evaluaciones científicas, contenido especializado y coaching personalizado con inteligencia artificial.",
    images: [
      {
        url: "https://www.despegatucarrera.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Despega Tu Carrera - Plataforma de Desarrollo Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Despega Tu Carrera - Desarrollo Profesional con IA",
    description: "Tests psicométricos, contenido especializado y coaching con IA. Impulsa tu carrera hoy.",
    images: ["https://www.despegatucarrera.com/twitter-image.png"],
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
    canonical: "https://www.despegatucarrera.com",
    languages: {
      "es-CL": "https://www.despegatucarrera.com",
      es: "https://www.despegatucarrera.com/es",
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
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#080B14",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CL" suppressHydrationWarning className="bg-background">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#080B14" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${montserrat.variable} font-sans`}>
        <Providers>
          {children}
          <LLMOOptimizedFooter />
        </Providers>
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
                "Plataforma chilena de desarrollo profesional con IA para comprender tu perfil, definir tu ruta, entrenar decisiones y leer el mercado laboral",
              url: "https://www.despegatucarrera.com",
              logo: "https://www.despegatucarrera.com/logo.png",
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
