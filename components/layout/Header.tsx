"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { NAV_LINKS } from "@/components/layout/nav-links";
import { Menu, X } from "@/components/icons";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-cream/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Glavna navigacija" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                isActive(link.href)
                  ? "bg-pine-50 text-pine-dark"
                  : "text-ink/80 hover:bg-pine-50 hover:text-pine-dark",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/kontakt" size="md" variant="primary">
            Pridruži se nam
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobilni-meni"
          aria-label={open ? "Zapri meni" : "Odpri meni"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-pine-dark hover:bg-pine-50 focus-visible:outline-2 focus-visible:outline-pine md:hidden cursor-pointer"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div id="mobilni-meni" className="md:hidden">
          <nav
            aria-label="Mobilna navigacija"
            className="border-t border-border bg-cream px-4 pb-6 pt-2"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "block rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200",
                  isActive(link.href)
                    ? "bg-pine-50 text-pine-dark"
                    : "text-ink hover:bg-pine-50 hover:text-pine-dark",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button href="/kontakt" onClick={close} size="lg" variant="primary" className="mt-3 w-full">
              Pridruži se nam
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
