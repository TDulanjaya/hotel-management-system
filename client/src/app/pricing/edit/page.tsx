"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditPricingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pricing");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#f8f5ef] text-[#735c00]">
      <p className="font-bold">Redirecting to Pricing Management...</p>
    </div>
  );
}
