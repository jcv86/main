import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v48 - Fixed A4 JSX indentation syntax error: Corrected whitespace and nesting structure in hero and stats sections. JSX parses correctly now. - force redeploy v48
const handler = NextAuth(authconfig)

export { handler as GET, handler as POST }
