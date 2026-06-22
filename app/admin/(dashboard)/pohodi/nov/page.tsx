import type { Metadata } from "next";
import Link from "next/link";
import { HikeForm } from "@/components/admin/HikeForm";

export const metadata: Metadata = { title: "Nov pohod" };

export default function NewHikePage() {
  return (
    <div>
      <nav aria-label="Drobtinice" className="text-sm text-muted">
        <Link href="/admin/pohodi" className="hover:text-pine-dark">
          Pohodi
        </Link>{" "}
        <span aria-hidden="true">/</span> <span className="text-ink">Nov pohod</span>
      </nav>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-pine-dark">Nov pohod</h1>
      <p className="mt-1.5 text-muted">Izpolni podatke in ustvari nov pohod.</p>

      <div className="mt-8">
        <HikeForm />
      </div>
    </div>
  );
}
