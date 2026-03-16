import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// Expanded A3 (Guided Training, CV ATS, Job Matching) and A4 (Personalized News, Context Tests) - force redeploy v29
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
