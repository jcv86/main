import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// LinkedIn OAuth session fix - force redeploy v4
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
