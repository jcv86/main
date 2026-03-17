import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v43 - Fixed A1 Report crash: removed references to non-existent properties (profile_type, ideal_role, motivators, etc). Now uses correct DiscInterpretation interface. Rendering works. - force redeploy v43
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
