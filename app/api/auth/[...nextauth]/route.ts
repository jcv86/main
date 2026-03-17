import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v37 - Fixed cv-ats duplicate returns and syntax errors. All A3 modules syntax clean. Build ready. - force redeploy v37
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
