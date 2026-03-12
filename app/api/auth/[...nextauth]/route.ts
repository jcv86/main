import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Added SupabaseAdapter for session storage - force redeploy v11
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
