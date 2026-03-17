import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v50 - Fixed A4 auth redirect: Changed getServerSession() to use default config instead of passing authConfig directly. Session detection now works properly. - force redeploy v50
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
