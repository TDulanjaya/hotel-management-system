"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditInventoryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/inventory");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#fbf9f5] text-[#735c00]">
      <p className="font-bold">Redirecting to Inventory Management...</p>
    </div>
  );
}