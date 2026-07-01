import { useCallback, useEffect } from "react";
import { mediaUrl } from "../lib/api";

export interface LightboxItem {
  src: string;
  caption: string;
}

export function Lightbox({
  items,
  index,
  onClose,
  onChange,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const move = useCallback(
    (delta: number) => onChange((index + delta + items.length) % items.length),
    [index, items.length, onChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key === "ArrowRight") move(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [move, onClose]);

  const cur = items[index];
  if (!cur) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Prikaz slike"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button className="lb-btn lb-close" aria-label="Zapri" onClick={onClose}>
        ×
      </button>
      {items.length > 1 && (
        <button className="lb-btn lb-prev" aria-label="Prejšnja" onClick={() => move(-1)}>
          ‹
        </button>
      )}
      <img src={mediaUrl(cur.src)} alt={cur.caption} />
      {items.length > 1 && (
        <button className="lb-btn lb-next" aria-label="Naslednja" onClick={() => move(1)}>
          ›
        </button>
      )}
      {cur.caption && <p className="lb-cap">{cur.caption}</p>}
    </div>
  );
}
