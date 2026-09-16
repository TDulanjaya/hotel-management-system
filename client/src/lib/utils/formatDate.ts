// Format date helper
export function formatDate(
  date: string | number | Date | null | undefined,
  options?: { includeTime?: boolean; format?: "short" | "medium" | "long" | "iso" }
): string {
  if (!date) return "N/A";

  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";

  if (options?.format === "iso") {
    return d.toISOString().split("T")[0];
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: options?.format === "short" ? "short" : "long",
    day: "numeric",
  };

  if (options?.includeTime) {
    formatOptions.hour = "2-digit";
    formatOptions.minute = "2-digit";
    formatOptions.hour12 = true;
  }

  return new Intl.DateTimeFormat("en-US", formatOptions).format(d);
}

export function formatTime(timeStr?: string | null): string {
  if (!timeStr) return "";
  return timeStr;
}

export default formatDate;
