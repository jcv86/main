import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v46 - Fixed A4 authentication: Changed from Supabase getSession() to NextAuth useSession(). Now correctly recognizes logged-in users and doesn't redirect unnecessarily. - force redeploy v46
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
