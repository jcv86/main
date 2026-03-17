import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// CLEAN A3 AUDIT v38 - All 14 A3 modules verified: page, layout, diagnosis, progress, simulations, simulaciones-guiado/estructurada/desafiante/maestria, cv-ats, entrenamiento-guiado, ajuste-por-vacante, analytics, feedback. All main→div, all syntax clean, full build ready. - force redeploy v38
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
