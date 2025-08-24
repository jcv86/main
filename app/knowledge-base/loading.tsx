import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function KnowledgeBaseLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Header */}
        <div className="mb-8">
          <div className="h-10 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-muted rounded w-2/3"></div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="h-10 bg-muted rounded w-full mb-4"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-8 bg-muted rounded w-24"></div>
            <div className="h-8 bg-muted rounded w-28"></div>
          </div>
        </div>

        {/* Featured Articles */}
        <div className="mb-12">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-24"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full mb-4"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
