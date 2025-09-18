"use client"

import { ColorSchemeTest } from "@/components/color-scheme-test"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TestColorsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/")} className="mb-4 border-border hover:bg-muted">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        <ColorSchemeTest />
      </div>
    </div>
  )
}
