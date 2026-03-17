import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v41 - Fixed cv-ats extra closing brace syntax error. Arrow function structure now correct. Build clean. - force redeploy v41
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
