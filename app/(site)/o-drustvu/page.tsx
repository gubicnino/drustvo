import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HikeImage } from "@/components/ui/Placeholder";
import { ArrowRight, Compass, Heart, Leaf, Users, CalendarDays, Mountain } from "@/components/icons";
import { society } from "@/lib/society";

export const metadata: Metadata = {
  title: "O društvu",
  description:
    "Spoznaj Planinsko društvo Goričko – Tromeja: našo zgodovino, poslanstvo in vrednote. Več kot 60 let povezujemo ljubitelje gora.",
  alternates: { canonical: "/o-drustvu" },
};

export default function ODrustvuPage() {
  const stats = [
    { icon: CalendarDays, value: society.founded, label: "Leto ustanovitve" },
    { icon: Users, value: society.memberCount, label: "Aktivnih članov" },
    { icon: Mountain, value: society.hikesPerYear, label: "Pohodov na leto" },
  ];

  const values = [
    {
      icon: Compass,
      title: "Varnost in znanje",
      text: "Naši usposobljeni vodniki skrbijo, da so pohodi varni, dobro pripravljeni in prilagojeni skupini.",
    },
    {
      icon: Heart,
      title: "Skupnost",
      text: "Smo medgeneracijsko društvo, kjer se prepletajo izkušnje starejših in zagon mladih.",
    },
    {
      icon: Leaf,
      title: "Odgovornost do narave",
      text: "Spoštujemo gorsko okolje, hodimo po označenih poteh in za seboj ne puščamo sledi.",
    },
  ];

  return (
    <>
      <header className="border-b border-border bg-sand py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="O društvu"
            title={society.name}
            description={society.tagline}
          />
        </Container>
      </header>

      <Container className="py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border shadow-sm">
            <HikeImage
              src="/uploads/thumbnail.jpg"
              seed="o-drustvu-hero"
              alt="Člani PD Goričko – Tromeja na skupnem pohodu"
            />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-pine-dark sm:text-3xl">
              Naša zgodba
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/85">{society.about}</p>
            <p className="mt-4 leading-relaxed text-muted">{society.mission}</p>
          </div>
        </div>

        {/* Stats */}
        <dl className="mt-16 grid gap-6 sm:grid-cols-3">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-white p-7 text-center shadow-sm"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-50 text-pine">
                <Icon className="h-6 w-6" />
              </span>
              <dd className="mt-4 font-serif text-3xl font-semibold text-pine-dark">{value}</dd>
              <dt className="mt-1 text-sm text-muted">{label}</dt>
            </div>
          ))}
        </dl>

        {/* Values */}
        <div className="mt-20">
          <SectionHeading eyebrow="Naše vrednote" title="V kaj verjamemo" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border bg-white p-7 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pine text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold text-pine-dark">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Membership info */}
        <div className="mt-20 overflow-hidden rounded-3xl border border-border bg-pine-50 p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-pine-dark sm:text-3xl">
                Postani član
              </h2>
              <p className="mt-3 leading-relaxed text-ink/80">
                Članstvo prinaša popuste na vodene pohode, planinsko zavarovanje in dobro
                družbo na vsakem koraku.
              </p>
              <Button href="/kontakt" className="mt-6" variant="primary">
                Kontaktiraj nas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
              <HikeImage
                src="/uploads/pridruzi-se.jpg"
                seed="clanstvo"
                alt="Pridruži se Planinskemu društvu Goričko – Tromeja"
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
