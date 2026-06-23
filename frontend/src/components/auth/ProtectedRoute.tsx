"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken, UserRole } from "@/utils/auth";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: UserRole[];
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.push("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/access-denied");
      return;
    }

    setAllowed(true);
    setChecking(false);
  }, [router, allowedRoles]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f5] text-[#735c00]">
        <p className="text-lg font-bold">Checking access...</p>
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}