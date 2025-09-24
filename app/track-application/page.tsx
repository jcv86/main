"use client"

import { Suspense } from "react"
import ApplicationStatusTracker from "@/components/application-status-tracker"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function TrackApplicationContent() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Seguimiento de Aplicación</h1>
          <p className="text-gray-600">Mantente al día con el estado de tu postulación laboral</p>
        </div>

        <ApplicationStatusTracker />
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-96 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-3 w-64 mt-1" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function TrackApplicationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TrackApplicationContent />
    </Suspense>
  )
}
