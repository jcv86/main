import NextAuth from "next-auth"
import { authconfig } from "@/lib/auth"

// PRODUCTION BUILD v80 - Fixed STT repetition issue. Changed useSpeechRecognition hook: interimResults OFF (was ON), added 2-second silence timeout before auto-stop, only captures FINAL results. VoiceInput now deduplicates with useRef tracking. Users can speak, system waits 2 seconds after silence, then captures full sentence once without repetition. - force redeploy v80

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
