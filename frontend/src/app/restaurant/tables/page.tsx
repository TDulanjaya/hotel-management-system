import AppSidebar from "@/components/layout/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function RestaurantTablesPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "waiter"]}>
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <AppSidebar />

        <main className="px-8 py-10 lg:ml-[280px]">
          <h1 className="text-4xl font-bold text-[#735c00]">
            Restaurant Tables
          </h1>

          <p className="mt-2 text-[#4d4635]">
            Table floor plan and table status view will be added here.
          </p>
        </main>
      </div>
    </ProtectedRoute>
  );
}