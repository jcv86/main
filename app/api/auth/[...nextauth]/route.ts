import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// PRODUCTION BUILD v51 - Completely rebuilt A4 as client component: Now uses "use client" and Supabase auth like rest of Despega (A2). Matches established pattern. Works with logged-in users. - force redeploy v51
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
