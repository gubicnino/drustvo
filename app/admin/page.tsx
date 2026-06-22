import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login-form";
import { getOptionalSession } from "@/lib/auth/dal";
import { Mountain, ArrowRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Prijava",
  description: "Skrbniški dostop za urejanje pohodov.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getOptionalSession();
  if (session?.userId) redirect("/admin/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pine text-white">
            <Mountain className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-serif text-2xl font-semibold text-pine-dark">
            Skrbniška prijava
          </h1>
          <p className="mt-1.5 text-sm text-muted">PD Goričko – Tromeja</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-7 shadow-sm">
          <LoginForm />
        </div>

        {process.env.NODE_ENV !== "production" && (
          <p className="mt-4 text-center text-xs text-muted">
            Privzeto (razvoj): <span className="font-medium">admin</span> /{" "}
            <span className="font-medium">pohod2026</span>
          </p>
        )}

        <p className="mt-6 text-center text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-muted transition-colors duration-200 hover:text-pine-dark"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Nazaj na spletno stran
          </Link>
        </p>
      </div>
    </div>
  );
}
