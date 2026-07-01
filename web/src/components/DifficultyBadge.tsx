import type { Difficulty } from "../types";
import { difficultyLabel } from "../lib/format";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <span className={`badge badge-${difficulty}`}>{difficultyLabel(difficulty)}</span>;
}
