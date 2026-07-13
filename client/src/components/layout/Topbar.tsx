export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <p className="text-sm text-slate-500">Welcome back</p>
        <h2 className="text-xl font-bold text-slate-900">Hotel Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search rooms, guests, events..."
          className="w-80 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-yellow-500"
        />

        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Notifications
        </button>

        <div className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-yellow-400">
          Manager
        </div>
      </div>
    </header>
  );
}