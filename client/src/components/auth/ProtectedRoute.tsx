"use client";

import { ReactNode } from "react";
import { UserRole } from "@/utils/auth";

/**
 * Transparent pass-through wrapper for legacy page annotations.
 * Route protection and role authorization are handled globally by AuthGuard in RootLayout.
 */
export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
  allowedRoles?: UserRole[];
}) {
  return <>{children}</>;
}
