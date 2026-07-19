export default function RoomsLoading() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] px-8 py-10 lg:ml-[280px]">
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-[#e8e2d5]" />
          <div className="h-9 w-64 animate-pulse rounded-lg bg-[#e0d6c3]" />
          <div className="h-5 w-80 animate-pulse rounded bg-[#e8e2d5]" />
        </div>
        <div className="h-11 w-40 animate-pulse rounded-xl bg-[#e0d6c3]" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="mb-8 flex flex-wrap gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-28 animate-pulse rounded-xl bg-[#e8e2d5]" />
        ))}
      </div>

      {/* Rooms Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-[#d0c5af] bg-white shadow-sm animate-pulse"
          >
            <div className="h-48 w-full bg-[#e8e2d5]" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 w-32 rounded bg-[#e0d6c3]" />
                <div className="h-6 w-20 rounded-full bg-[#e8e2d5]" />
              </div>
              <div className="h-4 w-full rounded bg-[#f5f0e6]" />
              <div className="h-4 w-2/3 rounded bg-[#f5f0e6]" />
              <div className="pt-2 flex justify-between items-center">
                <div className="h-8 w-24 rounded bg-[#e0d6c3]" />
                <div className="h-9 w-28 rounded-lg bg-[#e8e2d5]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
