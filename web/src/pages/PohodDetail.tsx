import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useTitle } from "../lib/useTitle";
import { formatDate, isUpcoming } from "../lib/format";
import { HikeImage } from "../components/Placeholder";
import { DifficultyBadge } from "../components/DifficultyBadge";
import { Icon } from "../components/Icon";
import { Loading } from "../components/Loading";
import { Lightbox } from "../components/Lightbox";
import { NotFound } from "./NotFound";
import { HikeCard } from "../components/HikeCard";

export function PohodDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: hike, loading, error } = useFetch(() => api.getHike(slug!), [slug]);
  const { data: upcoming } = useFetch(() => api.getHikes({ status: "upcoming" }), [slug]);
  const [lb, setLb] = useState<number | null>(null);
  useTitle(hike?.title, hike ? hike.description.slice(0, 160) : undefined);

  if (loading) return <Loading />;
  if (error || !hike) return <NotFound />;

  const meta = [
    { icon: "calendar", k: "Datum", v: formatDate(hike.date) },
    { icon: "map-pin", k: "Lokacija", v: hike.location },
    { icon: "ruler", k: "Razdalja", v: hike.distance || "–" },
    { icon: "trending-up", k: "Vzpon", v: hike.elevation || "–" },
  ];
  const related = (upcoming ?? []).filter((h) => h.slug !== hike.slug).slice(0, 3);

  return (
    <article>
      <div className="hike-hero">
        <HikeImage src={hike.image} alt={`Pohod: ${hike.title}`} seed={hike.slug} eager />
        <div className="overlay">
          <div className="container">
            <div className="tags">
              <DifficultyBadge difficulty={hike.difficulty} />
              <span className="chip">{isUpcoming(hike) ? "Prihajajoči pohod" : "Pretekli pohod"}</span>
            </div>
            <h1>{hike.title}</h1>
            <div className="meta">
              <span><Icon name="calendar" />{formatDate(hike.date)}</span>
              <span><Icon name="map-pin" />{hike.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container section" style={{ paddingBlock: "3rem" }}>
        <nav className="breadcrumb" aria-label="Drobtinice">
          <Link to="/pohodi">Pohodi</Link> <span aria-hidden="true">/</span>{" "}
          <span style={{ color: "var(--ink)" }}>{hike.title}</span>
        </nav>

        <div className="detail-grid">
          <div>
            <div className="meta-grid">
              {meta.map((m) => (
                <div className="meta-tile" key={m.k}>
                  <Icon name={m.icon} />
                  <div className="k">{m.k}</div>
                  <div className="v">{m.v}</div>
                </div>
              ))}
            </div>

            <div className="prose mt-8">
              {hike.description.split(/\n+/).map((p, i) =>
                p.trim() ? <p key={i}>{p.trim()}</p> : null,
              )}
            </div>

            {hike.images.length > 0 && (
              <div className="detail-gallery">
                {hike.images.map((src, i) => (
                  <button key={i} type="button" onClick={() => setLb(i)} aria-label={`Povečaj sliko ${i + 1}`}>
                    <HikeImage src={src} alt={`${hike.title} – slika ${i + 1}`} seed={`${hike.slug}-${i}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside>
            <div className="panel sidebar-card" style={{ padding: "1.5rem" }}>
              <h2 style={{ fontSize: "1.15rem" }}>Se nam pridružiš?</h2>
              <p className="muted mt-2" style={{ fontSize: ".9rem" }}>
                Za prijavo na pohod ali dodatne informacije nas kontaktiraj. Veseli bomo tvojega obiska v gorah.
              </p>
              <Link to="/kontakt" className="btn btn-primary btn-block mt-4">
                Kontaktiraj nas <Icon name="arrow-right" />
              </Link>
              <div className="media-frame video mt-6">
                <HikeImage src="/uploads/pridruzi-se.jpg" alt="Pridruži se nam na pohodu" seed={`${hike.slug}-mini`} />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section section--sand" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="container">
            <h2 style={{ fontSize: "1.5rem" }}>Še več pohodov</h2>
            <div className="grid grid-3 mt-6">
              {related.map((h) => (
                <HikeCard key={h.id} hike={h} />
              ))}
            </div>
          </div>
        </section>
      )}

      {lb !== null && (
        <Lightbox
          items={hike.images.map((src) => ({ src, caption: hike.title }))}
          index={lb}
          onClose={() => setLb(null)}
          onChange={setLb}
        />
      )}
    </article>
  );
}
