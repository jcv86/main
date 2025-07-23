"use client"

import { MirixMemoryDashboard } from "@/components/mirix-memory-dashboard"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

// Helper function to ensure we have a valid UUID for demo purposes
function ensureValidUUID(userId: string): string {
  // If it's already a valid UUID format, return it
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    return userId
  }

  // For demo user, return a consistent UUID
  if (userId === "demo-user-123" || userId === "demo-user") {
    return "12345678-1234-4123-8123-123456789012"
  }

  // For other cases, generate a UUID based on the string
  // This is a simple hash-to-UUID conversion for demo purposes
  const hash = userId.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const hex = Math.abs(hash).toString(16).padStart(8, "0")
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-8${hex.slice(1, 4)}-${hex.slice(0, 12).padEnd(12, "0")}`
}

export default function MirixPage() {
  const { user } = useAuth()
  const [userId, setUserId] = useState<string>("")

  useEffect(() => {
    // Use authenticated user ID if available, otherwise use demo user
    const rawUserId = user?.id || "demo-user-123"
    const validUserId = ensureValidUUID(rawUserId)
    setUserId(validUserId)
  }, [user])

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Inicializando sistema de memoria...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MirixMemoryDashboard userId={userId} />
    </div>
  )
}
