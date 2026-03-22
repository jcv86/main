import NextAuth from "next-auth"
import { authconfig } from "@/lib/auth"

// PRODUCTION BUILD v82 - Added A1 Cerebral intro tutorial page. Created /despega/a1-cerebral-intro with comprehensive guide: what is DISC (D-I-S-C dimensions), how test works (20 questions, 2 selections each), example question showing MÁS/MENOS format, benefits of assessment. Conozcámonos-1 now redirects to intro before test. Added link to navbar A1 menu. - force redeploy v82

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


