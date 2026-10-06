"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewGameSessionPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/games");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#f5f3ef] text-[#735c00]">
      <p className="font-bold">Redirecting to Games Management...</p>
    </div>
  );
}