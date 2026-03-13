import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Completed A1-A4 full implementation with main dashboard and readiness score - v23
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
