"use client"

import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useSession } from "@/components/session-wrapper"

export function AuthRedirect() {
  const router = useRouter()
  const { user } = useSession()

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user?.email) {
      console.log("[v0] User logged in on homepage, redirecting to dashboard...")
      router.push("/dashboard")
    }
  }, [user, router])

  return null
}
