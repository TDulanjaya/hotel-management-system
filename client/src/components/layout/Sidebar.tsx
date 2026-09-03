"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout, getUser, AuthUser, UserRole, getDashboardByRole } from "@/utils/auth";
import { Menu, X } from "lucide-react";

type MenuItem = {
  name: string;
  href: string;
  icon: string;
  allowedRoles: UserRole[];
  category?: string;
};

const menuItems: MenuItem[] = [
  // 1. OVERVIEW
  { name: "Dashboard",         href: "/dashboard",          icon: "▦", allowedRoles: ["OWNER", "MANAGER", "RECEPTIONIST"], category: "OVERVIEW" },

  // 2. FRONT DESK & GUESTS
  { name: "Guests",            href: "/guests",             icon: "♟", allowedRoles: ["OWNER", "MANAGER", "RECEPTIONIST"], category: "FRONT DESK" },
  { name: "Reservations",      href: "/reservations",       icon: "▤", allowedRoles: ["OWNER", "MANAGER", "RECEPTIONIST"], category: "FRONT DESK" },
  { name: "Rooms",             href: "/rooms",              icon: "▰", allowedRoles: ["OWNER", "MANAGER", "RECEPTIONIST"], category: "FRONT DESK" },
  { name: "Folio",             href: "/folio",              icon: "▤", allowedRoles: ["OWNER", "MANAGER", "RECEPTIONIST"], category: "FRONT DESK" },
  { name: "Checkout",          href: "/checkout",           icon: "✓", allowedRoles: ["OWNER", "MANAGER", "RECEPTIONIST"], category: "FRONT DESK" },
  { name: "Payments",          href: "/payments",           icon: "₨", allowedRoles: ["OWNER", "MANAGER", "RECEPTIONIST"], category: "FRONT DESK" },

  // 3. DINING & SERVICES
  { name: "Restaurant",        href: "/restaurant",         icon: "R", allowedRoles: ["OWNER", "MANAGER", "WAITER"], category: "FOOD & SERVICES" },
  { name: "Kitchen",           href: "/kitchen",            icon: "K", allowedRoles: ["OWNER", "MANAGER", "COOK"], category: "FOOD & SERVICES" },
  { name: "Recipes",           href: "/recipes",            icon: "▤", allowedRoles: ["OWNER", "MANAGER", "COOK"], category: "FOOD & SERVICES" },
  { name: "Room Service",      href: "/room-service",       icon: "⌂", allowedRoles: ["OWNER", "MANAGER", "ROOM_SERVICE"], category: "FOOD & SERVICES" },
  { name: "Laundry",           href: "/laundry",            icon: "◎", allowedRoles: ["OWNER", "MANAGER", "LAUNDRY"], category: "FOOD & SERVICES" },

  // 4. EVENTS & RECREATION
  { name: "Events",            href: "/events",             icon: "▣", allowedRoles: ["OWNER", "MANAGER", "EVENTS"], category: "EVENTS & RECREATION" },
  { name: "Event Bookings",    href: "/events/list",        icon: "▤", allowedRoles: ["OWNER", "MANAGER", "EVENTS"], category: "EVENTS & RECREATION" },
  { name: "Venues",            href: "/venues",             icon: "▥", allowedRoles: ["OWNER", "MANAGER", "EVENTS"], category: "EVENTS & RECREATION" },
  { name: "Games",             href: "/games",              icon: "◇", allowedRoles: ["OWNER", "MANAGER", "GAME_STAFF"], category: "EVENTS & RECREATION" },

  // 5. MANAGEMENT & ADMIN
  { name: "Inventory",         href: "/inventory",          icon: "▧", allowedRoles: ["OWNER", "MANAGER", "INVENTORY"], category: "MANAGEMENT" },
  { name: "Parking",           href: "/parking",            icon: "P", allowedRoles: ["OWNER", "MANAGER", "PARKING"], category: "MANAGEMENT" },
  { name: "Service Pricing",   href: "/pricing",            icon: "₨", allowedRoles: ["OWNER", "MANAGER"], category: "MANAGEMENT" },
  { name: "Reports",           href: "/reports",            icon: "▨", allowedRoles: ["OWNER", "MANAGER"], category: "MANAGEMENT" },
  { name: "Audit Logs",        href: "/audit-logs",         icon: "A", allowedRoles: ["OWNER", "MANAGER"], category: "MANAGEMENT" },
  { name: "Users",             href: "/users",              icon: "♙", allowedRoles: ["OWNER", "MANAGER"], category: "MANAGEMENT" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  // Auto-close sidebar on mobile when navigating to a new page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const visibleItems = menuItems.filter(item => user && item.allowedRoles.includes(user.role));

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-[#101827] text-[#d8b328] shadow-lg transition-transform hover:scale-105 lg:hidden"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop for Mobile */}
      <div 
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Content */}
      <aside 
        className={`fixed left-0 top-0 z-[60] flex h-screen w-[280px] flex-col bg-[#101827] text-white shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-8 py-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#d8b328]">
              LuxeStay
            </h1>
            <p className="mt-1 text-sm text-[#677386]">Elite Operations</p>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-scroll flex-1 space-y-1.5 overflow-y-auto px-4 pb-6">
          {visibleItems.map((item, index) => {
            const isDashboard = item.name === "Dashboard";
            const currentHref = isDashboard && user ? getDashboardByRole(user.role) : item.href;
            
            const active = item.href.includes("?")
              ? pathname === "/pricing" && item.name === "Add Price Item"
              : pathname === currentHref || (currentHref !== "/dashboard" && pathname.startsWith(currentHref + "/"));

            const showCategoryHeader =
              item.category &&
              (index === 0 || visibleItems[index - 1].category !== item.category);

            return (
              <div key={item.href + item.name}>
                {showCategoryHeader && (
                  <div className="pt-3 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-[#677386]">
                    {item.category}
                  </div>
                )}

                <Link
                  href={currentHref}
                  className={`lux-sidebar-link flex items-center gap-4 rounded-xl px-4 py-3 text-base transition-all hover:translate-x-1 ${
                    active
                      ? "border-l-4 border-[#d8b328] bg-[#263248] text-[#f2c426]"
                      : "text-[#a6adba] hover:bg-[#263248] hover:text-[#f2c426]"
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center text-xl font-bold">
                    {item.icon}
                  </span>

                  <span className="leading-tight font-medium">{item.name}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-5">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-white/20 px-5 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}