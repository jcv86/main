import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy load the landing page component for better performance
const LandingPageOptimized = dynamic(
  () => import("@/components/landing-page-optimized").then((mod) => ({ default: mod.LandingPageOptimized })),
  {
    loading: () => <RootLoading />,
    ssr: true,
  },
)

function RootLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return <LandingPageOptimized />
}
