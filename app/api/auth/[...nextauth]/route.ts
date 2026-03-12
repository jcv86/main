import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Fixed RLS policies for OAuth user creation - force redeploy v12
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
