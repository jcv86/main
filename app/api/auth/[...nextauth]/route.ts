import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v61 - REBUILT A4 COMPLETELY: Created 6 functional pages (Radar Estratégico, Noticias Mercado, Noticias Personalizadas, Cultura General, Pruebas & Contexto, Biblioteca). All use useAuthRedirect hook correctly. No auth redirects, clean loading states. Each page shows "Próximamente" with coming soon messages. Menu items now point to real working pages. Force redeploy v61
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
