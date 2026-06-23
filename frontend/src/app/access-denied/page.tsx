"use client";

import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9f5] px-6 text-[#1b1c1a]">
      <div className="max-w-md rounded-2xl border border-[#d0c5af] bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-[#ba1a1a]">Access Denied</h1>

        <p className="mt-3 text-[#4d4635]">
          You do not have permission to open this page.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-xl bg-[#735c00] px-6 py-3 font-bold text-white"
        >
          Go Dashboard
        </button>
      </div>
    </main>
  );
}