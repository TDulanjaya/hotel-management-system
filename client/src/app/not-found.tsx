export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-500">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          Page Not Found
        </h1>

        <p className="mt-3 text-slate-300">
          The page you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}