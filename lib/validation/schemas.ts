import { z } from "zod";

export const difficultyEnum = z.enum(["easy", "medium", "hard"]);

export const hikeSchema = z.object({
  id: z.uuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: "Neveljaven slug" }),
  title: z.string().min(3, { error: "Naslov naj ima vsaj 3 znake" }).max(120),
  date: z.iso.date(),
  location: z.string().min(2, { error: "Vnesite lokacijo" }).max(120),
  difficulty: difficultyEnum,
  distance: z.string().max(40),
  elevation: z.string().max(40),
  description: z.string().min(10, { error: "Opis naj ima vsaj 10 znakov" }).max(5000),
  image: z.union([z.string().startsWith("/uploads/"), z.literal("")]),
  images: z.array(z.string().startsWith("/uploads/")).default([]),
  published: z.boolean().default(false),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

/** What the admin form submits; server fills id/slug/timestamps. */
export const hikeFormSchema = hikeSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  passwordHash: z.string(),
  role: z.literal("admin"),
});

export const loginSchema = z.object({
  username: z.string().min(1, { error: "Vnesite uporabniško ime" }),
  password: z.string().min(1, { error: "Vnesite geslo" }),
});

export const hikesFileSchema = z.object({ hikes: z.array(hikeSchema) });
export const usersFileSchema = z.object({ users: z.array(userSchema) });

export type HikeFormValues = z.infer<typeof hikeFormSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type UserRecord = z.infer<typeof userSchema>;
