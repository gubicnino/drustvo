import { useState } from "react";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useTitle } from "../lib/useTitle";
import { HikeImage } from "../components/Placeholder";
import { Loading } from "../components/Loading";
import { Lightbox } from "../components/Lightbox";

export function Galerija() {
  useTitle("Galerija", "Fotografski utrinki s pohodov PD Goričko – Tromeja.");
  const { data, loading } = useFetch(() => api.getGallery(), []);
  const [lb, setLb] = useState<number | null>(null);
  const items = data ?? [];

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Galerija</span>
            <h2>Utrinki z naših poti</h2>
            <p>Zbirka fotografij z naših pohodov in druženj. Kliknite sliko za večji prikaz, med njimi se premikate s puščicami.</p>
          </div>
        </div>
      </header>

      <div className="container section" style={{ paddingBlock: "3rem" }}>
        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <p className="empty">Galerija je trenutno prazna.</p>
        ) : (
          <div className="gallery-grid">
            {items.map((g, i) => (
              <button key={`${g.slug}-${g.i}`} type="button" onClick={() => setLb(i)} aria-label={`Povečaj: ${g.title}`}>
                <HikeImage src={g.src} alt={g.title} seed={`${g.slug}-${g.i}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {lb !== null && (
        <Lightbox
          items={items.map((g) => ({ src: g.src, caption: `${g.title}${g.caption ? " — " + g.caption : ""}` }))}
          index={lb}
          onClose={() => setLb(null)}
          onChange={setLb}
        />
      )}
    </>
  );
}
