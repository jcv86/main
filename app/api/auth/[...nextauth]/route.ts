import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// CLEAN BUILD v34 - Fixed simulations page duplicated JSX. All A3 syntax errors resolved. Fully navigable and operational. - force redeploy v34
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
