import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Fixed email login - removed non-existent role/name columns - v19
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
