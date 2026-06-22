import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid, type GalleryItem } from "@/components/public/GalleryGrid";
import { getHikes } from "@/lib/hikes";

export const metadata: Metadata = {
  title: "Galerija",
  description:
    "Fotografske utrinke z pohodov Planinskega društva Goričko – Tromeja. Trenutki iz narave, z vrhov in s skupnih druženj.",
  alternates: { canonical: "/galerija" },
};

export default function GalerijaPage() {
  const hikes = getHikes();

  // Build the gallery from every hike's photos. Hikes without photos fall back to
  // an on-brand placeholder so the grid never looks broken.
  const items: GalleryItem[] = hikes.flatMap((h) =>
    h.images.length > 0
      ? h.images.map((src, i) => ({
          seed: `${h.slug}-${i}`,
          src,
          title: h.title,
          caption: h.location,
        }))
      : [{ seed: h.slug, title: h.title, caption: h.location }],
  );

  return (
    <>
      <header className="border-b border-border bg-sand py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Galerija"
            title="Utrinki z naših poti"
            description="Zbirka fotografij z naših pohodov in druženj. Kliknite sliko za večji prikaz, med njimi se premikate s puščicami."
          />
        </Container>
      </header>

      <Container className="py-12">
        <GalleryGrid items={items} />
      </Container>
    </>
  );
}
