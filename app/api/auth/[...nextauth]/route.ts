import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Fixed LinkedIn email validation - force redeploy v8
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
