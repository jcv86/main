import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Debug Google OAuth env vars - force redeploy v2
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
