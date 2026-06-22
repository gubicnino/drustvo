"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { Mountain, CalendarDays, ArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Nadzorna plošča", icon: CalendarDays },
  { href: "/admin/pohodi", label: "Pohodi", icon: Mountain },
];

export function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex w-full flex-col gap-6 border-b border-border bg-white p-4 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:sticky lg:top-0">
      <Link href="/admin/dashboard" className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine text-white">
          <Mountain className="h-5 w-5" />
        </span>
        <span className="font-serif text-sm font-semibold text-pine-dark">
          Skrbništvo
        </span>
      </Link>

      <nav aria-label="Skrbniška navigacija" className="flex gap-1 lg:flex-1 lg:flex-col">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              isActive(href)
                ? "bg-pine-50 text-pine-dark"
                : "text-ink/80 hover:bg-pine-50 hover:text-pine-dark",
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{username}</p>
          <Link
            href="/"
            target="_blank"
            className="text-xs text-muted transition-colors hover:text-pine-dark"
          >
            Odpri spletno stran ↗
          </Link>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-pine-dark transition-colors duration-200 hover:bg-pine-50 cursor-pointer"
          >
            Odjava
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
