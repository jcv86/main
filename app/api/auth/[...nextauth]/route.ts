import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Fixed all /login redirects to /auth/signin and verified complete A1-A4 flow - force redeploy v28
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
