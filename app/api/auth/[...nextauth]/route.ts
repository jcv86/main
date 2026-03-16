import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Added complete navigation bar for all A1-A4 routes and admin - force redeploy v25
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
