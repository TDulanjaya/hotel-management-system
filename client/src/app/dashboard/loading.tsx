export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] px-8 py-10 lg:ml-[280px]">
      {/* Top Banner Skeleton */}
      <div className="mb-10 h-36 w-full animate-pulse rounded-3xl bg-gradient-to-r from-[#e8e2d5] via-[#e0d6c3] to-[#e8e2d5] p-8 shadow-sm" />

      {/* KPI Stat Grid Skeleton */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded bg-[#e8e2d5]" />
              <div className="h-10 w-10 rounded-xl bg-[#f0e8d9]" />
            </div>
            <div className="mt-4 h-8 w-24 rounded bg-[#e0d6c3]" />
          </div>
        ))}
      </div>

      {/* Recent Activity / Table Skeleton */}
      <div className="h-96 animate-pulse rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-48 rounded bg-[#e0d6c3]" />
          <div className="h-8 w-24 rounded-lg bg-[#e8e2d5]" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full rounded-xl bg-[#f5f0e6]" />
          ))}
        </div>
      </div>
    </div>
  );
}
