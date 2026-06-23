"use client";

import { useRouter } from "next/navigation";

export default function NewRolePage() {
  const router = useRouter();

  return (
    <main style={{ padding: "40px" }}>
      <h1>Add New Role</h1>

      <div style={{ marginTop: "20px", display: "grid", gap: "15px", maxWidth: "500px" }}>
        <input placeholder="Role name" style={{ padding: "12px" }} />
        <input placeholder="Description" style={{ padding: "12px" }} />
        <button style={{ padding: "12px" }}>Save Role</button>
        <button onClick={() => router.push("/roles")} style={{ padding: "12px" }}>
          Back to Roles
        </button>
      </div>
    </main>
  );
}