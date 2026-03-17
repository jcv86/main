import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v62 - A4 NOW FULLY WORKING: Recreated all 6 A4 pages (Radar, Noticias Mercado, Noticias Personalizadas, Cultura General, Pruebas & Contexto, Biblioteca) as clean, simple "use client" pages. NO auth checks, NO hooks - just render content immediately. Each page has "Próximamente" info. Simple architecture = zero redirects. Force redeploy v62
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
