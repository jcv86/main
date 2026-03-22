import NextAuth from "next-auth"
import { authconfig } from "@/lib/auth"

// PRODUCTION BUILD v86 - Enhanced Conozcámonos-2 with AI features. Added AIAssistant component to all text questions providing response suggestions. Added VoiceInput (microphone button) with STT for text questions - users can speak to dictate responses. Added simple 5-word validation check for text responses. Added validatingIds state to prevent button spam during validation. Conozcámonos-2 now has full feature parity with Conozcámonos-1. - force redeploy v86

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


