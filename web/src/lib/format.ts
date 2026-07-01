import type { Difficulty } from "../types";

const SL_MONTHS = [
  "januar", "februar", "marec", "april", "maj", "junij",
  "julij", "avgust", "september", "oktober", "november", "december",
];
const SL_MONTHS_SHORT = [
  "jan", "feb", "mar", "apr", "maj", "jun",
  "jul", "avg", "sep", "okt", "nov", "dec",
];

function parts(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split("-").map(Number);
  return { y: y || 0, m: m || 0, d: d || 0 };
}

/** "2026-09-15" -> "15. september 2026" */
export function formatDate(iso: string): string {
  const { y, m, d } = parts(iso);
  if (!m) return iso;
  return `${d}. ${SL_MONTHS[m - 1]} ${y}`;
}

/** "2026-09-15" -> "15. 09. 2026" */
export function formatDateShort(iso: string): string {
  const { y, m, d } = parts(iso);
  if (!m) return iso;
  return `${String(d).padStart(2, "0")}. ${String(m).padStart(2, "0")}. ${y}`;
}

export function dateParts(iso: string): { day: string; month: string } {
  const { m, d } = parts(iso);
  return { day: String(d), month: SL_MONTHS_SHORT[m - 1] ?? "" };
}

const LABELS: Record<Difficulty, string> = {
  easy: "Lahko",
  medium: "Srednje",
  hard: "Zahtevno",
};
export function difficultyLabel(d: Difficulty): string {
  return LABELS[d] ?? d;
}

export function todayISO(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(
    n.getDate(),
  ).padStart(2, "0")}`;
}

export function isUpcoming(hike: { date: string }): boolean {
  return hike.date >= todayISO();
}
