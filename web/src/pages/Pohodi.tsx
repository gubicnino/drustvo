import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { useTitle } from "../lib/useTitle";
import { HikeCard } from "../components/HikeCard";
import { Loading } from "../components/Loading";

const DIFFS: Record<string, string> = { all: "Vsi", easy: "Lahko", medium: "Srednje", hard: "Zahtevno" };

export function Pohodi() {
  useTitle("Pohodi", "Prihajajoči in pretekli pohodi PD Goričko – Tromeja.");
  const [params, setParams] = useSearchParams();
  const difficulty = ["all", "easy", "medium", "hard"].includes(params.get("tezavnost") ?? "")
    ? (params.get("tezavnost") as string)
    : "all";
  const sort = params.get("razvrsti") === "oldest" ? "oldest" : "newest";

  const query = { difficulty: difficulty === "all" ? undefined : difficulty, sort };
  const upcoming = useFetch(() => api.getHikes({ status: "upcoming", ...query }), [difficulty, sort]);
  const past = useFetch(() => api.getHikes({ status: "past", ...query }), [difficulty, sort]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if ((key === "tezavnost" && value === "all") || (key === "razvrsti" && value === "newest")) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setParams(next);
  };

  const loading = upcoming.loading || past.loading;
  const up = upcoming.data ?? [];
  const pa = past.data ?? [];
  const total = up.length + pa.length;

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Pohodi</span>
            <h2>Naši pohodi in izleti</h2>
            <p>Od lahkih družinskih sprehodov do zahtevnih visokogorskih vzponov. Izberi pohod, ki ti ustreza, in se nam pridruži.</p>
          </div>
        </div>
      </header>

      <div className="container section" style={{ paddingBlock: "3rem" }}>
        <div className="filters">
          <div className="filter-group">
            <div className="filter-label">Težavnost</div>
            <div className="chips">
              {Object.entries(DIFFS).map(([key, label]) => (
                <button
                  key={key}
                  className={`chip-link${difficulty === key ? " active" : ""}`}
                  onClick={() => setParam("tezavnost", key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <div className="filter-label">Razvrsti</div>
            <div className="chips">
              <button className={`chip-link${sort === "newest" ? " active" : ""}`} onClick={() => setParam("razvrsti", "newest")}>
                Najnovejši
              </button>
              <button className={`chip-link${sort === "oldest" ? " active" : ""}`} onClick={() => setParam("razvrsti", "oldest")}>
                Najstarejši
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            {total === 0 && <p className="empty">Za izbrano težavnost ni pohodov. Poskusi z drugim filtrom.</p>}
            {up.length > 0 && (
              <section className="mt-8">
                <h2 style={{ fontSize: "1.5rem" }}>Prihajajoči pohodi</h2>
                <div className="grid grid-3 mt-6">
                  {up.map((h) => (
                    <HikeCard key={h.id} hike={h} />
                  ))}
                </div>
              </section>
            )}
            {pa.length > 0 && (
              <section style={{ marginTop: "4rem" }}>
                <h2 style={{ fontSize: "1.5rem" }}>Pretekli pohodi</h2>
                <div className="grid grid-3 mt-6">
                  {pa.map((h) => (
                    <HikeCard key={h.id} hike={h} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <p className="mt-8">
          <Link to="/" className="muted">
            ← Domov
          </Link>
        </p>
      </div>
    </>
  );
}
