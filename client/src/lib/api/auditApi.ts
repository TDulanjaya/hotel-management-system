import { authenticatedFetch } from '@/lib/api/authApi';

export async function getAll() {
  const res = await authenticatedFetch(`/api/audits`);
  if (!res.ok) throw new Error(`Failed to fetch audits`);
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getById(id: string) {
  const res = await authenticatedFetch(`/api/audits/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch audits`);
  return res.json();
}

export async function create(data: any) {
  const res = await authenticatedFetch(`/api/audits`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create audits`);
  return res.json();
}

export async function update(id: string, data: any) {
  const res = await authenticatedFetch(`/api/audits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update audits`);
  return res.json();
}

export async function remove(id: string) {
  const res = await authenticatedFetch(`/api/audits/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete audits`);
  return res.json();
}
