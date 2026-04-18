import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, Loader2 } from "lucide-react"

export default function CerebroLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/5 via-white to-blue/5 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple to-blue rounded-xl shadow-lg">
              <Brain className="h-8 w-8 text-white animate-pulse" />
            </div>
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-8rem)] flex flex-col shadow-xl">
              <CardHeader className="border-b bg-purple text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg bg-white/20" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48 bg-white/20" />
                      <Skeleton className="h-4 w-64 bg-white/10" />
                    </div>
                  </div>
                </div>
              </CardHeader>

              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Loader2 className="h-16 w-16 animate-spin text-purple mx-auto" />
                  <p className="text-muted/60 dark:text-muted/40">Cargando cerebro inteligente...</p>
                </div>
              </div>

              <CardContent className="border-t p-4 bg-muted/5 dark:bg-transparent">
                <div className="flex gap-2">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
