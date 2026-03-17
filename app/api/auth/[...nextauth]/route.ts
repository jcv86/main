import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v52 - Fixed A4 infinite redirect loop: Changed useEffect dependency array from [supabase, router] to []. Effect now runs only once on mount, preventing re-authentication checks that trigger false redirects. - force redeploy v52
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
