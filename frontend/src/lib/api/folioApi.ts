import { authenticatedFetch } from '@/lib/api/authApi';

export async function getAll() {
  const res = await authenticatedFetch(`/api/folios`);
  if (!res.ok) throw new Error(`Failed to fetch folios`);
  return res.json();
}

export async function getById(id: string) {
  const res = await authenticatedFetch(`/api/folios/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch folios`);
  return res.json();
}

export async function create(data: any) {
  const res = await authenticatedFetch(`/api/folios`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create folios`);
  return res.json();
}

export async function update(id: string, data: any) {
  const res = await authenticatedFetch(`/api/folios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update folios`);
  return res.json();
}

export async function remove(id: string) {
  const res = await authenticatedFetch(`/api/folios/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete folios`);
  return res.json();
}
