import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Navigation } from "@/components/navigation"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { NotificationsProvider } from "@/contexts/notifications-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plataforma de Desarrollo Profesional",
  description: "Tu plataforma integral para el desarrollo profesional y orientación vocacional",
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
          <AuthProvider>
            <LanguageProvider>
              <NotificationsProvider>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="flex-1">{children}</main>
                </div>
                <Toaster />
              </NotificationsProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
