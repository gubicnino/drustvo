import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HikeForm } from "@/components/admin/HikeForm";
import { getHikeByIdAdmin } from "@/lib/content/hikes-repo";

export const metadata: Metadata = { title: "Uredi pohod" };

export default async function EditHikePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hike = await getHikeByIdAdmin(id);
  if (!hike) notFound();

  return (
    <div>
      <nav aria-label="Drobtinice" className="text-sm text-muted">
        <Link href="/admin/pohodi" className="hover:text-pine-dark">
          Pohodi
        </Link>{" "}
        <span aria-hidden="true">/</span> <span className="text-ink">Uredi</span>
      </nav>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-pine-dark">{hike.title}</h1>
      <p className="mt-1.5 text-muted">
        Uredi podatke pohoda. Povezava (slug): <code className="text-pine-dark">/pohodi/{hike.slug}</code>
      </p>

      <div className="mt-8">
        <HikeForm hike={hike} />
      </div>
    </div>
  );
}
