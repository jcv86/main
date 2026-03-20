import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v66 - GIT CACHE CLEAR: Deleted and completely recreated both coach-sidebar.tsx (143 lines clean) and a1-cerebral/page.tsx (406 lines clean). All orphaned JSX removed. Files end with proper closing braces. Force full rebuild to clear git cache. v66

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

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
