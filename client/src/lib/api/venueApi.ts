import { authenticatedFetch } from "./authApi";

export async function getVenues() {
  const response = await authenticatedFetch("/api/venues");
  if (!response.ok) {
    throw new Error("Failed to fetch venues");
  }
  const data = await response.json();
  return data?.content !== undefined ? data.content : data;
}

export async function getVenueById(id: string) {
  const response = await authenticatedFetch(`/api/venues/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch venue");
  }
  return response.json();
}
export async function createVenue(venueData: any) {
  const response = await authenticatedFetch("/api/venues", {
    method: "POST",
    body: JSON.stringify(venueData),
  });
  if (!response.ok) {
    throw new Error("Failed to create venue");
  }
  return response.json();
}

export async function updateVenue(id: string, venueData: any) {
  const response = await authenticatedFetch(`/api/venues/${id}`, {
    method: "PUT",
    body: JSON.stringify(venueData),
  });
  if (!response.ok) {
    throw new Error("Failed to update venue");
  }
  return response.json();
}
export async function deleteVenue(id: string) {
  const response = await authenticatedFetch(`/api/venues/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete venue");
  }
}
