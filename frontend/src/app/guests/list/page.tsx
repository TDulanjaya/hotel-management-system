"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function GuestsListRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/guests");
  }, [router]);

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "receptionist"]}>
      <main className="flex min-h-screen items-center justify-center bg-[#fbf9f5] text-[#735c00]">
        <p className="text-lg font-bold">Redirecting to guests...</p>
      </main>
    </ProtectedRoute>
  );
}