import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionWrapper } from "@/components/session-wrapper"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plataforma de Desarrollo Profesional con IA",
  description:
    "Transforma tu carrera con evaluaciones psicométricas avanzadas, coaching personalizado con IA y una biblioteca de desarrollo profesional.",
  keywords:
    "desarrollo profesional, coaching IA, evaluaciones psicométricas, DISC, Big Five, MBTI, RIASEC, inteligencia emocional",
  authors: [{ name: "Equipo de Desarrollo Profesional" }],
  openGraph: {
    title: "Plataforma de Desarrollo Profesional con IA",
    description:
      "Descubre tu potencial profesional con evaluaciones psicométricas avanzadas y coaching personalizado con IA",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plataforma de Desarrollo Profesional con IA",
    description: "Transforma tu carrera con evaluaciones psicométricas avanzadas y coaching personalizado con IA",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionWrapper>
          {children}
          <Toaster />
        </SessionWrapper>
      </body>
    </html>
  )
}
