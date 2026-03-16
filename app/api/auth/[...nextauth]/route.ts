import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Complete A1-A4 implementation + Coach IA + Admin Dashboard + Final redeploy v24
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
