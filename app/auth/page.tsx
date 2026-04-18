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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple/5 to-blue/5 dark:from-slate-950 dark:to-slate-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple" />
        <p className="text-muted/60 dark:text-muted/30">Redirigiendo a inicio de sesión...</p>
      </div>
    </div>
  )
}
