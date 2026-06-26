"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function EventsEditRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/events");
  }, [router]);

  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "EVENTS"]}>
      <main className="flex min-h-screen items-center justify-center bg-[#fbf9f5] text-[#735c00]">
        <p className="text-lg font-bold">Redirecting to events...</p>
      </main>
    </ProtectedRoute>
  );
}