import type { Difficulty } from "@/types";

/** Tiny className combiner (no clsx dependency needed). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Parse an ISO date (YYYY-MM-DD) as a local date (no timezone drift). */
function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Long Slovenian date via Intl, e.g. "12. julij 2026". */
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("sl-SI", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(parseLocalDate(iso));
  } catch {
    return iso;
  }
}

/** Short Slovenian date, e.g. "12. 07. 2026". */
export function formatDateShort(iso: string): string {
  try {
    return new Intl.DateTimeFormat("sl-SI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(parseLocalDate(iso));
  } catch {
    return iso;
  }
}

/** Machine-readable parts for <time> and the day-of-month badge. */
export function dateParts(iso: string): { day: string; month: string } {
  const d = parseLocalDate(iso);
  return {
    day: new Intl.DateTimeFormat("sl-SI", { day: "numeric" }).format(d),
    month: new Intl.DateTimeFormat("sl-SI", { month: "short" }).format(d).replace(".", ""),
  };
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Lahko",
  medium: "Srednje",
  hard: "Zahtevno",
};

export function difficultyLabel(d: Difficulty): string {
  return DIFFICULTY_LABELS[d] ?? d;
}

/** Slovenian-aware slugify (transliterates č/š/ž/đ/ć). */
export function slugify(input: string): string {
  const map: Record<string, string> = {
    č: "c", š: "s", ž: "z", đ: "d", ć: "c",
    Č: "c", Š: "s", Ž: "z", Đ: "d", Ć: "c",
  };
  return input
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Today's date as YYYY-MM-DD (local). */
export function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
}
