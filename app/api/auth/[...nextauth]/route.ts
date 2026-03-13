import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Admin password configured - real user authentication enabled - v17
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
