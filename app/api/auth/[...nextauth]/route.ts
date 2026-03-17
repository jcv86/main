import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v55 - FIXED AUTH REDIRECT LOOP: Updated useAuthRedirect hook to NOT redirect on INITIAL_SESSION event, only on explicit SIGNED_OUT. Fixed A1 Cerebral, A1 Report to handle loading/auth states properly - shows login link instead of auto-redirecting. Only shows content when user confirmed. - force redeploy v55
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
