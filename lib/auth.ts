import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"

// Validate env vars at startup
// Force redeploy with new Google OAuth credentials
const validateEnvVars = () => {
  const required = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "NEXTAUTH_SECRET"]
  const missing = required.filter(key => !process.env[key])
  
  console.log("[v0] NextAuth Loading - Checking env vars:")
  console.log("[v0] GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID)
  console.log("[v0] GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET)
  console.log("[v0] NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET)
  console.log("[v0] LINKEDIN_CLIENT_ID exists:", !!process.env.LINKEDIN_CLIENT_ID)
  console.log("[v0] LINKEDIN_CLIENT_SECRET exists:", !!process.env.LINKEDIN_CLIENT_SECRET)
  
  if (missing.length > 0) {
    console.error("[v0] CRITICAL: Missing required environment variables:", missing)
  }
  
  return {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID,
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
  }
}

const envVars = validateEnvVars()

// Validate critical credentials exist before creating config
if (!envVars.googleClientId || !envVars.googleClientSecret) {
  console.error("[v0] FATAL: Google OAuth credentials missing! Deployment will fail during auth attempts.")
  console.error("[v0] Make sure these Vercel env vars are set:")
  console.error("[v0]   - GOOGLE_CLIENT_ID")
  console.error("[v0]   - GOOGLE_CLIENT_SECRET")
}

export const authConfig = {
  providers: [
    Google({
      clientId: envVars.googleClientId || "",
      clientSecret: envVars.googleClientSecret || "",
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedIn({
      clientId: envVars.linkedinClientId || "",
      clientSecret: envVars.linkedinClientSecret || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: envVars.nextAuthSecret,
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
    jwt: async ({ token, account, profile }) => {
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
        token.linkedinProfile = profile
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub || ""
        ;(session as any).accessToken = token.accessToken
        ;(session as any).provider = token.provider
        ;(session as any).linkedinProfile = token.linkedinProfile
      }
      return session
    },
  },
} satisfies NextAuthConfig
