import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Google OAuth credentials updated - force redeploy v3
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
