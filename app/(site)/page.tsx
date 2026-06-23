import { ArrowRight, Compass, Heart, Leaf, Mail, MapPin, Phone } from "@/components/icons";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { Hero } from "@/components/public/Hero";
import { HikeCard } from "@/components/public/HikeCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HikeImage } from "@/components/ui/Placeholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getHikes, getPastHikes } from "@/lib/hikes";
import { society } from "@/lib/society";
import Link from "next/link";

export default function HomePage() {
  const featuredHikes = getPastHikes().slice(0, 3);
  const galleryItems = getHikes()
    .flatMap((h) => h.images.map((src, i) => ({ seed: `${h.slug}-${i}`, src, title: h.title })))
    .slice(0, 8);

  const values = [
    {
      icon: Compass,
      title: "Vodeni pohodi",
      text: "Izkušeni vodniki poskrbijo za varne in doživete ture po vsej Sloveniji in čez mejo.",
    },
    {
      icon: Heart,
      title: "Dobra družba",
      text: "Pri nas štejejo prijateljstvo, povezanost in skupna ljubezen do gora ter narave.",
    },
    {
      icon: Leaf,
      title: "Spoštljivo do narave",
      text: "V gore stopamo odgovorno – po označenih poteh in z najmanjšim možnim odtisom.",
    },
  ];

  return (
    <>
      <Hero />

      {/* Upcoming hikes */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Zadnji pohodi"
              title="Kje vse smo že bili"
              description="Utrinki z naših zadnjih pohodov. Spremljaj nas za nove termine in se nam pridruži."
            />
            <Button href="/pohodi" variant="outline">
              Prihodnji pohodi
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {featuredHikes.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredHikes.map((hike) => (
                <HikeCard key={hike.id} hike={hike} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl border border-border bg-white p-8 text-center text-muted">
              Trenutno ni razpisanih pohodov. Spremljaj nas za nove termine.
            </p>
          )}
        </Container>
      </section>

      {/* About preview */}
      <section className="bg-sand py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-sm">
            <HikeImage
              src="/uploads/thumbnail.jpg"
              seed="o-drustvu-preview"
              alt="Člani PD Goričko – Tromeja na skupnem pohodu"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="O društvu"
              title="Več kot 60 let v objemu gora"
              description={society.about}
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {values.map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-center gap-2.5 text-sm font-medium text-pine-dark">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine-50 text-pine">
                    <Icon className="h-5 w-5" />
                  </span>
                  {title}
                </div>
              ))}
            </div>
            <Button href="/o-drustvu" className="mt-8" variant="primary">
              Več o nas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Zakaj z nami"
            title="Tri stvari, ki nas povezujejo"
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-white p-7 text-center shadow-sm"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pine text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold text-pine-dark">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Gallery preview */}
      <section className="bg-sand py-20 sm:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Galerija"
              title="Utrinki z naših poti"
              description="Nekaj trenutkov, ujetih na pohodih. Kliknite za večji prikaz."
            />
            <Button href="/galerija" variant="outline">
              Vsa galerija
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-12">
            <GalleryGrid items={galleryItems} />
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-pine px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="absolute inset-0">
              <HikeImage src="/uploads/pridruzi-se.jpg" seed="cta-band" alt="" />
              <div className="absolute inset-0 bg-pine-dark/75" />
            </div>
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance font-serif text-3xl font-semibold text-white sm:text-4xl">
                Postani član in stopi z nami na pot
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-pine-100">
                Članstvo je odprto za vse generacije. Pridruži se skupnosti pohodnikov,
                ki jih druži ljubezen do narave.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/kontakt" size="lg" variant="secondary">
                  Pridruži se nam
                </Button>
                <Button
                  href="/pohodi"
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  Poglej pohode
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact preview */}
      <section className="pb-4">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Mail, label: "E-pošta", value: society.email, href: `mailto:${society.email}` },
              { icon: Phone, label: "Telefon", value: society.phone, href: `tel:${society.phone.replace(/\s/g, "")}` },
              { icon: MapPin, label: "Naslov", value: society.address, href: "/kontakt" },
            ].map(({ icon: Icon, label, value, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-start gap-3 rounded-2xl border border-border bg-white p-5 transition-colors duration-200 hover:border-pine/40 hover:bg-pine-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-medium uppercase tracking-wide text-muted">
                    {label}
                  </span>
                  <span className="mt-0.5 block font-medium text-ink">{value}</span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
