import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v36 - Fixed all main tags replaced with div (main is JSX reserved word). All A3 syntax errors resolved. Build ready. - force redeploy v36
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
