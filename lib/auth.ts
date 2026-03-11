import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
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
