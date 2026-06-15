import AppSidebar from "@/components/layout/AppSidebar";

export default function NetProfitReportPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="px-8 py-10 lg:ml-[280px]">
        <h1 className="text-4xl font-bold text-[#735c00]">
          Net Profit Report
        </h1>
        <p className="mt-2 text-[#4d4635]">
          Total income, expenses, and final hotel profit will be shown here.
        </p>
      </main>
    </div>
  );
}