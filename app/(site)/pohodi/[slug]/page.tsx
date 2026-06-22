import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { HikeImage } from "@/components/ui/Placeholder";
import { HikeMeta } from "@/components/public/HikeMeta";
import { HikeCard } from "@/components/public/HikeCard";
import { ArrowRight, CalendarDays, MapPin } from "@/components/icons";
import { getHikeBySlug, getAllSlugs, getUpcomingHikes, isUpcoming } from "@/lib/hikes";
import { society } from "@/lib/society";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hike = getHikeBySlug(slug);
  if (!hike) return { title: "Pohod ni najden" };

  const description = hike.description.slice(0, 160);
  return {
    title: hike.title,
    description,
    alternates: { canonical: `/pohodi/${hike.slug}` },
    openGraph: {
      type: "article",
      title: hike.title,
      description,
      url: `/pohodi/${hike.slug}`,
    },
  };
}

export default async function HikePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hike = getHikeBySlug(slug);
  if (!hike) notFound();

  const related = getUpcomingHikes()
    .filter((h) => h.slug !== hike.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: hike.title,
    startDate: hike.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: hike.description,
    location: {
      "@type": "Place",
      name: hike.location,
      address: { "@type": "PostalAddress", addressCountry: "SI" },
    },
    organizer: {
      "@type": "Organization",
      name: society.name,
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pd-goricko-tromeja.si",
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero image */}
      <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden bg-pine-dark">
        <HikeImage src={hike.image} alt={`Pohod: ${hike.title}`} seed={hike.slug} />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-dark/80 via-pine-dark/20 to-transparent" />
        <Container className="absolute inset-x-0 bottom-0 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <DifficultyBadge difficulty={hike.difficulty} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-pine-dark backdrop-blur">
              {isUpcoming(hike) ? "Prihajajoči pohod" : "Pretekli pohod"}
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl font-semibold text-white sm:text-5xl">
            {hike.title}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/90">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(hike.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {hike.location}
            </span>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <nav aria-label="Drobtinice" className="text-sm text-muted">
          <Link href="/pohodi" className="hover:text-pine-dark">
            Pohodi
          </Link>{" "}
          <span aria-hidden="true">/</span>{" "}
          <span className="text-ink">{hike.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HikeMeta hike={hike} variant="grid" />

            <div className="mt-8 max-w-prose text-lg leading-relaxed text-ink/90">
              {hike.description.split("\n").map((para, i) => (
                <p key={i} className="mt-4 first:mt-0">
                  {para}
                </p>
              ))}
            </div>

            {hike.images.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {hike.images.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-xl border border-border"
                  >
                    <HikeImage src={src} alt={`${hike.title} – slika ${i + 1}`} seed={`${hike.slug}-${i}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-serif text-lg font-semibold text-pine-dark">Se nam pridružiš?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Za prijavo na pohod ali dodatne informacije nas kontaktiraj. Veseli bomo
                tvojega obiska v gorah.
              </p>
              <Button href="/kontakt" className="mt-5 w-full" variant="primary">
                Kontaktiraj nas
                <ArrowRight className="h-4 w-4" />
              </Button>
              <div className="mt-5 overflow-hidden rounded-xl border-t border-border pt-5">
                <div className="aspect-video overflow-hidden rounded-xl">
                  <HikeImage
                    src="/uploads/pridruzi-se.jpg"
                    seed={`${hike.slug}-mini`}
                    alt="Pridruži se nam na pohodu"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-border bg-sand py-16">
          <Container>
            <h2 className="font-serif text-2xl font-semibold text-pine-dark">Še več pohodov</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((h) => (
                <HikeCard key={h.id} hike={h} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
