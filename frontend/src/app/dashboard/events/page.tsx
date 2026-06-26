"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppSidebar from "@/components/layout/Sidebar";
import { Search, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { title: "Events", href: "/events" },
  { title: "Venues", href: "/venues" }
];

export default function EventsDashboardPage() {
  const [userName, setUserName] = useState("Staff");

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.name) setUserName(user.name);
      }
    } catch {}
  }, []);

  return (
    <ProtectedRoute allowedRoles={["EVENTS", "MANAGER", "OWNER"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="min-h-screen lg:ml-[280px]">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#d0c5af] bg-[#fbf9f5] px-8 shadow-sm">
            <div className="relative hidden w-full max-w-md md:block">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7f7663]"
              />

              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-full border border-[#d0c5af] bg-[#f5f3ef] py-2 pl-10 pr-4 text-sm outline-none transition focus:border-[#735c00] focus:ring-2 focus:ring-[#735c00]/20"
              />
            </div>

            <div className="flex items-center gap-6">
              <button className="relative text-[#4d4635] transition hover:text-[#735c00]">
                <Bell size={22} />
              </button>

              <div className="hidden h-8 w-px bg-[#d0c5af] md:block" />

              <div className="hidden text-right md:block">
                <p className="text-sm font-bold text-[#1b1c1a]">
                  {userName}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                  EVENTS
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#131b2e] font-bold text-[#ffe088]">
                {userName.charAt(0)}
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-[1600px] px-8 pb-12 pt-10">
            <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#735c00]">
                  Department Operations
                </p>

                <h1 className="mt-3 text-4xl font-extrabold">
                  Events Dashboard
                </h1>

                <p className="mt-3 text-[#4d4635]">
                  Welcome back! Access your daily modules below.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <article className="group cursor-pointer rounded-xl border border-[#d0c5af] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-[#1b1c1a] group-hover:text-[#735c00]">
                          {link.title}
                        </h2>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37]/15 text-[#735c00]">
                        <ArrowRight size={20} />
                      </div>
                    </div>
                    <p className="text-sm text-[#4d4635]">
                      Manage {link.title.toLowerCase()} and related operations.
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
