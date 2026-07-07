"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9f5] text-[#735c00]">
      <p className="text-lg font-bold">Redirecting to login...</p>
    </main>
  );
}
