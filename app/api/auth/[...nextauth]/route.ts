import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth"

// LinkedIn session callback fix - detailed logging - v5
const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
