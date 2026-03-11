export default function ArticleCardSkeleton() {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-52 bg-gray-200"></div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Date and Reading Time Skeleton */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Footer Skeleton */}
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </article>
  );
}