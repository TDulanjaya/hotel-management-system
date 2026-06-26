import { authenticatedFetch } from '@/lib/api/authApi';

export async function getAll() {
  const res = await authenticatedFetch(`/api/guestss`);
  if (!res.ok) throw new Error(`Failed to fetch guestss`);
  return res.json();
}

export async function getById(id: string) {
  const res = await authenticatedFetch(`/api/guestss/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch guestss`);
  return res.json();
}

export async function create(data: any) {
  const res = await authenticatedFetch(`/api/guestss`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create guestss`);
  return res.json();
}

export async function update(id: string, data: any) {
  const res = await authenticatedFetch(`/api/guestss/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update guestss`);
  return res.json();
}

export async function remove(id: string) {
  const res = await authenticatedFetch(`/api/guestss/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete guestss`);
  return res.json();
}
