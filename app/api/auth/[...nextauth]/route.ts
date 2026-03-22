import NextAuth from "next-auth"
import { authconfig } from "@/lib/auth"

// PRODUCTION BUILD v87 - Removed all mock data from A2 rutas page. Now fully dynamic: loads real user A1 Cerebral profile and Conozcámonos-2 responses from Supabase. Calls canon-generate-route endpoint to generate personalized routes based on actual user data. Displays real routes with razon_seleccion (why this route for user), real beneficios, perfil scores. Shows loading state and error handling. Routes saved to user_a2_routes table. - force redeploy v87

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


