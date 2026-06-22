import Link from "next/link";
import { cn } from "@/lib/utils";

export type DifficultyFilter = "all" | "easy" | "medium" | "hard";
export type SortOrder = "newest" | "oldest";

const DIFFICULTY_OPTIONS: { value: DifficultyFilter; label: string }[] = [
  { value: "all", label: "Vse" },
  { value: "easy", label: "Lahko" },
  { value: "medium", label: "Srednje" },
  { value: "hard", label: "Zahtevno" },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "Najnovejši" },
  { value: "oldest", label: "Najstarejši" },
];

function buildHref(params: { difficulty: DifficultyFilter; sort: SortOrder }) {
  const sp = new URLSearchParams();
  if (params.difficulty !== "all") sp.set("tezavnost", params.difficulty);
  if (params.sort !== "newest") sp.set("razvrsti", params.sort);
  const qs = sp.toString();
  return qs ? `/pohodi?${qs}` : "/pohodi";
}

export function HikeFilters({
  difficulty,
  sort,
}: {
  difficulty: DifficultyFilter;
  sort: SortOrder;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-muted">Težavnost:</span>
        {DIFFICULTY_OPTIONS.map((opt) => {
          const active = opt.value === difficulty;
          return (
            <Link
              key={opt.value}
              href={buildHref({ difficulty: opt.value, sort })}
              aria-pressed={active}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer",
                active
                  ? "bg-pine text-white"
                  : "bg-pine-50 text-pine-dark hover:bg-pine-100",
              )}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-muted">Razvrsti:</span>
        {SORT_OPTIONS.map((opt) => {
          const active = opt.value === sort;
          return (
            <Link
              key={opt.value}
              href={buildHref({ difficulty, sort: opt.value })}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer",
                active
                  ? "border-pine bg-pine-50 text-pine-dark"
                  : "border-border text-muted hover:border-pine/40 hover:text-pine-dark",
              )}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
