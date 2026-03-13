import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Added email login form to signin page - force redeploy v15
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
