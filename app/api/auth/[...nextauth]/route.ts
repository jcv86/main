import NextAuth from "next-auth"
import { authconfig } from "@/lib/auth"

// PRODUCTION BUILD v44 - Fixed disc-calculator: Converted all DISC terminology (D, I, S, C) to Despega dimensions (Energía, Enfoque, Relaciones, Plan Ejecutivo). All assessment profiles now use correct terminology. - force redeploy v44
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
