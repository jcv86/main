import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Fixed complete A1→A2→A3→A4 flow with correct redirects and navbar - force redeploy v27
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
