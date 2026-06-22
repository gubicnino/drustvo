"use client";

import { useRef, useState } from "react";
import { X, ArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

export function ImageUploader({ initial = [] }: { initial?: string[] }) {
  const [images, setImages] = useState<string[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.path) {
          setImages((prev) => [...prev, data.path]);
        } else {
          setError(data.error ?? "Nalaganje ni uspelo.");
        }
      } catch {
        setError("Napaka pri povezavi med nalaganjem.");
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(path: string) {
    setImages((prev) => prev.filter((p) => p !== path));
  }

  function makeFeatured(path: string) {
    setImages((prev) => [path, ...prev.filter((p) => p !== path)]);
  }

  const featured = images[0] ?? "";

  return (
    <div>
      {/* Hidden inputs consumed by the server action */}
      <input type="hidden" name="image" value={featured} />
      {images.map((p) => (
        <input key={p} type="hidden" name="images" value={p} />
      ))}

      <div className="rounded-xl border border-dashed border-border bg-cream/60 p-4">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 py-4 text-center">
          <span className="text-sm font-medium text-pine-dark">
            {uploading ? "Nalaganje…" : "Klikni za nalaganje slik"}
          </span>
          <span className="text-xs text-muted">JPG, PNG ali WEBP, do 4 MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
            className="sr-only"
          />
        </label>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((p, i) => (
            <li
              key={p}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-xl border bg-white",
                i === 0 ? "border-pine ring-2 ring-pine/30" : "border-border",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-pine px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Naslovna
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-pine-dark/70 p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeFeatured(p)}
                    className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium text-white hover:bg-white/30 cursor-pointer"
                  >
                    Naslovna
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(p)}
                  aria-label="Odstrani sliko"
                  className="ml-auto rounded bg-white/20 p-1 text-white hover:bg-white/30 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {images.length === 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <ArrowRight className="h-3.5 w-3.5" />
          Brez slik bo prikazana privlačna nadomestna grafika.
        </p>
      )}
    </div>
  );
}
