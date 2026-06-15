import AppSidebar from "@/components/layout/AppSidebar";

export default function PaymentsListPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="lg:ml-[280px] px-8 py-10">
        <h1 className="text-4xl font-bold text-[#735c00]">Payment List</h1>
        <p className="mt-2 text-[#4d4635]">
          All payment transactions will be shown here.
        </p>
      </main>
    </div>
  );
}