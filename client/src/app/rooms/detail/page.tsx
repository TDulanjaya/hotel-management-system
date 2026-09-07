"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppSidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getRoomById } from "@/lib/api/roomApi";
import { getStatusBadgeClass } from "@/lib/utils/statusStyles";
import { Bed, ArrowLeft, Pencil, Users, DoorOpen, DollarSign, Sparkles } from "lucide-react";

function RoomDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No room ID provided.");
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRoomById(id);
        setRoom(data);
      } catch (err: any) {
        setError(err.message || "Failed to load room details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const badgeClass = room ? getStatusBadgeClass(room.status) : "";

  return (
    <main className="w-full px-4 py-6 pt-16 sm:px-6 sm:py-8 lg:px-8 lg:pt-8 lg:ml-[280px]">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#735c00]">
            <DoorOpen className="h-4 w-4" />
            <span>Rooms Module</span>
          </div>

          <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1b1c1a]">
            Room Details
          </h1>

          <p className="mt-1 text-xs sm:text-sm text-[#5c5443]">
            Comprehensive information for Room {room?.roomNumber || id || ""}
          </p>
        </div>

        <Link
          href="/rooms"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d0c5af] bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-[#5c5443] shadow-sm transition hover:bg-[#f5f3ef]"
        >
          <ArrowLeft size={16} />
          <span>Back to Rooms</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-[#d0c5af] bg-white p-6 shadow-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#735c00] border-t-transparent"></div>
          <p className="text-sm font-semibold text-[#735c00]">Loading room details...</p>
        </div>
      ) : error || !room ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
          <p className="font-bold">{error || "Room not found"}</p>
          <Link
            href="/rooms"
            className="mt-4 inline-block rounded-xl bg-[#735c00] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#8f7300]"
          >
            Return to Rooms
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl rounded-2xl border border-[#d0c5af] bg-white p-5 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-[#f0eae0] pb-5 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7f7663]">
                Room Identifier
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181818] mt-0.5">
                Room {room.roomNumber}
              </h2>
              <p className="text-sm font-semibold text-[#735c00] mt-0.5">
                {room.roomType} • {room.floor}
              </p>
            </div>

            <span className={`rounded-full px-4 py-1.5 text-xs font-extrabold tracking-wider ${badgeClass}`}>
              {room.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl bg-[#fbf9f5] border border-[#f0eae0] p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                Nightly Rate
              </span>
              <p className="mt-1 text-lg sm:text-xl font-extrabold text-[#181818]">
                Rs {Number(room.pricePerNight || 0).toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-[#fbf9f5] border border-[#f0eae0] p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                Guest Capacity
              </span>
              <p className="mt-1 text-lg sm:text-xl font-extrabold text-[#181818] flex items-center justify-center gap-1">
                <Users className="h-4 w-4 text-[#735c00]" />
                {room.capacity} Guests
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl bg-[#fbf9f5] border border-[#f0eae0] p-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7f7663]">
                Floor / Wing
              </span>
              <p className="mt-1 text-lg sm:text-xl font-extrabold text-[#735c00]">
                {room.floor}
              </p>
            </div>
          </div>

          {room.description && (
            <div className="mb-6 rounded-xl border border-[#d0c5af] bg-[#fbf9f5] p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#735c00] mb-1.5">
                <Sparkles className="h-4 w-4" />
                <span>Description & Room Notes</span>
              </div>
              <p className="text-xs sm:text-sm text-[#3f3b35] whitespace-pre-wrap leading-relaxed">
                {room.description}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#f0eae0]">
            <Link
              href={`/rooms/edit?id=${room.id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#735c00] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#8f7300]"
            >
              <Pencil size={15} />
              <span>Edit Room</span>
            </Link>

            <button
              onClick={() => router.push("/rooms")}
              className="rounded-xl border border-[#d0c5af] bg-white px-6 py-3 text-sm font-bold text-[#5c5443] transition hover:bg-[#f5f3ef]"
            >
              Back to List
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function RoomDetailsPage() {
  return (
    <ProtectedRoute allowedRoles={["OWNER", "MANAGER", "RECEPTIONIST"]}>
      <div className="min-h-screen bg-[#f8f5ef] text-[#181818]">
        <AppSidebar />
        <Suspense
          fallback={
            <main className="w-full px-4 py-6 pt-16 sm:px-6 sm:py-8 lg:px-8 lg:pt-8 lg:ml-[280px]">
              <div className="flex h-64 items-center justify-center text-sm font-semibold text-[#735c00]">
                Loading...
              </div>
            </main>
          }
        >
          <RoomDetailsContent />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
