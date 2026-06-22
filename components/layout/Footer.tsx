import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { NAV_LINKS } from "@/components/layout/nav-links";
import { society } from "@/lib/society";
import { Mail, Phone, MapPin, Facebook } from "@/components/icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-sand">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {society.tagline}
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={society.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-pine-dark transition-colors duration-200 hover:bg-pine hover:text-white"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>

        <nav aria-label="Noga – povezave">
          <h2 className="font-serif text-base font-semibold text-pine-dark">Povezave</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted transition-colors duration-200 hover:text-pine-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-serif text-base font-semibold text-pine-dark">Kontakt</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pine" />
              <span>{society.address}</span>
            </li>
            <li>
              <a
                href={`mailto:${society.email}`}
                className="flex items-start gap-2.5 transition-colors duration-200 hover:text-pine-dark"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-pine" />
                <span>{society.email}</span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${society.phone.replace(/\s/g, "")}`}
                className="flex items-start gap-2.5 transition-colors duration-200 hover:text-pine-dark"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-pine" />
                <span>{society.phone}</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-base font-semibold text-pine-dark">Društvo</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Ustanovljeno leta {society.founded}. {society.memberCount} članov, {society.hikesPerYear} pohodov na leto.
          </p>
        </div>
      </Container>

      <div className="border-t border-border/70">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <p>
            © {year} {society.name}. Vse pravice pridržane.
          </p>
          <p>
            <Link href="/admin" className="transition-colors duration-200 hover:text-pine-dark">
              Skrbniški dostop
            </Link>
          </p>
        </Container>
      </div>
    </footer>
  );
}
