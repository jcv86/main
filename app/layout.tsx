import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionWrapper } from "@/components/session-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Career Development Platform - Discover Your Professional Path",
  description:
    "Comprehensive career assessment platform with personality tests, skills evaluation, and AI-powered coaching to help you discover and develop your professional path.",
  keywords:
    "career development, personality tests, DISC assessment, MBTI, Big Five, career coaching, professional development, skills assessment",
  authors: [{ name: "Career Development Platform" }],
  creator: "Career Development Platform",
  publisher: "Career Development Platform",
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
    title: "Career Development Platform - Discover Your Professional Path",
    description:
      "Take comprehensive personality and skills assessments with AI-powered insights to accelerate your career growth.",
    url: "https://career-development-platform.vercel.app",
    siteName: "Career Development Platform",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Career Development Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Development Platform - Discover Your Professional Path",
    description:
      "Take comprehensive personality and skills assessments with AI-powered insights to accelerate your career growth.",
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
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  )
}
