"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function RecipesListRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/recipes");
  }, [router]);

  return (
    <ProtectedRoute allowedRoles={["owner", "manager", "kitchen"]}>
      <main className="flex min-h-screen items-center justify-center bg-[#fbf9f5] text-[#735c00]">
        <p className="text-lg font-bold">Redirecting to recipes...</p>
      </main>
    </ProtectedRoute>
  );
}