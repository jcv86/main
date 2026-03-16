import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// FULLY OPERATIONAL A3 - All 4 simulation levels (Guided→Structured→Challenging→Mastery) now clickable. All A3 routes active. All navigation fixed. - force redeploy v33
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
