import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v35 - Fixed all syntax errors: simulations main→div, disc-assessment redirect to a1-cerebral. A3 fully operational. All routes accessible. - force redeploy v35
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
