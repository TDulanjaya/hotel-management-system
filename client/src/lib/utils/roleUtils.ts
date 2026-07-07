export const EDIT_ROLES = ["OWNER", "MANAGER", "RECEPTIONIST"] as const;

export function canEditByRole(role: string | undefined): boolean {
  return EDIT_ROLES.includes(role as any);
}

export function hasRole(role: string | undefined, ...roles: string[]): boolean {
  return roles.includes(role ?? "");
}
