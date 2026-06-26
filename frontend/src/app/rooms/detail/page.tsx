"use client";
import { useSearchParams } from "next/navigation";


import { useParams, useRouter } from "next/navigation";

export default function RoomDetailsPage() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const id = rawId as string;

  const router = useRouter();
  const params = useParams();
  const roomId = id as string;

  return (
    <main style={{ padding: "40px" }}>
      <h1>Room Details</h1>

      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gap: "15px",
          maxWidth: "600px",
        }}
      >
        <p>
          <strong>Room ID:</strong> {roomId}
        </p>

        <p>
          <strong>Room Number:</strong> 402
        </p>

        <p>
          <strong>Room Type:</strong> Deluxe Room
        </p>

        <p>
          <strong>Status:</strong> Available
        </p>

        <p>
          <strong>Price:</strong> Rs 250 per night
        </p>

        <button
          onClick={() => router.push("/rooms")}
          style={{ padding: "12px" }}
        >
          Back to Rooms
        </button>
      </div>
    </main>
  );
}