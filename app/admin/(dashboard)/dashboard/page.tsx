import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { getAllHikesAdmin } from "@/lib/content/hikes-repo";
import { formatDate, todayISO } from "@/lib/utils";
import { CalendarDays, Mountain, ArrowRight } from "@/components/icons";

export const metadata: Metadata = { title: "Nadzorna plošča" };

export default async function DashboardPage() {
  const hikes = await getAllHikesAdmin();
  const today = todayISO();
  const published = hikes.filter((h) => h.published);
  const upcoming = published.filter((h) => h.date >= today);
  const drafts = hikes.filter((h) => !h.published);

  const stats = [
    { label: "Vseh pohodov", value: hikes.length },
    { label: "Objavljenih", value: published.length },
    { label: "Prihajajočih", value: upcoming.length },
    { label: "Osnutkov", value: drafts.length },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-pine-dark">Nadzorna plošča</h1>
          <p className="mt-1.5 text-muted">Pregled in upravljanje pohodov društva.</p>
        </div>
        <Button href="/admin/pohodi/nov" variant="primary">
          Dodaj pohod
        </Button>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-white p-5">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-1 font-serif text-3xl font-semibold text-pine-dark">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-pine-dark">
            <CalendarDays className="h-5 w-5 text-pine" />
            Prihajajoči pohodi
          </h2>
          <Link
            href="/admin/pohodi"
            className="inline-flex items-center gap-1 text-sm font-medium text-pine hover:text-pine-dark"
          >
            Vsi pohodi <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {upcoming.length > 0 ? (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
            {upcoming.slice(0, 5).map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <Link
                    href={`/admin/pohodi/${h.id}`}
                    className="truncate font-medium text-ink hover:text-pine-dark"
                  >
                    {h.title}
                  </Link>
                  <p className="text-sm text-muted">
                    {formatDate(h.date)} · {h.location}
                  </p>
                </div>
                <DifficultyBadge difficulty={h.difficulty} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-2xl border border-border bg-white p-8 text-center text-muted">
            <Mountain className="mx-auto mb-3 h-8 w-8 text-pine/40" />
            Ni prihajajočih pohodov.{" "}
            <Link href="/admin/pohodi/nov" className="font-medium text-pine hover:underline">
              Dodaj prvega.
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
