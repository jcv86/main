import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationsProvider } from "@/contexts/notifications-context"
import { LanguageProvider } from "@/contexts/language-context"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Despega tu Carrera - Plataforma de Desarrollo Profesional",
  description: "Plataforma integral de desarrollo profesional para el mercado laboral chileno",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthProvider>
              <NotificationsProvider>
                <div className="min-h-screen bg-background">
                  <Header />
                  <main>{children}</main>
                </div>
                <Toaster />
              </NotificationsProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
