import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// FINAL A3 COMPREHENSIVE BUILD - 8 Pages: Guided Interview, Structured, Challenging, Mastery Simulations, Guided Training (3 modules), CV ATS (2 formats), Job Matching, Analytics Dashboard, Feedback System - force redeploy v32
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
