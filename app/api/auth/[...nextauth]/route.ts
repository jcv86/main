import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v64 - FIXED SYNTAX ERRORS: Removed duplicate JSX code from coach-sidebar.tsx and orphaned JSX from a1-cerebral/page.tsx. Both files now have proper syntax with correctly closed components. Build errors resolved. Force redeploy v64
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
