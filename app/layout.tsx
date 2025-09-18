import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CareerDev Pro - AI-Powered Career Development Platform",
  description:
    "Unlock your career potential with AI-powered assessments, personalized coaching, and curated learning resources. Take scientifically-backed personality tests and get actionable career guidance.",
  keywords:
    "career development, AI coaching, personality assessment, DISC, Big Five, MBTI, career guidance, professional development",
  authors: [{ name: "CareerDev Pro Team" }],
  creator: "CareerDev Pro",
  publisher: "CareerDev Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://careerdev-pro.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CareerDev Pro - AI-Powered Career Development",
    description:
      "Transform your career with AI-powered assessments and personalized coaching. Get insights into your personality, skills, and career preferences.",
    url: "https://careerdev-pro.vercel.app",
    siteName: "CareerDev Pro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CareerDev Pro - AI-Powered Career Development Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerDev Pro - AI-Powered Career Development",
    description: "Transform your career with AI-powered assessments and personalized coaching.",
    images: ["/og-image.jpg"],
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
