"use client";

import { useParams, useRouter } from "next/navigation";

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id as string;

  return (
    <main style={{ padding: "40px" }}>
      <h1>Edit Room</h1>

      <p style={{ marginTop: "10px" }}>
        <strong>Room ID:</strong> {roomId}
      </p>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gap: "15px",
          maxWidth: "500px",
        }}
      >
        <input defaultValue="402" placeholder="Room number" style={{ padding: "12px" }} />

        <input defaultValue="Deluxe Room" placeholder="Room type" style={{ padding: "12px" }} />

        <input defaultValue="Rs 250" placeholder="Price per night" style={{ padding: "12px" }} />

        <select defaultValue="Available" style={{ padding: "12px" }}>
          <option>Available</option>
          <option>Occupied</option>
          <option>Maintenance</option>
          <option>Reserved</option>
        </select>

        <button style={{ padding: "12px" }}>Save Changes</button>

        <button onClick={() => router.push("/rooms")} style={{ padding: "12px" }}>
          Back to Rooms
        </button>
      </div>
    </main>
  );
}