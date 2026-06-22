"use client";

import { useActionState } from "react";
import { saveHikeAction, type HikeFormState } from "@/app/admin/(dashboard)/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ButtonEl, Button } from "@/components/ui/Button";
import type { Hike } from "@/types";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-ink placeholder:text-muted/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pine";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-sm text-red-600">{msg}</p>;
}

export function HikeForm({ hike }: { hike?: Hike }) {
  const [state, action, pending] = useActionState<HikeFormState | undefined, FormData>(
    saveHikeAction,
    undefined,
  );
  const fe = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-6">
      {hike && <input type="hidden" name="id" value={hike.id} />}

      {state?.error && (
        <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-pine-dark">Osnovni podatki</h2>
        <div className="mt-5 space-y-5">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink">
              Naslov pohoda
            </label>
            <input
              id="title"
              name="title"
              defaultValue={hike?.title}
              required
              className={cn(fieldClass, fe.title ? "border-red-400" : "border-border")}
              placeholder="Pohod na Boč"
            />
            <FieldError msg={fe.title} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-ink">
                Datum
              </label>
              <input
                id="date"
                name="date"
                type="date"
                defaultValue={hike?.date}
                required
                className={cn(fieldClass, fe.date ? "border-red-400" : "border-border")}
              />
              <FieldError msg={fe.date} />
            </div>
            <div>
              <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-ink">
                Lokacija
              </label>
              <input
                id="location"
                name="location"
                defaultValue={hike?.location}
                required
                className={cn(fieldClass, fe.location ? "border-red-400" : "border-border")}
                placeholder="Boč, Štajerska"
              />
              <FieldError msg={fe.location} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="difficulty" className="mb-1.5 block text-sm font-medium text-ink">
                Težavnost
              </label>
              <select
                id="difficulty"
                name="difficulty"
                defaultValue={hike?.difficulty ?? "easy"}
                className={cn(fieldClass, "border-border")}
              >
                <option value="easy">Lahko</option>
                <option value="medium">Srednje</option>
                <option value="hard">Zahtevno</option>
              </select>
            </div>
            <div>
              <label htmlFor="distance" className="mb-1.5 block text-sm font-medium text-ink">
                Razdalja
              </label>
              <input
                id="distance"
                name="distance"
                defaultValue={hike?.distance}
                className={cn(fieldClass, "border-border")}
                placeholder="12 km"
              />
            </div>
            <div>
              <label htmlFor="elevation" className="mb-1.5 block text-sm font-medium text-ink">
                Vzpon
              </label>
              <input
                id="elevation"
                name="elevation"
                defaultValue={hike?.elevation}
                className={cn(fieldClass, "border-border")}
                placeholder="650 m"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
              Opis
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              defaultValue={hike?.description}
              required
              className={cn(fieldClass, "resize-y", fe.description ? "border-red-400" : "border-border")}
              placeholder="Opis pohoda, zbirno mesto, oprema…"
            />
            <FieldError msg={fe.description} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-pine-dark">Slike</h2>
        <p className="mt-1 text-sm text-muted">Prva slika je naslovna. Lahko pustiš prazno.</p>
        <div className="mt-4">
          <ImageUploader initial={hike?.images ?? []} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-white p-6">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="published"
            defaultChecked={hike?.published ?? false}
            className="h-5 w-5 rounded border-border text-pine focus-visible:outline-2 focus-visible:outline-pine"
          />
          <span className="text-sm font-medium text-ink">Objavi pohod (viden na spletni strani)</span>
        </label>

        <div className="flex gap-3">
          <Button href="/admin/pohodi" variant="outline">
            Prekliči
          </Button>
          <ButtonEl type="submit" variant="primary" disabled={pending}>
            {pending ? "Shranjevanje…" : hike ? "Shrani spremembe" : "Ustvari pohod"}
          </ButtonEl>
        </div>
      </div>
    </form>
  );
}
