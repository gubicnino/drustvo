import { cn } from "@/lib/utils";
import { difficultyLabel } from "@/lib/utils";
import type { Difficulty } from "@/types";

const styles: Record<Difficulty, string> = {
  easy: "bg-[var(--color-easy-bg)] text-[var(--color-easy-fg)]",
  medium: "bg-[var(--color-medium-bg)] text-[var(--color-medium-fg)]",
  hard: "bg-[var(--color-hard-bg)] text-[var(--color-hard-fg)]",
};

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[difficulty],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
      />
      {difficultyLabel(difficulty)}
    </span>
  );
}
