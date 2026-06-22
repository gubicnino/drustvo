import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { ArrowRight, Users, CalendarDays, Mountain } from "@/components/icons";
import { society } from "@/lib/society";

export function Hero() {
  const stats = [
    { icon: CalendarDays, value: society.founded, label: "Leto ustanovitve" },
    { icon: Users, value: society.memberCount, label: "Članov" },
    { icon: Mountain, value: society.hikesPerYear, label: "Pohodov letno" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background scene */}
      <div className="absolute inset-0 -z-10">
        <Placeholder seed="goricko-tromeja-hero" className="opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/80 via-cream/20 to-transparent" />
      </div>

      <Container className="flex flex-col justify-center py-20 sm:py-28 lg:min-h-[78vh] lg:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-pine/20 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-pine-dark backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-amber" aria-hidden="true" />
            Planinsko društvo na tromeji treh dežel
          </span>

          <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-[1.08] text-pine-dark sm:text-5xl lg:text-6xl">
            Skupaj odkrivamo lepote Goričkega in Tromeje
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
            Vodeni pohodi, izleti in družabni dogodki za vse generacije – od lahkih
            sprehodov po gričevnatem Goričkem do vzponov na najvišje slovenske vrhove.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/pohodi" size="lg" variant="primary">
              Naši pohodi
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="/kontakt" size="lg" variant="outline">
              Pridruži se nam
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-border bg-white/80 p-4 backdrop-blur"
              >
                <Icon className="h-5 w-5 text-pine" />
                <dt className="sr-only">{label}</dt>
                <dd className="mt-2 font-serif text-2xl font-semibold text-pine-dark">
                  {value}
                </dd>
                <p className="text-xs font-medium text-muted">{label}</p>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
