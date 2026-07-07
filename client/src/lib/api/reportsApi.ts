import { authenticatedFetch } from '@/lib/api/authApi';

export async function getAll() {
  const res = await authenticatedFetch(`/api/reportss`);
  if (!res.ok) throw new Error(`Failed to fetch reportss`);
  return res.json();
}

export async function getById(id: string) {
  const res = await authenticatedFetch(`/api/reportss/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch reportss`);
  return res.json();
}

export async function create(data: any) {
  const res = await authenticatedFetch(`/api/reportss`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create reportss`);
  return res.json();
}

export async function update(id: string, data: any) {
  const res = await authenticatedFetch(`/api/reportss/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update reportss`);
  return res.json();
}

export async function remove(id: string) {
  const res = await authenticatedFetch(`/api/reportss/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete reportss`);
  return res.json();
}
