import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BibliotecaLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted/10 p-1 rounded-lg w-fit mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="w-48 h-10" />
            <Skeleton className="w-32 h-10" />
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading Message */}
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando biblioteca...</p>
        </div>
      </div>
    </div>
  )
}
