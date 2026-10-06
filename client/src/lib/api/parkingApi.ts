import { getToken } from "@/utils/auth";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/parking`;

export type ParkingPayload = {
  vehicleNumber: string;
  vehicleModel?: string;
  vehicleType: string;
  driverName: string;
  contactNumber?: string;
  parkingZone?: string;
  slotNumber: string;
  serviceType?: string;
  checkInTime?: string;
  expectedCheckOutTime?: string;
  guestName?: string;
  roomNumber?: string;
  reservationId?: string;
  eventId?: string;
  customerType?: string;
  billingType?: string;
  amount?: number;
  paymentStatus?: string;
  notes?: string;
  status: string;
};

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

  return response.json();
}

export async function getParkingBookings() {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function getParkingBookingById(id: string) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function createParkingBooking(payload: ParkingPayload) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function updateParkingBooking(id: string, payload: ParkingPayload) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function deleteParkingBooking(id: string) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}