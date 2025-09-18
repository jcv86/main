import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SessionWrapper from "@/components/session-wrapper"
import PersistentAICoach from "@/components/persistent-ai-coach"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Career Development Platform",
  description: "AI-powered career development and psychometric testing platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          {children}
          <PersistentAICoach />
          <Toaster />
        </SessionWrapper>
      </body>
    </html>
  )
}
