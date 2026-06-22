"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { ButtonEl } from "@/components/ui/Button";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState | undefined, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink">
          Uporabniško ime
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pine"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          Geslo
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pine"
        />
      </div>

      <ButtonEl type="submit" size="lg" variant="primary" disabled={pending} className="w-full">
        {pending ? "Prijavljanje…" : "Prijava"}
      </ButtonEl>
    </form>
  );
}
