import { Suspense } from "react"
import ReviewWorkflowDashboard from "@/components/review-workflow-dashboard"

export default function ReviewWorkflowPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Cargando workflow de revisión...</div>}>
        <ReviewWorkflowDashboard />
      </Suspense>
    </div>
  )
}
