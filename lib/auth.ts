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

// CRITICAL: Verify secret exists before creating auth config
if (!envVars.nextAuthSecret) {
  console.error("[v0] CRITICAL ERROR: NEXTAUTH_SECRET is not set! Session creation will fail.")
  console.error("[v0] Add NEXTAUTH_SECRET to Vercel Environment Variables immediately.")
}

console.log("[v0] NextAuth Config - Secret set:", !!envVars.nextAuthSecret, "Length:", envVars.nextAuthSecret?.length || 0)

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
      console.log("[v0] Authorized callback - auth exists:", !!auth)
      return !!auth
    },
    signIn: async ({ user, account, profile }) => {
      console.log("[v0] SignIn callback - user:", user?.email, "provider:", account?.provider)
      return true
    },
    redirect: async ({ url, baseUrl }) => {
      console.log("[v0] Redirect callback - url:", url, "baseUrl:", baseUrl)
      
      try {
        // If no URL provided, default to onboarding
        if (!url) {
          console.log("[v0] No URL provided, defaulting to /despega/conozcamonos-1")
          return `${baseUrl}/despega/conozcamonos-1`
        }

        // Parse the URL safely
        const parsedUrl = new URL(url, baseUrl)
        
        // If redirecting back to signin, send to onboarding instead
        if (parsedUrl.pathname.includes("/auth/signin")) {
          console.log("[v0] User redirected from signin, sending to /despega/conozcamonos-1")
          return `${baseUrl}/despega/conozcamonos-1`
        }
        
        // Allow relative URLs
        if (parsedUrl.origin === new URL(baseUrl).origin) {
          console.log("[v0] Allowing same-origin URL:", url)
          return url
        }
        
        // Default to onboarding
        console.log("[v0] Defaulting to /despega/conozcamonos-1")
        return `${baseUrl}/despega/conozcamonos-1`
      } catch (error) {
        console.error("[v0] Redirect callback error:", error)
        return `${baseUrl}/despega/conozcamonos-1`
      }
    },
    jwt: async ({ token, account, profile, user }) => {
      console.log("[v0] JWT callback - token.sub:", token.sub, "user:", user?.email)
      
      if (user) {
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      
      if (account) {
        token.accessToken = account.access_token
        token.provider = account.provider
        token.linkedinProfile = profile
      }
      
      return token
    },
    session: async ({ session, token }) => {
      console.log("[v0] Session callback START")
      console.log("[v0]   - token.sub:", token.sub)
      console.log("[v0]   - token.email:", token.email)
      console.log("[v0]   - session.user exists:", !!session?.user)
      console.log("[v0]   - session.user.email:", session?.user?.email)
      
      if (session.user) {
        session.user.id = token.sub || ""
        session.user.email = (token.email as string) || session.user.email
        session.user.name = (token.name as string) || session.user.name
        session.user.image = (token.image as string) || session.user.image
        ;(session as any).accessToken = token.accessToken
        ;(session as any).provider = token.provider
        
        console.log("[v0] Session callback DONE - session.user.id:", session.user.id, "email:", session.user.email)
      } else {
        console.log("[v0] Session callback ERROR - session.user is undefined!")
      }
      
      return session
    },
  },
} satisfies NextAuthConfig
