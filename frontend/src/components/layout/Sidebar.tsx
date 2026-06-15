"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: "▦" },
  { name: "Owner Dashboard", href: "/dashboard/owner", icon: "♛" },
  { name: "Manager Dashboard", href: "/dashboard/manager", icon: "▣" },
  { name: "Receptionist Dashboard", href: "/dashboard/receptionist", icon: "♙" },

  { name: "Rooms", href: "/rooms", icon: "▰" },
  { name: "Reservations", href: "/reservations", icon: "▣" },
  { name: "Guests", href: "/guests", icon: "♙" },
  { name: "Folio / Billing", href: "/folio", icon: "▤" },

  { name: "Restaurant", href: "/restaurant", icon: "🍽" },
  { name: "Restaurant Tables", href: "/restaurant/tables", icon: "▦" },
  { name: "Restaurant Orders", href: "/restaurant/orders", icon: "▤" },
  { name: "Restaurant Reservations", href: "/restaurant/reservations", icon: "▣" },

  { name: "Games & Amenities", href: "/games", icon: "🎮" },
  { name: "Games List", href: "/games/list", icon: "▤" },
  { name: "New Game Session", href: "/games/new-session", icon: "+" },
  { name: "Game Sessions", href: "/games/sessions", icon: "▣" },

  { name: "Room Service", href: "/room-service", icon: "⌂" },
  { name: "Kitchen", href: "/kitchen", icon: "▥" },
  { name: "Inventory", href: "/inventory", icon: "▧" },
  { name: "Parking", href: "/parking", icon: "P" },
  { name: "Events", href: "/events", icon: "▣" },
  { name: "Venues", href: "/venues", icon: "▥" },

  { name: "Reports", href: "/reports", icon: "▨" },
  { name: "Payments", href: "/payments", icon: "$" },
  { name: "Payment List", href: "/payments/list", icon: "▤" },
  { name: "New Payment", href: "/payments/new", icon: "+" },

  { name: "Audit Logs", href: "/audit-logs", icon: "☷" },
  { name: "Users", href: "/users", icon: "♙" },
  { name: "Roles", href: "/roles", icon: "⚙" },

  { name: "Games & Amenities", href: "/games", icon: "🎮" },
{ name: "Games List", href: "/games/list", icon: "▤" },
{ name: "New Game Session", href: "/games/new-session", icon: "+" },
{ name: "Game Sessions", href: "/games/sessions", icon: "▣" },

{ name: "Events", href: "/events", icon: "▣" },
{ name: "Event List", href: "/events/list", icon: "▤" },
{ name: "New Event", href: "/events/new", icon: "+" },
{ name: "Master Event Ledger", href: "/events/ledger", icon: "▥" },

{ name: "Users", href: "/users", icon: "♙" },
{ name: "Users List", href: "/users/list", icon: "▤" },
{ name: "New User", href: "/users/new", icon: "+" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] bg-[#101827] text-white shadow-2xl lg:flex lg:flex-col">
      <div className="px-8 py-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#d8b328]">
          LuxeStay
        </h1>

        <p className="mt-2 text-sm uppercase tracking-[0.25em] text-[#677386]">
          Elite Operations
        </p>
      </div>

      <nav className="sidebar-scroll flex-1 space-y-1 overflow-y-auto px-5 pb-5">
        {menuItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`lux-sidebar-link flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "border-l-4 border-[#d8b328] bg-[#263248] text-[#f2c426]"
                  : "text-[#a6adba] hover:bg-[#263248] hover:text-[#f2c426]"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center text-lg font-bold">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-5">
        <button className="mb-4 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
            ?
          </span>
          Support
        </button>

        <Link
          href="/reservations/new"
          className="block w-full rounded-xl bg-[#d8b328] px-5 py-4 text-center text-sm font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
        >
          New Reservation
        </Link>
      </div>
    </aside>
  );
}