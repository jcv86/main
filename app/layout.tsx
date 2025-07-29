import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { NotificationsProvider } from "@/contexts/notifications-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Despega tu Carrera - Plataforma de Desarrollo Profesional",
  description:
    "Plataforma integral para el desarrollo profesional en Chile. Incluye coach de carrera con IA, evaluaciones de habilidades, constructor de CV, búsqueda de empleo y más.",
  keywords:
    "desarrollo profesional, carrera, empleo, Chile, CV, habilidades, coach profesional, trabajo, DISC, Big Five",
  authors: [{ name: "Despega tu Carrera" }],
  openGraph: {
    title: "Despega tu Carrera - Tu Futuro Profesional Comienza Aquí",
    description:
      "Desarrolla tu carrera profesional con herramientas de IA, evaluaciones personalizadas y oportunidades laborales en Chile.",
    type: "website",
    locale: "es_CL",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <NotificationsProvider>
              <AuthProvider>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="flex-1">{children}</main>
                </div>
                <Toaster />
                <SonnerToaster />
              </AuthProvider>
            </NotificationsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
