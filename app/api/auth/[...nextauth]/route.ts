import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v58 - Refactored A4 as Strategic Radar: Created 6 modular components (Panorama del Día, Chile en Números, Noticias Base, Qué Significa Para Ti, Mini Test). Replaced hub page with structured editorial flow. Database-backed personalization by profile. Force redeploy v58
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
