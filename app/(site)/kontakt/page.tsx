import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Mail, Phone, MapPin, Facebook } from "@/components/icons";
import { society } from "@/lib/society";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktiraj Planinsko društvo Goričko – Tromeja. Piši nam, pokliči ali se nam pridruži na naslednjem pohodu.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  const details = [
    { icon: Mail, label: "E-pošta", value: society.email, href: `mailto:${society.email}` },
    {
      icon: Phone,
      label: "Telefon",
      value: society.phone,
      href: `tel:${society.phone.replace(/\s/g, "")}`,
    },
    { icon: MapPin, label: "Naslov", value: society.address },
  ];

  const mapQuery = encodeURIComponent(society.address);

  return (
    <>
      <header className="border-b border-border bg-sand py-14 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Kontakt"
            title="Stopi v stik z nami"
            description="Imaš vprašanje o pohodu ali članstvu? Obišči nas, pokliči ali piši."
          />
        </Container>
      </header>

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="font-serif text-2xl font-semibold text-pine-dark">Kje nas najdete</h2>
            <p className="mt-2 text-muted">{society.address}</p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border shadow-sm">
              <iframe
                title={`Zemljevid – ${society.name}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-90 w-full border-0 sm:h-110"
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-pine transition-colors duration-200 hover:text-pine-dark"
            >
              <MapPin className="h-4 w-4" />
              Odpri v Google Zemljevidih
            </a>
          </div>

          <aside className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-white p-7 shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-pine-dark">Podatki društva</h2>
              <ul className="mt-5 space-y-4">
                {details.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          className="font-medium text-ink transition-colors duration-200 hover:text-pine"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="font-medium text-ink">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-border pt-6">
                <p className="text-sm font-medium text-ink">Sledi nam</p>
                <div className="mt-3 flex gap-3">
                  <a
                    href={society.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-pine-dark transition-colors duration-200 hover:bg-pine hover:text-white"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
