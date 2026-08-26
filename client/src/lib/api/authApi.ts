export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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

export const swrFetcher = async (url: string) => {
  const res = await authenticatedFetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred while fetching the data.");
  }
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
};

export const swrRawFetcher = async (url: string) => {
  const res = await authenticatedFetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred while fetching the data.");
  }
  return res.json();
};

