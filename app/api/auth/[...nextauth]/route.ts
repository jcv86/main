import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Clean build - MVP A1→A4 complete and stable. Flujo oficial operativo. Próximo: enriquecimiento funcional - force redeploy v30
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
