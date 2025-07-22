export default function LibraryLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-96 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Books Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
