export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-yellow-500"></div>

        <p className="mt-4 text-sm uppercase tracking-[0.3em] text-yellow-500">
          Loading
        </p>

        <p className="mt-2 text-slate-300">
          Preparing LuxeStay Operations Suite...
        </p>
      </div>
    </main>
  );
}