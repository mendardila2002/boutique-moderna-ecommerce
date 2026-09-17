export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="h-20 border-b animate-pulse bg-gray-50" />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Skeleton */}
        <div className="mb-20 text-center space-y-4">
          <div className="h-16 w-64 bg-gray-100 mx-auto rounded-2xl animate-pulse" />
          <div className="h-px w-20 bg-gray-200 mx-auto" />
          <div className="h-6 w-48 bg-gray-50 mx-auto rounded-lg animate-pulse" />
        </div>

        {/* Filter Skeleton */}
        <div className="flex justify-center gap-4 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-50 rounded-md animate-pulse" />
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] bg-gray-100 rounded-[2.5rem] animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-gray-50 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
