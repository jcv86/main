import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v56 - Fixed A1 Cerebral syntax error: Removed unreachable code after function closure, moved helper functions (calculateResults, getDimensionInfo) before renderStage() definition. Proper function structure now. - force redeploy v56
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
