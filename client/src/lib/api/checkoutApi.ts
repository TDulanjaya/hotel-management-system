import { authenticatedFetch } from "./authApi";

export async function getDueCheckouts() {
  const res = await authenticatedFetch("/api/checkout");
  if (!res.ok) throw new Error("Failed to fetch due checkouts");
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}

export async function processCheckout(reservationId: string) {
  const res = await authenticatedFetch(`/api/checkout/${reservationId}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to process checkout");
  return res.json();
}
