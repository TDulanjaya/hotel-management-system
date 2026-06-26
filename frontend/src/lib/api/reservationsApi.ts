import { authenticatedFetch } from '@/lib/api/authApi';

export async function getAll() {
  const res = await authenticatedFetch(`/api/reservationss`);
  if (!res.ok) throw new Error(`Failed to fetch reservationss`);
  return res.json();
}

export async function getById(id: string) {
  const res = await authenticatedFetch(`/api/reservationss/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch reservationss`);
  return res.json();
}

export async function create(data: any) {
  const res = await authenticatedFetch(`/api/reservationss`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create reservationss`);
  return res.json();
}

export async function update(id: string, data: any) {
  const res = await authenticatedFetch(`/api/reservationss/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update reservationss`);
  return res.json();
}

export async function remove(id: string) {
  const res = await authenticatedFetch(`/api/reservationss/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete reservationss`);
  return res.json();
}
