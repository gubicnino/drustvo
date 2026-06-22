import "server-only";
import { randomUUID } from "node:crypto";
import { readJsonFresh, writeJson } from "@/lib/content/storage";
import { slugify } from "@/lib/utils";
import type { Hike } from "@/types";
import type { HikeFormValues } from "@/lib/validation/schemas";

const HIKES_PATH = "content/hikes.json";

interface HikesFile {
  hikes: Hike[];
}

async function read(): Promise<Hike[]> {
  const file = await readJsonFresh<HikesFile>(HIKES_PATH);
  return file.hikes ?? [];
}

async function write(hikes: Hike[], message: string): Promise<void> {
  await writeJson(HIKES_PATH, { hikes }, message);
}

function uniqueSlug(base: string, existing: Hike[], ignoreId?: string): string {
  const taken = new Set(existing.filter((h) => h.id !== ignoreId).map((h) => h.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** All hikes (including unpublished), newest first — for the admin. */
export async function getAllHikesAdmin(): Promise<Hike[]> {
  return (await read()).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getHikeByIdAdmin(id: string): Promise<Hike | null> {
  return (await read()).find((h) => h.id === id) ?? null;
}

export async function createHike(input: HikeFormValues): Promise<Hike> {
  const hikes = await read();
  const now = new Date().toISOString();
  const hike: Hike = {
    id: randomUUID(),
    slug: uniqueSlug(slugify(input.title), hikes),
    title: input.title,
    date: input.date,
    location: input.location,
    difficulty: input.difficulty,
    distance: input.distance,
    elevation: input.elevation,
    description: input.description,
    image: input.image,
    images: input.images ?? [],
    published: input.published,
    createdAt: now,
    updatedAt: now,
  };
  hikes.push(hike);
  await write(hikes, `Dodaj pohod: ${hike.title}`);
  return hike;
}

export async function updateHike(id: string, input: HikeFormValues): Promise<Hike | null> {
  const hikes = await read();
  const idx = hikes.findIndex((h) => h.id === id);
  if (idx === -1) return null;
  const existing = hikes[idx];
  const updated: Hike = {
    ...existing,
    title: input.title,
    date: input.date,
    location: input.location,
    difficulty: input.difficulty,
    distance: input.distance,
    elevation: input.elevation,
    description: input.description,
    image: input.image,
    images: input.images ?? [],
    published: input.published,
    updatedAt: new Date().toISOString(),
  };
  hikes[idx] = updated;
  await write(hikes, `Posodobi pohod: ${updated.title}`);
  return updated;
}

export async function deleteHike(id: string): Promise<void> {
  const hikes = await read();
  const target = hikes.find((h) => h.id === id);
  await write(
    hikes.filter((h) => h.id !== id),
    `Izbriši pohod: ${target?.title ?? id}`,
  );
}

export async function setPublished(id: string, published: boolean): Promise<void> {
  const hikes = await read();
  const idx = hikes.findIndex((h) => h.id === id);
  if (idx === -1) return;
  hikes[idx] = { ...hikes[idx], published, updatedAt: new Date().toISOString() };
  await write(hikes, `${published ? "Objavi" : "Skrij"} pohod: ${hikes[idx].title}`);
}
