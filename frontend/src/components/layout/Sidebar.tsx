"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: "▦" },
  { name: "Rooms", href: "/rooms", icon: "▰" },
  { name: "Reservations", href: "/reservations", icon: "▣" },
  { name: "Guests", href: "/guests", icon: "♙" },
  { name: "Folio / Billing", href: "/folio", icon: "▤" },
  { name: "Room Service", href: "/room-service", icon: "⌂" },
  { name: "Kitchen", href: "/kitchen", icon: "▥" },
  { name: "Inventory", href: "/inventory", icon: "▧" },
  { name: "Parking", href: "/parking", icon: "P" },
  { name: "Events", href: "/events", icon: "▣" },
  { name: "Reports", href: "/reports", icon: "▨" },
  { name: "Payments", href: "/payments", icon: "$" },
  { name: "Audit Logs", href: "/audit-logs", icon: "☷" },
  { name: "Users", href: "/users", icon: "♙" },
  { name: "Roles", href: "/roles", icon: "⚙" },
  { name: "Venues", href: "/venues", icon: "▥" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] bg-[#101827] text-white shadow-2xl lg:flex lg:flex-col">
      <div className="px-8 py-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#8a6b00]">
          LuxeStay
        </h1>
        <p className="mt-2 text-lg text-[#677386]">Elite Operations</p>
      </div>

      <nav className="sidebar-scroll flex-1 space-y-2 overflow-y-auto px-5 pb-5">
        {menuItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`lux-sidebar-link flex items-center gap-5 px-5 py-4 text-lg transition ${
                active
                  ? "border-l-4 border-[#d8b328] bg-[#263248] text-[#f2c426]"
                  : "text-[#827b69] hover:bg-[#263248] hover:text-[#f2c426]"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center text-2xl font-bold">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-6">
        <button className="mb-4 flex w-full items-center gap-4 rounded-xl px-4 py-3 text-lg text-slate-300 transition hover:bg-white/10 hover:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
            ?
          </span>
          Support
        </button>

        <button className="w-full rounded-xl bg-[#d8b328] px-5 py-4 text-lg font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl">
          New Reservation
        </button>
      </div>
    </aside>
  );
}