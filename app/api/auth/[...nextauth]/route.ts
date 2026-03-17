import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v60 - FIXED A4 REDIRECT DRAMA: Deleted all broken subpages (/noticias, /radar, /aprender, /biblioteca, /noticia/[id]). Converted A4 to informational hub only - no broken links or auth redirects. Uses useAuthRedirect hook for session management. A4 now works cleanly. Force redeploy v60
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
