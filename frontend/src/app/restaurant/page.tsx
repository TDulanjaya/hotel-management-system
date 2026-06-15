import Link from "next/link";
import AppSidebar from "@/components/layout/AppSidebar";
import { ClipboardList, CalendarDays, Table2, Utensils } from "lucide-react";

const restaurantPages = [
  {
    title: "Table Management",
    description: "View restaurant floor plan, table status, and table summary.",
    href: "/restaurant/tables",
    icon: Table2,
  },
  {
    title: "Restaurant Orders",
    description: "Manage food orders, kitchen tickets, and order status.",
    href: "/restaurant/orders",
    icon: Utensils,
  },
  {
    title: "Table Reservations",
    description: "Manage restaurant booking list and upcoming reservations.",
    href: "/restaurant/reservations",
    icon: CalendarDays,
  },
];

export default function RestaurantPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="min-h-screen px-8 py-10 lg:ml-[280px]">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
            LuxeStay Restaurant
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            Restaurant Management
          </h1>

          <p className="mt-3 max-w-2xl text-[#4d4635]">
            Manage restaurant tables, orders, and reservations from one place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {restaurantPages.map((page) => {
            const Icon = page.icon;

            return (
              <Link
                key={page.href}
                href={page.href}
                className="group rounded-2xl border border-[#d0c5af] bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#d4af37] text-[#554300] transition group-hover:scale-110">
                  <Icon size={30} />
                </div>

                <h2 className="text-2xl font-bold">{page.title}</h2>

                <p className="mt-3 text-sm leading-relaxed text-[#4d4635]">
                  {page.description}
                </p>

                <p className="mt-6 text-sm font-bold text-[#735c00]">
                  Open Page →
                </p>
              </Link>
            );
          })}
        </div>

        <section className="mt-10 rounded-2xl border border-[#d0c5af] bg-[#131b2e] p-8 text-white">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-[#d4af37]" />
            <h2 className="text-2xl font-bold">Restaurant Module Flow</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-5">
              <h3 className="font-bold text-[#d4af37]">Tables</h3>
              <p className="mt-2 text-sm text-white/75">
                Check available, reserved, occupied, and cleaning tables.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-5">
              <h3 className="font-bold text-[#d4af37]">Orders</h3>
              <p className="mt-2 text-sm text-white/75">
                Send restaurant orders to kitchen and update order status.
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-5">
              <h3 className="font-bold text-[#d4af37]">Reservations</h3>
              <p className="mt-2 text-sm text-white/75">
                Handle table bookings, shift reservations, and guest requests.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}