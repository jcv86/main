import NextAuth from "next-auth"
import { authconfig } from "@/lib/auth"

// PRODUCTION BUILD v93 - Expanded A3 CV-ATS page with 6 professional CV formats. Added: 1) Creative Format with gradient design and visual cards (for creative roles), 2) Modern Format with timeline visualization and minimalist layout (tech companies), 3) LinkedIn Format with LinkedIn blue header and professional social styling, 4) Executive Format with minimalist sophisticated design for C-suite roles. Each format has dynamic info card explaining when to use it. Users can now toggle between ATS, Standard, Creative, Modern, LinkedIn, and Executive formats with download/copy buttons. - force redeploy v93

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


