import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v54 - SYSTEMATIC FIX: Created useAuthRedirect hook with onAuthStateChange(). Applied consistently across A1 Cerebral, A1 Report, A2 Routes, A3, A3 Dashboard, A4. No more premature redirects - all pages wait for session to be fully loaded before checking auth. - force redeploy v54
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
