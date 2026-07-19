export default function ReportsLoading() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] px-8 py-10 lg:ml-[280px]">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-3">
        <div className="h-4 w-32 animate-pulse rounded bg-[#e8e2d5]" />
        <div className="h-9 w-64 animate-pulse rounded-lg bg-[#e0d6c3]" />
        <div className="h-5 w-96 animate-pulse rounded bg-[#e8e2d5]" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm"
          >
            <div className="h-4 w-24 rounded bg-[#e8e2d5]" />
            <div className="mt-4 h-8 w-36 rounded-md bg-[#e0d6c3]" />
          </div>
        ))}
      </div>

      {/* Content / Chart Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 h-6 w-48 rounded bg-[#e0d6c3]" />
          <div className="h-56 w-full rounded-xl bg-[#f5f0e6]" />
        </div>
        <div className="h-80 animate-pulse rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
          <div className="mb-6 h-6 w-36 rounded bg-[#e0d6c3]" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-full rounded-lg bg-[#f5f0e6]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
