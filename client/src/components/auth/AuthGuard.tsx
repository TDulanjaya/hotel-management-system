"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getUser, UserRole, getDashboardByRole } from "@/utils/auth";

export default function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const publicPaths = ["/", "/login", "/auth/login", "/auth/register"];
    const isPublic = publicPaths.includes(pathname);

    const token = getToken();
    const user = getUser();

    if (token && user && pathname === "/") {
      router.push(getDashboardByRole(user.role));
      return;
    }

    if (isPublic && (!token || !user)) {
      setAuthorized(true);
      return;
    }

    if (!token || !user) {
      setAuthorized(false);
      router.push("/login");
    } else {
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        setForbidden(true);
        setAuthorized(true); // Technically authenticated, but not authorized for this route
      } else {
        setAuthorized(true);
        setForbidden(false);
      }
    }
  }, [pathname, router, allowedRoles]);

  const publicPaths = ["/", "/login", "/auth/login", "/auth/register"];
  if (!authorized && !publicPaths.includes(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f5]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d4af37] border-t-transparent"></div>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf9f5]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#4d4635] mb-4">403 Forbidden</h1>
          <p className="text-lg text-[#857d6b] mb-6">You do not have permission to access this page.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl bg-[#4d4635] px-6 py-3 font-semibold text-[#fbf9f5] transition hover:bg-[#3a3528]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
