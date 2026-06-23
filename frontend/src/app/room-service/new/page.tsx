"use client";

import { useRouter } from "next/navigation";

export default function NewRoomServicePage() {
  const router = useRouter();

  return (
    <main style={{ padding: "40px" }}>
      <h1>New Room Service Order</h1>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gap: "15px",
          maxWidth: "500px",
        }}
      >
        <input placeholder="Room number" style={{ padding: "12px" }} />
        <input placeholder="Guest name" style={{ padding: "12px" }} />
        <input placeholder="Food items" style={{ padding: "12px" }} />
        <input placeholder="Amount" style={{ padding: "12px" }} />

        <button style={{ padding: "12px" }}>Save Order</button>

        <button
          onClick={() => router.push("/room-service")}
          style={{ padding: "12px" }}
        >
          Back to Room Service
        </button>
      </div>
    </main>
  );
}