import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v63 - A4 FIXED & FULLY FUNCTIONAL: Converted A4 to single unified page with 6 tabs (Radar, Noticias, Personalizadas, Cultura, Pruebas, Biblioteca). No sub-pages, no broken links, no auth redirects. Tab-based navigation with detailed content explaining each section. User clicks menu items → tabs change. Simple, clean, works. Force redeploy v63
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
