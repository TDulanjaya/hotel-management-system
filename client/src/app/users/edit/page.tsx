"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditUserPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/users");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#fbf9f5] text-[#735c00]">
      <p className="font-bold">Redirecting to Users Management...</p>
    </div>
  );
}