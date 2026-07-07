import { authenticatedFetch, API_BASE_URL } from '@/lib/api/authApi';

export async function getReportSummary() {
  const res = await authenticatedFetch(`/api/reports/summary`);
  if (!res.ok) throw new Error(`Failed to fetch report summary`);
  return res.json();
}

export async function downloadAllReports() {
  const token = localStorage.getItem('token');
  const headers: any = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/api/reports/export`, {
    method: 'GET',
    headers
  });
  
  if (!response.ok) throw new Error('Failed to download report');
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reports_summary.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function getAll() {
  const res = await authenticatedFetch(`/api/reports`);
  if (!res.ok) throw new Error(`Failed to fetch reports`);
  const data = await res.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getById(id: string) {
  const res = await authenticatedFetch(`/api/reports/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch reports`);
  return res.json();
}

export async function create(data: any) {
  const res = await authenticatedFetch(`/api/reports`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to create reports`);
  return res.json();
}

export async function update(id: string, data: any) {
  const res = await authenticatedFetch(`/api/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update reports`);
  return res.json();
}

export async function remove(id: string) {
  const res = await authenticatedFetch(`/api/reports/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete reports`);
  return res.json();
}
