"use client";

import { useRouter } from "next/navigation";

export default function NewVenuePage() {
  const router = useRouter();

  return (
    <main style={{ padding: "40px" }}>
      <h1>Add New Venue</h1>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gap: "15px",
          maxWidth: "500px",
        }}
      >
        <input placeholder="Venue name" style={{ padding: "12px" }} />

        <select style={{ padding: "12px" }}>
          <option>Conference Hall</option>
          <option>Banquet Hall</option>
          <option>Garden Area</option>
          <option>Rooftop</option>
          <option>Meeting Room</option>
        </select>

        <input placeholder="Capacity" style={{ padding: "12px" }} />

        <input placeholder="Price per hour" style={{ padding: "12px" }} />

        <select style={{ padding: "12px" }}>
          <option>Available</option>
          <option>Booked</option>
          <option>Maintenance</option>
        </select>

        <button style={{ padding: "12px" }}>Save Venue</button>

        <button
          onClick={() => router.push("/venues")}
          style={{ padding: "12px" }}
        >
          Back to Venues
        </button>
      </div>
    </main>
  );
}