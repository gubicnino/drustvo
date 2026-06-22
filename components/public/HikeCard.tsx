import Link from "next/link";
import { HikeImage } from "@/components/ui/Placeholder";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { CalendarDays, MapPin, ArrowRight } from "@/components/icons";
import { formatDate, dateParts } from "@/lib/utils";
import type { Hike } from "@/types";

export function HikeCard({ hike }: { hike: Hike }) {
  const { day, month } = dateParts(hike.date);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden">
        <HikeImage src={hike.image} alt={`Pohod: ${hike.title}`} seed={hike.slug} />
        {/* Date chip */}
        <div className="absolute left-3 top-3 flex flex-col items-center rounded-xl bg-white/95 px-3 py-1.5 text-center shadow-sm backdrop-blur">
          <span className="font-serif text-lg font-semibold leading-none text-pine-dark">
            {day}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {month}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <DifficultyBadge difficulty={hike.difficulty} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-semibold text-pine-dark">
          <Link href={`/pohodi/${hike.slug}`} className="after:absolute after:inset-0">
            {hike.title}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-pine" />
            {formatDate(hike.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-pine" />
            {hike.location}
          </span>
        </div>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {hike.description}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pine transition-colors duration-200 group-hover:text-pine-dark">
          Več o pohodu
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
