import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/session-wrapper"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DTC Platform - Desarrollo de Talento y Carrera",
  description:
    "Plataforma integral de desarrollo profesional con evaluaciones psicométricas, análisis de soft skills con IA y coaching personalizado.",
  keywords:
    "desarrollo profesional, evaluaciones psicométricas, soft skills, coaching, IA, DISC, Big Five, MBTI, RIASEC",
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
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
