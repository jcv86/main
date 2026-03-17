import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v42 - Added missing calculateDiscProfile and interpretDiscProfile exports to disc-calculator. All import errors fixed. Build ready. - force redeploy v42
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
