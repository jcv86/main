import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Simplified OAuth callbacks - force redeploy v9
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
