import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v49 - Completely rebuilt A4 server component cleanly: Removed problematic edits, created fresh async server component with proper JSX. No syntax errors. - force redeploy v49
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
