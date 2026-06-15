import AppSidebar from "@/components/layout/AppSidebar";

export default function NewPaymentPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
      <AppSidebar />

      <main className="lg:ml-[280px] px-8 py-10">
        <h1 className="text-4xl font-bold text-[#735c00]">Add New Payment</h1>
        <p className="mt-2 text-[#4d4635]">
          New payment form will be added here.
        </p>
      </main>
    </div>
  );
}