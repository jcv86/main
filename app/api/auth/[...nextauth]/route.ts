import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v66 - GIT CACHE CLEAR: Deleted and completely recreated both coach-sidebar.tsx (143 lines clean) and a1-cerebral/page.tsx (406 lines clean). All orphaned JSX removed. Files end with proper closing braces. Force full rebuild to clear git cache. v66
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
