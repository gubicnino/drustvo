import { useEffect } from "react";

const SUFFIX = "Planinsko društvo Goričko – Tromeja";

/** Nastavi <title> in meta description za trenutno stran (lahek SEO za SPA). */
export function useTitle(title?: string, description?: string): void {
  useEffect(() => {
    document.title = title ? `${title} | ${SUFFIX}` : SUFFIX;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
