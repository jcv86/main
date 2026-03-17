import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v59 - Fixed A4 redirect loop: Removed broken component imports, simplified A4 page to hub with 4 main sections (Radar, Noticias, Aprender, Biblioteca). No complex components causing redirects. Clean, working interface. Force redeploy v59
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
