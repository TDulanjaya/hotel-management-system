import { getToken } from "@/utils/auth";

const API_BASE_URL = "http://localhost:8080/api/reports";

function getAuthHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getDownloadHeaders() {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let message = "Request failed";

    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      message = await response.text();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

export async function getReportSummary() {
  const response = await fetch(`${API_BASE_URL}/summary`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function downloadAllReports() {
  const response = await fetch(`${API_BASE_URL}/export`, {
    method: "GET",
    headers: getDownloadHeaders(),
  });

  if (!response.ok) {
    let message = "Failed to download report";

    try {
      message = await response.text();
    } catch {
      message = "Failed to download report";
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "reports_summary.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}