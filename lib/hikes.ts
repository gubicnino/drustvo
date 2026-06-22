import hikesData from "@/content/hikes.json";
import type { Hike } from "@/types";
import { todayISO } from "@/lib/utils";

const allHikes: Hike[] = (hikesData.hikes as Hike[]).filter((h) => h.published);

function byDateDesc(a: Hike, b: Hike) {
  return b.date.localeCompare(a.date);
}
function byDateAsc(a: Hike, b: Hike) {
  return a.date.localeCompare(b.date);
}

/** All published hikes, newest first. */
export function getHikes(): Hike[] {
  return [...allHikes].sort(byDateDesc);
}

/** Upcoming hikes (today or later), soonest first. */
export function getUpcomingHikes(): Hike[] {
  const today = todayISO();
  return [...allHikes].filter((h) => h.date >= today).sort(byDateAsc);
}

/** Past hikes (before today), most recent first. */
export function getPastHikes(): Hike[] {
  const today = todayISO();
  return [...allHikes].filter((h) => h.date < today).sort(byDateDesc);
}

export function getHikeBySlug(slug: string): Hike | null {
  return allHikes.find((h) => h.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return allHikes.map((h) => h.slug);
}

export function isUpcoming(hike: Hike): boolean {
  return hike.date >= todayISO();
}
