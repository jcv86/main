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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple" />
        <p className="text-muted-foreground dark:text-muted/30">Redirigiendo a inicio de sesión...</p>
      </div>
    </div>
  )
}
