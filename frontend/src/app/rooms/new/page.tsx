"use client";

import { useRouter } from "next/navigation";

export default function NewRoomPage() {
  const router = useRouter();

  return (
    <main style={{ padding: "40px" }}>
      <h1>Add New Room</h1>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gap: "15px",
          maxWidth: "500px",
        }}
      >
        <input placeholder="Room number" style={{ padding: "12px" }} />

        <select style={{ padding: "12px" }}>
          <option>Standard Room</option>
          <option>Deluxe Room</option>
          <option>Executive Suite</option>
          <option>Presidential Suite</option>
        </select>

        <input placeholder="Price per night" style={{ padding: "12px" }} />

        <select style={{ padding: "12px" }}>
          <option>Available</option>
          <option>Occupied</option>
          <option>Maintenance</option>
          <option>Reserved</option>
        </select>

        <input placeholder="Floor number" style={{ padding: "12px" }} />

        <button style={{ padding: "12px" }}>Save Room</button>

        <button onClick={() => router.push("/rooms")} style={{ padding: "12px" }}>
          Back to Rooms
        </button>
      </div>
    </main>
  );
}