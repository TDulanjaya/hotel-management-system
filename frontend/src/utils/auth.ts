export type UserRole =
  | "owner"
  | "manager"
  | "receptionist"
  | "kitchen"
  | "inventory"
  | "waiter"
  | "events"
  | "parking"
  | "game_staff";

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

export function getDashboardByRole(role: UserRole) {
  const roleRoutes: Record<UserRole, string> = {
    owner: "/dashboard/owner",
    manager: "/dashboard/manager",
    receptionist: "/dashboard/receptionist",
    kitchen: "/kitchen",
    inventory: "/inventory",
    waiter: "/restaurant/orders",
    events: "/events",
    parking: "/parking",
    game_staff: "/games",
  };

  return roleRoutes[role] || "/dashboard";
}