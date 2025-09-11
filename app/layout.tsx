import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionWrapper } from "@/components/session-wrapper"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DespegaTuCarrera - Plataforma de Desarrollo Profesional con IA",
  description:
    "Descubre tu potencial profesional con evaluaciones psicométricas avanzadas, coaching personalizado con IA y recomendaciones de carrera basadas en ciencia.",
  keywords:
    "desarrollo profesional, tests psicométricos, coaching IA, DISC, Big Five, MBTI, RIASEC, carrera profesional",
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
