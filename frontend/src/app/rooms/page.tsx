import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const roomTypes = ["All Rooms", "Suite", "Deluxe", "Standard"];

const statusFilters = [
  { label: "Available", count: 14, color: "green" },
  { label: "Cleaning", count: 4, color: "yellow" },
  { label: "Occupied", count: 22, color: "red" },
  { label: "Maintenance", count: 2, color: "gray" },
];

const rooms = [
  {
    number: "402",
    type: "Presidential Suite",
    bed: "King",
    floor: "Floor 4",
    status: "AVAILABLE",
    statusColor: "green",
    note: "Inspected",
    price: "$1,250",
    buttons: ["View Details", "Quick Book"],
  },
  {
    number: "308",
    type: "Deluxe",
    bed: "King",
    floor: "Floor 3",
    status: "CLEANING",
    statusColor: "yellow",
    note: "In Progress - 15m left",
    price: "$450",
    buttons: ["View Details", "Locked"],
  },
  {
    number: "215",
    type: "Standard",
    bed: "Twin",
    floor: "Floor 2",
    status: "OCCUPIED",
    statusColor: "red",
    note: "Guest: Mr. Alexander Thorne",
    price: "$280",
    buttons: ["Guest Folio", "Service Req."],
  },
  {
    number: "501",
    type: "Executive Suite",
    bed: "Suite",
    floor: "Floor 5",
    status: "MAINTENANCE",
    statusColor: "gray",
    note: "AC Repair Required",
    price: "$950",
    buttons: ["Work Order", "Blocked"],
  },
  {
    number: "403",
    type: "Junior Suite",
    bed: "Queen",
    floor: "Floor 4",
    status: "AVAILABLE",
    statusColor: "green",
    note: "Ready for Check-in",
    price: "$680",
    buttons: ["View Details", "Quick Book"],
  },
];

function getStatusStyles(color: string) {
  if (color === "green") {
    return {
      card: "border-l-green-500",
      badge: "bg-green-100 text-green-700",
      dot: "bg-green-500",
      filter: "border-green-200 bg-green-50 text-green-700",
    };
  }

  if (color === "yellow") {
    return {
      card: "border-l-yellow-500",
      badge: "bg-yellow-100 text-yellow-700",
      dot: "bg-yellow-500",
      filter: "border-yellow-200 bg-yellow-50 text-yellow-700",
    };
  }

  if (color === "red") {
    return {
      card: "border-l-red-500",
      badge: "bg-red-100 text-red-700",
      dot: "bg-red-500",
      filter: "border-red-200 bg-red-50 text-red-700",
    };
  }

  return {
    card: "border-l-slate-400",
    badge: "bg-slate-100 text-slate-700",
    dot: "bg-slate-500",
    filter: "border-slate-200 bg-slate-50 text-slate-700",
  };
}

export default function RoomsPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />

        <main className="lg:ml-[280px]">
          <header className="sticky top-0 z-20 flex h-[80px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
            <div className="hidden items-center gap-3 xl:flex">
              <p className="text-xl font-semibold leading-tight">
                LuxeStay <br /> Operations
              </p>
            </div>

            <div className="flex flex-1 justify-center">
              <div className="flex w-full max-w-[520px] items-center gap-3 rounded-full border border-[#d9cfbd] bg-white px-5 py-3 shadow-sm">
                <span className="text-xl">⌕</span>

                <input
                  type="text"
                  placeholder="Search rooms, guests, bookings..."
                  className="w-full bg-transparent text-lg outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="text-2xl transition hover:scale-110">
                ♧
              </button>

              <a
                href="/reservations/new"
                className="rounded-xl bg-[#806300] px-8 py-4 text-lg font-semibold text-white transition hover:-translate-y-1 hover:bg-[#6b5400] hover:shadow-xl"
              >
                + New Reservation
              </a>

              <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#d8b328] bg-white shadow">
                🧑
              </div>
            </div>
          </header>

          <section className="px-8 py-10">
            <div className="room-fade mb-12 flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Rooms Module
                </p>

                <h1 className="mt-3 text-4xl font-bold text-[#735c00]">
                  Room Management
                </h1>

                <p className="mt-2 text-xl text-[#3f3b35]">
                  Manage inventory, monitor room status, and handle maintenance.
                </p>
              </div>

              <button className="rounded-2xl bg-[#d8b328] px-8 py-4 text-lg font-semibold text-[#4c3a00] shadow-lg transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl">
                ⊕ Add Room
              </button>
            </div>

            <div className="room-fade delay-100 mb-5 flex flex-wrap items-center gap-5">
              <div className="flex overflow-hidden rounded-xl bg-[#ebe8e2] p-1">
                {roomTypes.map((type, index) => (
                  <button
                    key={type}
                    className={`px-8 py-3 text-lg transition ${
                      index === 0
                        ? "rounded-lg bg-white text-[#806300] shadow"
                        : "text-[#4c4032] hover:bg-white/60"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="hidden h-12 w-px bg-[#d9cfbd] md:block" />
            </div>

            <div className="room-fade delay-150 mb-8 flex flex-wrap gap-3">
              {statusFilters.map((filter) => {
                const styles = getStatusStyles(filter.color);

                return (
                  <button
                    key={filter.label}
                    className={`flex items-center gap-3 rounded-full border px-5 py-3 text-lg transition hover:-translate-y-1 hover:shadow-md ${styles.filter}`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${styles.dot}`}
                    />
                    {filter.label} ({filter.count})
                  </button>
                );
              })}
            </div>

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
              {rooms.map((room, index) => {
                const styles = getStatusStyles(room.statusColor);

                return (
                  <article
                    key={room.number}
                    className={`room-card room-fade rounded-2xl border border-[#d9cfbd] border-l-4 bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-2xl ${styles.card}`}
                    style={{ animationDelay: `${0.18 + index * 0.07}s` }}
                  >
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-extrabold">
                          Room {room.number}
                        </h2>

                        <p className="mt-1 text-xl text-[#3f3b35]">
                          {room.type}
                        </p>

                        <p className="mt-1 text-lg text-[#3f3b35]">
                          {room.bed} • {room.floor}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-4 py-2 text-sm font-extrabold tracking-widest ${styles.badge}`}
                      >
                        {room.status}
                      </span>
                    </div>

                    <div className="mb-6 flex min-h-[58px] items-center gap-3 text-lg text-[#3f3b35]">
                      <span className="text-xl">
                        {room.statusColor === "red"
                          ? "♙"
                          : room.statusColor === "yellow"
                          ? "▥"
                          : room.statusColor === "gray"
                          ? "♨"
                          : "◉"}
                      </span>

                      <span
                        className={
                          room.statusColor === "gray" ? "text-red-600" : ""
                        }
                      >
                        {room.note}
                      </span>
                    </div>

                    <div className="mb-6">
                      <strong className="text-2xl">{room.price}</strong>
                      <span className="text-lg text-[#3f3b35]"> / night</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="rounded-xl bg-[#ece9e2] px-4 py-3 text-lg text-[#181818] transition hover:bg-[#ded8cc]">
                        {room.buttons[0]}
                      </button>

                      <button
                        className={`rounded-xl px-4 py-3 text-lg transition hover:-translate-y-1 hover:shadow-lg ${
                          room.buttons[1] === "Quick Book"
                            ? "bg-[#806300] text-white"
                            : room.buttons[1] === "Service Req."
                            ? "bg-[#4b5872] text-white"
                            : "bg-[#eee6ce] text-[#d0a100]"
                        }`}
                      >
                        {room.buttons[1]}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}