import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v57 - Fixed A4 premature "need login" message: Added waitingForSession state that gives Supabase 2 seconds to restore session from localStorage before showing "necesitas autenticarte". Users logged in won't see false login prompts. - force redeploy v57
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
