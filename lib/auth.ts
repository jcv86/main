import NextAuth from "next-auth"
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

// DIAGNOSTIC: Log exact OAuth configuration for troubleshooting
const diagnosticOAuth = () => {
  console.log("[v0] ========== OAUTH DIAGNOSTIC v3.2.0 ==========")
  console.log("[v0] Production Domain: https://www.despegatucarrera.com")
  console.log("[v0] Expected Redirect URIs (MUST match Google/LinkedIn console):")
  console.log("[v0]   Google: https://www.despegatucarrera.com/api/auth/callback/google")
  console.log("[v0]   LinkedIn: https://www.despegatucarrera.com/api/auth/callback/linkedin")
  console.log("[v0]")
  console.log("[v0] Environment Variables Status:")
  console.log("[v0]   GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "SET" : "MISSING")
  console.log("[v0]   GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "SET" : "MISSING")
  console.log("[v0]   LINKEDIN_CLIENT_ID:", process.env.LINKEDIN_CLIENT_ID ? "SET" : "MISSING")
  console.log("[v0]   LINKEDIN_CLIENT_SECRET:", process.env.LINKEDIN_CLIENT_SECRET ? "SET" : "MISSING")
  console.log("[v0]   NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "SET" : "MISSING")
  console.log("[v0]")
  console.log("[v0] NOTE: If Google/LinkedIn login fails with 'invalid_client':")
  console.log("[v0]   1. Check that redirect URIs match EXACTLY in Google/LinkedIn console")
  console.log("[v0]   2. Verify LinkedIn has 'Sign In with LinkedIn using OpenID Connect' enabled")
  console.log("[v0]   3. Confirm all env vars are set in Vercel")
  console.log("[v0] ============================================")
}

diagnosticOAuth()

// Hardcoded production URL - prevents trailing slash issues from env vars
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://www.despegatucarrera.com'
  : 'http://localhost:3000'


export const authConfig = {
  providers: [
    Google({
      clientId: envVars.googleClientId || "",
      clientSecret: envVars.googleClientSecret || "",
      allowDangerousEmailAccountLinking: true,
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
      issuer: "https://www.linkedin.com/oauth",
      wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
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
  // CRITICAL FIX: Set trustHost to false
  // This ensures NextAuth uses our explicit 'url' config instead of the Host header
  // When trustHost=true, NextAuth ignores 'url' config and uses Host header
  // This was causing callback URLs to be generated incorrectly
  trustHost: false,
  // CRITICAL: ALWAYS use the hardcoded baseUrl
  // This ensures consistent callback URLs without relying on env vars or Host header
  url: baseUrl,
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
}
