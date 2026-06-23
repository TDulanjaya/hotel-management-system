"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RolesListRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/roles");
  }, [router]);

  return (
    <main style={{ padding: "40px" }}>
      <h1>Redirecting to roles...</h1>
    </main>
  );
}

