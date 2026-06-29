import React from "react";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

type Props = {
  title: string;
  allowedRoles?: string[];
  children: React.ReactNode;
};

export function ReportPageLayout({ title, allowedRoles = ["OWNER", "MANAGER"], children }: Props) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />
        <main className="lg:ml-[280px]">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#d9cfbd] bg-[#f8f5ef]/95 px-8 backdrop-blur-xl">
            <h1 className="text-2xl font-extrabold">{title}</h1>
            {/* date filter + export slot */}
          </header>
          <section className="px-8 py-8">{children}</section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
