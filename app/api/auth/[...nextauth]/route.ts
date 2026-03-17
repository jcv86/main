import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v47 - Fixed A4 SessionProvider error: Converted A4 to server component using getServerSession instead of useSession(). No SessionProvider needed. - force redeploy v47
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
