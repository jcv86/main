"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to signin page with full OAuth + Email options
    router.push("/auth/signin")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="text-slate-600 dark:text-slate-300">Redirigiendo a inicio de sesión...</p>
      </div>
    </div>
  )
}
