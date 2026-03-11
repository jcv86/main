import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Force deployment - Google OAuth with env vars
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
