import { getToken } from "@/utils/auth";

const API_BASE_URL = "http://localhost:8080/api/users";

export type UserPayload = {
  name: string;
  email: string;
  password?: string;
  role: string;
  active?: boolean;
};

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let message = "Request failed";

    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      message = await response.text();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getUsers() {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function getUserById(id: string) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function createUser(payload: UserPayload) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function updateUser(id: string, payload: UserPayload) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function deactivateUser(id: string) {
  const response = await fetch(`${API_BASE_URL}/${id}/deactivate`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function deleteUser(id: string) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}