import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v45 - Fixed NextAuth route import typo: authconfig → authConfig. Build error resolved. - force redeploy v45
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
