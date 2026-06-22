import Link from "next/link";
import { society } from "@/lib/society";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${society.name} — domov`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/uploads/logo.png"
        alt=""
        className="h-11 w-11 shrink-0 rounded-xl object-contain"
      />
      <span className="flex flex-col leading-tight">
        <span className="font-serif text-[15px] font-semibold text-pine-dark">
          PD Goričko – Tromeja
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
          Planinsko društvo
        </span>
      </span>
    </Link>
  );
}
