import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v66 - GIT CACHE CLEAR: Deleted and completely recreated both coach-sidebar.tsx (143 lines clean) and a1-cerebral/page.tsx (406 lines clean). All orphaned JSX removed. Files end with proper closing braces. Force full rebuild to clear git cache. v66

// Warn if NEXTAUTH_URL has trailing slash - this causes double slashes in callback URLs
if (process.env.NEXTAUTH_URL?.endsWith('/')) {
  console.warn("[v0] ⚠️ CRITICAL: NEXTAUTH_URL has trailing slash!")
  console.warn("[v0] This causes OAuth callbacks to fail with URLs like: //api/auth/callback/google")
  console.warn("[v0] FIX: Remove trailing slash from NEXTAUTH_URL in Vercel environment variables")
}

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
