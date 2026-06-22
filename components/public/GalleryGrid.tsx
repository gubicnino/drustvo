"use client";

import { useCallback, useEffect, useState } from "react";
import { HikeImage } from "@/components/ui/Placeholder";
import { X, ArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  seed: string;
  src?: string;
  title: string;
  caption?: string;
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, next, prev]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={`${item.seed}-${i}`}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "group relative block aspect-square w-full overflow-hidden rounded-xl border border-border bg-white",
                "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine",
              )}
              aria-label={`Odpri sliko: ${item.title}`}
            >
              <HikeImage src={item.src} alt={item.title} seed={item.seed} />
              <span className="pointer-events-none absolute inset-0 bg-pine-dark/0 transition-colors duration-200 group-hover:bg-pine-dark/15" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-pine-dark/70 to-transparent p-2.5 text-left text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {item.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[active].title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-pine-dark/90 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Zapri"
            autoFocus
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Prejšnja slika"
            className="absolute left-3 flex h-11 w-11 rotate-180 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white cursor-pointer sm:left-6"
          >
            <ArrowRight className="h-6 w-6" />
          </button>

          <figure
            className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-16/10 bg-pine-dark">
              <HikeImage
                src={items[active].src}
                alt={items[active].title}
                seed={items[active].seed}
              />
            </div>
            <figcaption className="bg-white px-5 py-3 text-sm text-ink">
              <span className="font-semibold text-pine-dark">{items[active].title}</span>
              {items[active].caption && (
                <span className="text-muted"> — {items[active].caption}</span>
              )}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Naslednja slika"
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white cursor-pointer sm:right-6"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
