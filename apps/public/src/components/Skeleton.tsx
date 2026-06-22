export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-wh bg-wh-outline ${className}`} />
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-wh-card border border-wh-outline bg-wh-white p-6">
          <Skeleton className="mb-4 h-5 w-3/4" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}
