import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// RLS disabled for OAuth testing - force redeploy v13
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
