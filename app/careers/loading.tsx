import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CareersLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-blue to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-2/3 mx-auto mb-8 bg-white/20" />
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-32 bg-white/20" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-48 mt-4 md:mt-0" />
        </div>

        {/* Job Cards Skeleton */}
        <div className="grid gap-6 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-6 w-64" />
                      <Skeleton className="h-5 w-16" />
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <Skeleton key={j} className="h-4 w-24" />
                      ))}
                    </div>

                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />

                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((k) => (
                        <Skeleton key={k} className="h-6 w-32" />
                      ))}
                    </div>
                  </div>

                  <Skeleton className="h-10 w-32 mt-4 md:mt-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section Skeleton */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-96 mx-auto mb-4" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <Skeleton className="h-12 w-12 mx-auto mb-4 rounded-full" />
                  <Skeleton className="h-5 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mx-auto mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Process Section Skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-80 mx-auto mb-4" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
