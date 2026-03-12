import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Added detailed logging to diagnose OAuth callback failure - v10
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
