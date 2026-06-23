"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VenuesListRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/venues");
  }, [router]);

  return (
    <main style={{ padding: "40px" }}>
      <h1>Redirecting to venues...</h1>
    </main>
  );
}