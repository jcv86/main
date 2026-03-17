import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v43 - Fixed A1 Report to fetch from despega_a1_test_results (where UnifiedTestSystem saves) with fallback to canon_disc_responses. Crash resolved. - force redeploy v43
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
