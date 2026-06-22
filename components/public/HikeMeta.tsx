import { CalendarDays, MapPin, Ruler, TrendingUp } from "@/components/icons";
import { formatDate } from "@/lib/utils";
import type { Hike } from "@/types";
import { cn } from "@/lib/utils";

export function HikeMeta({
  hike,
  className,
  variant = "row",
}: {
  hike: Hike;
  className?: string;
  variant?: "row" | "grid";
}) {
  const items = [
    { icon: CalendarDays, label: "Datum", value: formatDate(hike.date) },
    { icon: MapPin, label: "Lokacija", value: hike.location },
    { icon: Ruler, label: "Razdalja", value: hike.distance },
    { icon: TrendingUp, label: "Vzpon", value: hike.elevation },
  ];

  if (variant === "grid") {
    return (
      <dl className={cn("grid grid-cols-2 gap-4 sm:grid-cols-4", className)}>
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-4">
            <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
              <Icon className="h-4 w-4 text-pine" />
              {label}
            </dt>
            <dd className="mt-1.5 font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <ul className={cn("flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted", className)}>
      {items.map(({ icon: Icon, label, value }) => (
        <li key={label} className="flex items-center gap-1.5">
          <Icon className="h-4 w-4 text-pine" />
          <span>{value}</span>
        </li>
      ))}
    </ul>
  );
}
