import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { DeleteHikeButton } from "@/components/admin/DeleteHikeButton";
import { getAllHikesAdmin } from "@/lib/content/hikes-repo";
import { formatDateShort, todayISO } from "@/lib/utils";

export const metadata: Metadata = { title: "Pohodi" };

export default async function AdminPohodiPage() {
  const hikes = await getAllHikesAdmin();
  const today = todayISO();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-pine-dark">Pohodi</h1>
          <p className="mt-1.5 text-muted">Dodajaj, ureja in objavljaj pohode.</p>
        </div>
        <Button href="/admin/pohodi/nov" variant="primary">
          Dodaj pohod
        </Button>
      </div>

      {hikes.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-border bg-white p-10 text-center text-muted">
          Še ni pohodov.{" "}
          <Link href="/admin/pohodi/nov" className="font-medium text-pine hover:underline">
            Dodaj prvega.
          </Link>
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
          {/* Desktop table */}
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="border-b border-border bg-sand/60 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Pohod</th>
                <th scope="col" className="px-5 py-3 font-semibold">Datum</th>
                <th scope="col" className="px-5 py-3 font-semibold">Težavnost</th>
                <th scope="col" className="px-5 py-3 font-semibold">Objavljen</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Dejanja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hikes.map((h) => (
                <tr key={h.id} className="hover:bg-cream/60">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/pohodi/${h.id}`} className="font-medium text-ink hover:text-pine-dark">
                      {h.title}
                    </Link>
                    <p className="text-xs text-muted">{h.location}</p>
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    {formatDateShort(h.date)}
                    {h.date < today && (
                      <span className="ml-2 rounded bg-sand px-1.5 py-0.5 text-[10px] font-medium text-muted">
                        pretekli
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <DifficultyBadge difficulty={h.difficulty} />
                  </td>
                  <td className="px-5 py-3.5">
                    <PublishToggle id={h.id} published={h.published} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/pohodi/${h.id}`}
                        className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-pine-dark transition-colors duration-200 hover:bg-pine-50"
                      >
                        Uredi
                      </Link>
                      <DeleteHikeButton id={h.id} title={h.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="divide-y divide-border md:hidden">
            {hikes.map((h) => (
              <li key={h.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/admin/pohodi/${h.id}`} className="font-medium text-ink">
                      {h.title}
                    </Link>
                    <p className="text-sm text-muted">
                      {formatDateShort(h.date)} · {h.location}
                    </p>
                    <div className="mt-2">
                      <DifficultyBadge difficulty={h.difficulty} />
                    </div>
                  </div>
                  <PublishToggle id={h.id} published={h.published} />
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <Link
                    href={`/admin/pohodi/${h.id}`}
                    className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-pine-dark hover:bg-pine-50"
                  >
                    Uredi
                  </Link>
                  <DeleteHikeButton id={h.id} title={h.title} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
