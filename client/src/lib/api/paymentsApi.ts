import { authenticatedFetch } from "./authApi";

export async function getPayments() {
  const response = await authenticatedFetch("/api/payments");
  if (!response.ok) throw new Error("Failed to fetch payments");
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getPaymentById(id: string) {
  const response = await authenticatedFetch(`/api/payments/${id}`);
  if (!response.ok) throw new Error("Failed to fetch payment");
  return response.json();
}

export async function createPayment(data: any) {
  const response = await authenticatedFetch("/api/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create payment");
  return response.json();
}

export async function updatePayment(id: string, data: any) {
  const response = await authenticatedFetch(`/api/payments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update payment");
  return response.json();
}

export async function deletePayment(id: string) {
  const response = await authenticatedFetch(`/api/payments/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete payment");
}
