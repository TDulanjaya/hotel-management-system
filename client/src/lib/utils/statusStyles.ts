export function getStatusBadgeClass(status: string): string {
  // normalise
  const s = status?.toLowerCase();
  const map: Record<string, string> = {
    available: "bg-green-100 text-green-700",
    "in stock": "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    occupied: "bg-yellow-100 text-yellow-700",
    "low stock": "bg-yellow-100 text-yellow-700",
    cleaning: "bg-yellow-100 text-yellow-700",
    pending: "bg-yellow-100 text-yellow-700",
    critical: "bg-red-100 text-red-700",
    maintenance: "bg-red-100 text-red-700",
    urgent: "bg-red-100 text-red-700",
    booked: "bg-yellow-100 text-yellow-700",
    checked_out: "bg-slate-100 text-slate-700",
  };
  return map[s] ?? "bg-slate-100 text-slate-700";
}
