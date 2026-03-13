import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Added Supabase query logging to diagnose email login - v18
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
