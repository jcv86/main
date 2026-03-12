import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Added redirect callback - force redeploy v6
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
