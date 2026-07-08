export function formatRupiah(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}
