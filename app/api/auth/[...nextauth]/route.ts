import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Fixed redirect callback error handling - force redeploy v7
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
