import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CareersLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-2/3 mx-auto mb-8 bg-white/20" />
            <div className="flex items-center justify-center space-x-8 mb-8">
              <Skeleton className="h-5 w-32 bg-white/20" />
              <Skeleton className="h-5 w-32 bg-white/20" />
              <Skeleton className="h-5 w-32 bg-white/20" />
            </div>
            <Skeleton className="h-12 w-48 mx-auto bg-white/20" />
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-12 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
            </div>

            {/* Filter Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-5 w-48 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-32" />
                ))}
              </div>
            </div>

            {/* Job Cards Skeleton */}
            <div className="grid gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <Skeleton className="h-6 w-full mb-4" />
                        <div className="flex flex-wrap gap-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                      <div className="space-y-2">
                        {[...Array(4)].map((_, j) => (
                          <Skeleton key={j} className="h-4 w-full" />
                        ))}
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
