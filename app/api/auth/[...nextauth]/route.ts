import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Fixed /auth redirect to /auth/signin with all OAuth options - v16
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
