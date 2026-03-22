import NextAuth from "next-auth"
import { authconfig } from "@/lib/auth"

// PRODUCTION BUILD v94 - Complete A4 Hub Development with 7 Professional Features. Built: 1) Radar Estratégico with 7-layer cognitive analysis, weak signals detection, economic indicators (IMACEC, IPC, TPM), and strategic scoring. 2) Noticias Tab with advanced filtering, relevance ranking, and engagement tracking (save, read, share). 3) Personalizadas Tab framework for future AI-powered content personalization. 4) Cultura General Tab with A4GamifiedTests component for market knowledge tests with points/badges. 5) Pruebas Tab for case analysis and economic interpretation exercises. 6) Biblioteca Tab with 10+ curated resources (books, articles, podcasts, videos) with filtering by type and category. 7) DISC Personalization Engine that adapts content depth, format, and pace based on user's DISC profile (D/I/S/C). Added: DISCWidget for profile display, A4BadgesDisplay for gamification, useA4Engagement hook for tracking user actions with point system. Database: Created a4_gamified_tests and a4_test_questions tables with seed data for Economía Básica, Mercado Laboral, Tendencias. All components integrated into main A4 page with proper loading states. - force redeploy v94

// FIX: REMOVE TRAILING SLASH FROM NEXTAUTH_URL BEFORE NEXTAUTH PROCESSES IT
// This is the DEFINITIVE fix - modify the env var at runtime before NextAuth reads it
if (process.env.NEXTAUTH_URL?.endsWith('/')) {
  const cleanUrl = process.env.NEXTAUTH_URL.replace(/\/$/, '')
  process.env.NEXTAUTH_URL = cleanUrl
  console.log("[v0] FIXED: Removed trailing slash from NEXTAUTH_URL")
  console.log("[v0] NEXTAUTH_URL is now:", process.env.NEXTAUTH_URL)
} else {
  console.log("[v0] NEXTAUTH_URL is clean (no trailing slash):", process.env.NEXTAUTH_URL)
}

const handler = NextAuth(authconfig)

export { handler as GET, handler as POST }


