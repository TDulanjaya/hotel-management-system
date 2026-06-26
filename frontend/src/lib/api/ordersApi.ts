import { authenticatedFetch } from '@/lib/api/authApi';

export async function getAll() {
  const res = await authenticatedFetch(`/api/orderss`);
  if (!res.ok) throw new Error(`Failed to fetch orderss`);
  return res.json();
}

export async function getById(id: string) {
  const res = await authenticatedFetch(`/api/orderss/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch orderss`);
  return res.json();
}

export async function create(data: any) {
  const res = await authenticatedFetch(`/api/orderss`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create orderss`);
  return res.json();
}

export async function update(id: string, data: any) {
  const res = await authenticatedFetch(`/api/orderss/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update orderss`);
  return res.json();
}

export async function remove(id: string) {
  const res = await authenticatedFetch(`/api/orderss/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete orderss`);
  return res.json();
}
