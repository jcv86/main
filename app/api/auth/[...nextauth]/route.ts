import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v65 - CLEARED BUILD CACHE: Rewrote coach-sidebar.tsx completely to remove all orphaned JSX. File is now 163 lines of clean code with no trailing JSX outside component. Build cache should be cleared on redeploy. Force redeploy v65
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
