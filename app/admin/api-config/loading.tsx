import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function APIConfigLoading() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <Skeleton className="h-10 w-80 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />

        <Card>
          <CardContent className="py-6">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
