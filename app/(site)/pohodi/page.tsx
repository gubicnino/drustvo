import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HikeCard } from "@/components/public/HikeCard";
import {
  HikeFilters,
  type DifficultyFilter,
  type SortOrder,
} from "@/components/public/HikeFilters";
import { getUpcomingHikes, getPastHikes } from "@/lib/hikes";
import type { Hike } from "@/types";

export const metadata: Metadata = {
  title: "Pohodi",
  description:
    "Prihajajoči in pretekli pohodi Planinskega društva Goričko – Tromeja. Filtriraj po težavnosti in razvrsti po datumu.",
  alternates: { canonical: "/pohodi" },
};

const VALID_DIFF: DifficultyFilter[] = ["all", "easy", "medium", "hard"];

function applySort(list: Hike[], sort: SortOrder): Hike[] {
  return [...list].sort((a, b) =>
    sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date),
  );
}

export default async function PohodiPage({
  searchParams,
}: {
  searchParams: Promise<{ tezavnost?: string; razvrsti?: string }>;
}) {
  const sp = await searchParams;
  const difficulty: DifficultyFilter = VALID_DIFF.includes(sp.tezavnost as DifficultyFilter)
    ? (sp.tezavnost as DifficultyFilter)
    : "all";
  const sort: SortOrder = sp.razvrsti === "oldest" ? "oldest" : "newest";

  const matches = (h: Hike) => difficulty === "all" || h.difficulty === difficulty;

  const upcoming = applySort(getUpcomingHikes().filter(matches), sort);
  const past = applySort(getPastHikes().filter(matches), sort);
  const total = upcoming.length + past.length;

  return (
    <>
      <header className="border-b border-border bg-sand py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Pohodi"
            title="Naši pohodi in izleti"
            description="Od lahkih družinskih sprehodov do zahtevnih visokogorskih vzponov. Izberi pohod, ki ti ustreza, in se nam pridruži."
          />
        </Container>
      </header>

      <Container className="py-12">
        <HikeFilters difficulty={difficulty} sort={sort} />

        {total === 0 && (
          <p className="mt-10 rounded-2xl border border-border bg-white p-8 text-center text-muted">
            Za izbrano težavnost ni pohodov. Poskusi z drugim filtrom.
          </p>
        )}

        {upcoming.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-pine-dark">
              Prihajajoči pohodi
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((hike) => (
                <HikeCard key={hike.id} hike={hike} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-semibold text-pine-dark">Pretekli pohodi</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((hike) => (
                <HikeCard key={hike.id} hike={hike} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
