import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { createClient } from "@/lib/supabase/server"
import { enrichProfileFromGoogle, enrichProfileFromLinkedIn } from "@/lib/enrich-profile"

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

// CRITICAL: Verify secret exists before creating auth config
if (!envVars.nextAuthSecret) {
  console.error("[v0] CRITICAL ERROR: NEXTAUTH_SECRET is not set! Session creation will fail.")
  console.error("[v0] Add NEXTAUTH_SECRET to Vercel Environment Variables immediately.")
}

// Debug: Log the exact OAuth URLs being used
const debugOAuthConfig = () => {
  // Remove trailing slash from NEXTAUTH_URL
  const baseUrl = (process.env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/$/, '')
  console.log("[v0] OAuth Configuration - CORRECTED:")
  console.log("[v0] Raw NEXTAUTH_URL env:", process.env.NEXTAUTH_URL)
  console.log("[v0] Cleaned baseUrl:", baseUrl)
  console.log("[v0] Google Callback URL (actual):", `${baseUrl}/api/auth/callback/google`)
  console.log("[v0] LinkedIn Callback URL (actual):", `${baseUrl}/api/auth/callback/linkedin`)
  console.log("[v0] These MUST match Google Console and LinkedIn Console redirect URIs")
}

debugOAuthConfig()

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: envVars.googleClientId || "",
      clientSecret: envVars.googleClientSecret || "",
      allowDangerousEmailAccountLinking: true,
      // Request specific OAuth scopes/permissions
      authorization: {
        params: {
          scope: "openid profile email",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    LinkedIn({
      clientId: envVars.linkedinClientId || "",
      clientSecret: envVars.linkedinClientSecret || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  }),
  basePath: "/api/auth",
  session: {
    strategy: "jwt",
  },
  secret: envVars.nextAuthSecret,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  trustHost: true,
  // USE THE CORRECT NEXTAUTH_URL WITHOUT TRAILING SLASH
  // This is where NextAuth gets the base URL for callback URLs
  url: process.env.NEXTAUTH_URL?.replace(/\/$/, '') || 'http://localhost:3000',
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
    signIn: async ({ user, account, profile }) => {
      console.log("[v0] SignIn - provider:", account?.provider, "email:", user?.email, "userId:", user?.id)
      
      try {
        // Enrich profile from OAuth provider
        if (user?.id) {
          if (account?.provider === 'google' && profile) {
            console.log("[v0] Enriching Google profile for user:", user.id)
            await enrichProfileFromGoogle(user.id, {
              email: profile.email || user.email || '',
              name: profile.name || user.name || '',
              image: profile.image || user.image,
            })
          } else if (account?.provider === 'linkedin' && profile && account.access_token) {
            console.log("[v0] Enriching LinkedIn profile for user:", user.id)
            try {
              await enrichProfileFromLinkedIn(user.id, profile, account.access_token)
            } catch (linkedinError) {
              console.warn("[v0] LinkedIn enrichment failed (non-blocking):", linkedinError)
              // Don't fail signin if LinkedIn enrichment fails
            }
          }
        }
      } catch (enrichError) {
        console.error("[v0] Profile enrichment error:", enrichError)
        // Don't block signin if enrichment fails
      }
      
      return true
    },
    jwt: async ({ token, account, profile, user }) => {
      console.log("[v0] JWT callback - user:", user?.email, "account:", account?.provider)
      
      // First time user logs in
      if (user) {
        token.email = user.email || ""
        token.name = user.name || ""
        token.image = user.image || ""
        console.log("[v0] JWT set token from user - email:", token.email)
      }
      
      // Save provider and access token
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
        console.log("[v0] JWT set token from account - provider:", account.provider)
      }
      
      console.log("[v0] JWT callback DONE - token.email:", token.email)
      return token
    },
    session: async ({ session, token }) => {
      console.log("[v0] Session callback - token.email:", token.email, "session.user:", session?.user?.email)
      
      // Populate session from token
      if (session.user) {
        session.user.id = token.sub || ""
        session.user.email = (token.email as string) || ""
        session.user.name = (token.name as string) || ""
        session.user.image = (token.image as string) || ""
        console.log("[v0] Session callback DONE - session.user.email:", session.user.email)
      } else {
        console.log("[v0] Session callback WARNING - session.user is undefined!")
      }
      
      return session
    },
    redirect: async ({ url, baseUrl }) => {
      console.log("[v0] Redirect callback - url:", url, "baseUrl:", baseUrl)
      
      try {
        const redirectUrl = `${baseUrl}/despega/conozcamonos-1`
        console.log("[v0] Redirecting to:", redirectUrl)
        return redirectUrl
      } catch (error) {
        console.error("[v0] Redirect error:", error)
        return `${baseUrl}/despega/conozcamonos-1`
      }
    },
  },
} satisfies NextAuthConfig
