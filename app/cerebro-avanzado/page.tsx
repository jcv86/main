import { AdvancedBrainInterface } from "@/components/advanced-brain-interface"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function CerebroAvanzadoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <AdvancedBrainInterface />
    </Suspense>
  )
}
