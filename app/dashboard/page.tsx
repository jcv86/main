"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import DashboardContent from "@/components/dashboard-content"

export default function DashboardPage() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && !user && mounted) {
      router.push("/")
    }
  }, [user, isLoading, router, mounted])

  // Show loading only briefly
  if (!mounted || (isLoading && !user)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to home
  }

  return <DashboardContent />
}
