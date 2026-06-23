"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoomsEditRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/rooms");
  }, [router]);

  return (
    <main style={{ padding: "40px" }}>
      <h1>Redirecting to rooms...</h1>
    </main>
  );
}