export const API_BASE_URL = "http://localhost:8080";

import { getToken } from "@/utils/auth";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error("Invalid email or password");
    }
    throw new Error("Failed to login");
  }

  return res.json();
}


export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = getToken();

  
  const headers = new Headers({
    "Content-Type": "application/json",
    
    ...(options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : options.headers ?? {}),
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    throw new Error("Unauthorized. Please log in again.");
  }

  if (response.status === 403) {
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  return response;
}

export async function getAll() {
  const res = await authenticatedFetch(`/api/auths`);
  if (!res.ok) throw new Error(`Failed to fetch auths`);
  return res.json();
}

export async function getById(id: string) {
  const res = await authenticatedFetch(`/api/auths/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch auths`);
  return res.json();
}

export async function create(data: any) {
  const res = await authenticatedFetch(`/api/auths`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create auths`);
  return res.json();
}

export async function update(id: string, data: any) {
  const res = await authenticatedFetch(`/api/auths/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update auths`);
  return res.json();
}

export async function remove(id: string) {
  const res = await authenticatedFetch(`/api/auths/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete auths`);
  return res.json();
}
