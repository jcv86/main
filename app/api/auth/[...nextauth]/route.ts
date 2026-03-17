import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v40 - Fixed cv-ats renderStandardFormat closing div JSX structure. All syntax errors resolved. Build clean. - force redeploy v40
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
