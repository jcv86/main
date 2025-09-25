import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionWrapper } from "@/components/session-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plataforma de Desarrollo Profesional - Descubre Tu Camino Profesional",
  description:
    "Plataforma integral de evaluación profesional con tests de personalidad, evaluación de habilidades y coaching impulsado por IA para ayudarte a descubrir y desarrollar tu camino profesional.",
  keywords:
    "desarrollo profesional, tests de personalidad, evaluación DISC, MBTI, Big Five, coaching profesional, desarrollo profesional, evaluación de habilidades",
  authors: [{ name: "Plataforma de Desarrollo Profesional" }],
  creator: "Plataforma de Desarrollo Profesional",
  publisher: "Plataforma de Desarrollo Profesional",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://career-development-platform.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Plataforma de Desarrollo Profesional - Descubre Tu Camino Profesional",
    description:
      "Realiza evaluaciones integrales de personalidad y habilidades con insights impulsados por IA para acelerar tu crecimiento profesional.",
    url: "https://career-development-platform.vercel.app",
    siteName: "Plataforma de Desarrollo Profesional",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Plataforma de Desarrollo Profesional",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plataforma de Desarrollo Profesional - Descubre Tu Camino Profesional",
    description:
      "Realiza evaluaciones integrales de personalidad y habilidades con insights impulsados por IA para acelerar tu crecimiento profesional.",
    images: ["/og-image.jpg"],
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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  )
}
