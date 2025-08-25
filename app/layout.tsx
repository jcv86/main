import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SessionWrapper from "@/components/session-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DTC Final - Plataforma de Desarrollo Profesional",
  description: "Plataforma integral para el desarrollo de carrera y habilidades profesionales",
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
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  )
}
