"use client";
export default function ErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-red-400">
          Error
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-3 text-slate-300">
          Please refresh the page or try again.
        </p>
      </div>
    </main>
  );
}