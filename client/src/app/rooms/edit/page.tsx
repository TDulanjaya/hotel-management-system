"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditRoomPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/rooms");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#f8f5ef] text-[#735c00]">
      <p className="font-bold">Redirecting to Room Management...</p>
    </div>
  );
}