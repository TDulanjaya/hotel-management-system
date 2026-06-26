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
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: "▦", allowedRoles: ["OWNER", "MANAGER", "RECEPTIONIST"] },
  { name: "Users", href: "/users", icon: "♙", allowedRoles: ["OWNER", "MANAGER"] },
  { name: "Venues", href: "/venues", icon: "▥", allowedRoles: ["OWNER", "MANAGER", "EVENTS"] },
  { name: "Service Pricing", href: "/pricing", icon: "₨", allowedRoles: ["OWNER", "MANAGER"] },
  { name: "Events", href: "/events", icon: "▣", allowedRoles: ["OWNER", "MANAGER", "EVENTS"] },
  { name: "Rooms", href: "/rooms", icon: "▰", allowedRoles: ["OWNER", "MANAGER", "RECEPTIONIST"] },
  { name: "Inventory", href: "/inventory", icon: "▧", allowedRoles: ["OWNER", "MANAGER", "INVENTORY"] },
  { name: "Parking", href: "/parking", icon: "P", allowedRoles: ["OWNER", "MANAGER", "PARKING"] },
  { name: "Reports", href: "/reports", icon: "▨", allowedRoles: ["OWNER", "MANAGER"] },
  { name: "Settings", href: "/settings", icon: "⚙", allowedRoles: ["OWNER"] },

  { name: "Restaurant Orders", href: "/restaurant/orders", icon: "▥", allowedRoles: ["WAITER"] },
  { name: "Room Service", href: "/room-service", icon: "⌂", allowedRoles: ["ROOM_SERVICE"] },
  { name: "Kitchen Orders", href: "/kitchen/orders", icon: "▥", allowedRoles: ["COOK"] },
  { name: "Games", href: "/games", icon: "◇", allowedRoles: ["GAME_STAFF"] },
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

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed left-5 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-[#101827] text-[#d8b328] shadow-lg transition-transform hover:scale-105 lg:hidden"
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop for Mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Content */}
      <aside 
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col bg-[#101827] text-white shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-8 py-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#d8b328]">
              LuxeStay
            </h1>
            <p className="mt-2 text-lg text-[#677386]">Elite Operations</p>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-scroll flex-1 space-y-2 overflow-y-auto px-5 pb-5">
          {menuItems.filter(item => user && item.allowedRoles.includes(user.role)).map((item) => {
            const isDashboard = item.name === "Dashboard";
            const currentHref = isDashboard && user ? getDashboardByRole(user.role) : item.href;
            
            const active =
              pathname === currentHref || pathname.startsWith(currentHref + "/");

            return (
              <Link
                key={item.href}
                href={currentHref}
                className={`lux-sidebar-link flex items-center gap-5 rounded-xl px-5 py-4 text-lg transition-all hover:translate-x-1 ${
                  active
                    ? "border-l-4 border-[#d8b328] bg-[#263248] text-[#f2c426]"
                    : "text-[#a6adba] hover:bg-[#263248] hover:text-[#f2c426]"
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center text-2xl font-bold">
                  {item.icon}
                </span>

                <span className="leading-tight">{item.name}</span>
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

          {user && ["OWNER", "MANAGER"].includes(user.role) && (
            <Link
              href="/pricing?openPanel=true"
              className="block w-full rounded-xl bg-[#d8b328] px-5 py-4 text-center text-lg font-bold text-[#4c3a00] transition hover:-translate-y-1 hover:bg-[#f2c426] hover:shadow-xl"
            >
              Add Price Item
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}