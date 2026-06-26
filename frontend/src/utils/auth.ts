export type UserRole =
  | "OWNER"
  | "MANAGER"
  | "RECEPTIONIST"
  | "COOK"
  | "INVENTORY"
  | "WAITER"
  | "EVENTS"
  | "PARKING"
  | "GAME_STAFF"
  | "ROOM_SERVICE";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function hasRole(allowedRoles: UserRole[]): boolean {
  const user = getUser();
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

export function getDashboardByRole(role: UserRole) {
  const roleRoutes: Record<UserRole, string> = {
    OWNER: "/dashboard",
    MANAGER: "/dashboard",
    RECEPTIONIST: "/rooms",
    COOK: "/kitchen/orders",
    INVENTORY: "/inventory",
    WAITER: "/restaurant/orders",
    EVENTS: "/events",
    PARKING: "/parking",
    GAME_STAFF: "/games",
    ROOM_SERVICE: "/room-service",
  };

  return roleRoutes[role] || "/dashboard";
}