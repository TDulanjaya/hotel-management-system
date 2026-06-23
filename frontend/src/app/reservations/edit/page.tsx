"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReservationsEditRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/reservations");
  }, [router]);

  return (
    <main style={{ padding: "40px" }}>
      <h1>Redirecting to reservations...</h1>
    </main>
  );
}

