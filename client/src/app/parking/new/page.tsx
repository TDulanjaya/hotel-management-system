"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewParkingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/parking");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#fbf9f5] text-[#735c00]">
      <p className="font-bold">Redirecting to Parking Management...</p>
    </div>
  );
}
