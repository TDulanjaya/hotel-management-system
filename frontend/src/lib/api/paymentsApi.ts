import { authenticatedFetch } from '@/lib/api/authApi';

export async function getAll() {
  const res = await authenticatedFetch(`/api/paymentss`);
  if (!res.ok) throw new Error(`Failed to fetch paymentss`);
  return res.json();
}

export async function getById(id: string) {
  const res = await authenticatedFetch(`/api/paymentss/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch paymentss`);
  return res.json();
}

export async function create(data: any) {
  const res = await authenticatedFetch(`/api/paymentss`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create paymentss`);
  return res.json();
}

export async function update(id: string, data: any) {
  const res = await authenticatedFetch(`/api/paymentss/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update paymentss`);
  return res.json();
}

export async function remove(id: string) {
  const res = await authenticatedFetch(`/api/paymentss/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete paymentss`);
  return res.json();
}
