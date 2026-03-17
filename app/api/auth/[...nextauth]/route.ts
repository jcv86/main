import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v39 - Fixed cv-ats JSX nesting error (removed duplicate closing div) and a3-dashboard Card→div mismatch. All syntax errors resolved. Build ready. - force redeploy v39
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
