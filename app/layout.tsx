import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionWrapper } from "@/components/session-wrapper"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CareerDev Pro - Professional Development Platform",
  description:
    "Unlock your career potential with AI-powered insights, personality assessments, and personalized coaching.",
  keywords: [
    "career development",
    "personality assessment",
    "AI coaching",
    "professional growth",
    "DISC",
    "MBTI",
    "Big Five",
  ],
  authors: [{ name: "CareerDev Pro Team" }],
  creator: "CareerDev Pro",
  publisher: "CareerDev Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://careerdev-pro.vercel.app"),
  openGraph: {
    title: "CareerDev Pro - Professional Development Platform",
    description:
      "Unlock your career potential with AI-powered insights, personality assessments, and personalized coaching.",
    url: "https://careerdev-pro.vercel.app",
    siteName: "CareerDev Pro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerDev Pro - Professional Development Platform",
    description:
      "Unlock your career potential with AI-powered insights, personality assessments, and personalized coaching.",
    creator: "@careerdevpro",
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
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionWrapper>
          <main className="min-h-screen bg-background text-foreground">{children}</main>
          <Toaster />
        </SessionWrapper>
      </body>
    </html>
  )
}
