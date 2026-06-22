"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hikeFormSchema } from "@/lib/validation/schemas";
import {
  createHike,
  updateHike,
  deleteHike,
  setPublished,
} from "@/lib/content/hikes-repo";
import { verifySession } from "@/lib/auth/dal";

export interface HikeFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/pohodi");
  revalidatePath("/galerija");
  if (slug) revalidatePath(`/pohodi/${slug}`);
  revalidatePath("/admin/pohodi");
  revalidatePath("/admin/dashboard");
}

function parseHikeForm(formData: FormData) {
  const raw = {
    title: String(formData.get("title") ?? ""),
    date: String(formData.get("date") ?? ""),
    location: String(formData.get("location") ?? ""),
    difficulty: String(formData.get("difficulty") ?? ""),
    distance: String(formData.get("distance") ?? ""),
    elevation: String(formData.get("elevation") ?? ""),
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? ""),
    images: formData
      .getAll("images")
      .map((v) => String(v))
      .filter((v) => v.startsWith("/uploads/")),
    published:
      formData.get("published") === "on" || formData.get("published") === "true",
  };
  return hikeFormSchema.safeParse(raw);
}

export async function saveHikeAction(
  _prev: HikeFormState | undefined,
  formData: FormData,
): Promise<HikeFormState> {
  await verifySession();

  const id = formData.get("id") ? String(formData.get("id")) : null;
  const parsed = parseHikeForm(formData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Preverite vnesene podatke.", fieldErrors };
  }

  let slug: string | undefined;
  if (id) {
    const updated = await updateHike(id, parsed.data);
    if (!updated) return { error: "Pohod ne obstaja." };
    slug = updated.slug;
  } else {
    const created = await createHike(parsed.data);
    slug = created.slug;
  }

  revalidatePublic(slug);
  redirect("/admin/pohodi");
}

export async function deleteHikeAction(formData: FormData): Promise<void> {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await deleteHike(id);
    revalidatePublic();
  }
  redirect("/admin/pohodi");
}

export async function togglePublishAction(formData: FormData): Promise<void> {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  const published = formData.get("published") === "true";
  if (id) {
    await setPublished(id, published);
    revalidatePublic();
  }
  revalidatePath("/admin/pohodi");
}
