import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v53 - Fixed A4 redirect issue: Changed from getUser() to onAuthStateChange() subscription to properly wait for session to load. Now waits for real auth state before checking, preventing premature redirects. - force redeploy v53
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
