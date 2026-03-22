import NextAuth from "next-auth"
import { authconfig } from "@/lib/auth"

// PRODUCTION BUILD v92 - Added AI Assistant, Voice Input (STT), and Response Validation to all A3 simulaciones (guiado, estructurada, desafiante, maestría). All open questions now have: 1) AIAssistant component for IA suggestions, 2) VoiceInput component for speech-to-text dictation, 3) validateResponse function for real-time feedback. Validation triggers onBlur with loading state. Users can now dictate responses, get IA suggestions, and receive validation feedback while practicing interviews. - force redeploy v92

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


