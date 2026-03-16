import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Fixed A1 Assessment - using correct A1 Cerebral route instead of DISC - force redeploy v26
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
