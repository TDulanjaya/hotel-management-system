import AppSidebar from "@/components/layout/AppSidebar";

export default function OccupancyReportPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="px-8 py-10 lg:ml-[280px]">
        <h1 className="text-4xl font-bold text-[#735c00]">
          Occupancy Report
        </h1>
        <p className="mt-2 text-[#4d4635]">
          Room occupancy rate, available rooms, and booked rooms will be shown here.
        </p>
      </main>
    </div>
  );
}