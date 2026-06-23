"use client";

import { useRouter } from "next/navigation";

export default function RoomServiceOrdersPage() {
  const router = useRouter();

  return (
    <main style={{ padding: "40px" }}>
      <h1>Room Service Orders</h1>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gap: "15px",
          maxWidth: "800px",
        }}
      >
        <div style={{ padding: "15px", border: "1px solid #ccc" }}>
          <h3>Order RS-1001</h3>
          <p>Room: 402</p>
          <p>Guest: Daniel Smith</p>
          <p>Items: Club Sandwich, Orange Juice</p>
          <p>Status: Preparing</p>
        </div>

        <div style={{ padding: "15px", border: "1px solid #ccc" }}>
          <h3>Order RS-1002</h3>
          <p>Room: 305</p>
          <p>Guest: Olivia Brown</p>
          <p>Items: Coffee, Pasta</p>
          <p>Status: Delivered</p>
        </div>

        <button
          onClick={() => router.push("/room-service/new")}
          style={{ padding: "12px" }}
        >
          Add New Order
        </button>

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