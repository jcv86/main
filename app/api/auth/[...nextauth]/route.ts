import NextAuth from "next-auth"
import { authconfig } from "@/lib/auth"

// PRODUCTION BUILD v85 - Fixed A2 intro page. Removed undefined variables (a1Results, profileData, DESPEGA_PROFILES import). Fixed loading state order (was checking profile after null return). Removed duplicate DISC score grids. Now properly loads user's Cerebral profile and displays single grid with Directo/Inspirador/Seguro/Consciente scores. Page is now fully functional. - force redeploy v85

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


