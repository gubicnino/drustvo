import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";
import { formatDateShort, isUpcoming } from "../lib/format";
import { DifficultyBadge } from "../components/DifficultyBadge";
import { Icon } from "../components/Icon";
import { Loading } from "../components/Loading";

export function Dashboard() {
  const hikes = useFetch(() => api.adminHikes(), []);
  const gallery = useFetch(() => api.galleryFiles(), []);

  if (hikes.loading) return <Loading />;
  const list = hikes.data ?? [];
  const stats = [
    { n: list.length, l: "Vseh pohodov" },
    { n: list.filter((h) => h.published).length, l: "Objavljenih" },
    { n: list.filter((h) => h.published && isUpcoming(h)).length, l: "Prihajajočih" },
    { n: gallery.data?.length ?? 0, l: "Slik v galeriji" },
  ];
  const recent = list.slice(0, 5);

  return (
    <>
      <div className="flex-between mb-6">
        <p className="muted">Pozdravljen v skrbniškem vmesniku. Tu urejaš pohode, galerijo in podatke društva.</p>
        <Link to="/admin/pohodi/nov" className="btn btn-primary"><Icon name="plus" /> Nov pohod</Link>
      </div>

      <div className="stat-grid">
        {stats.map((c) => (
          <div className="stat-card" key={c.l}>
            <div className="n">{c.n}</div>
            <div className="l">{c.l}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-8" style={{ fontSize: "1.25rem" }}>Zadnji pohodi</h2>
      <div className="table-wrap mt-4">
        <table className="table">
          <thead>
            <tr><th>Naslov</th><th>Datum</th><th>Težavnost</th><th>Stanje</th><th></th></tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr><td colSpan={5} className="muted">Še ni pohodov. <Link to="/admin/pohodi/nov" className="linklike">Ustvari prvega.</Link></td></tr>
            )}
            {recent.map((h) => (
              <tr key={h.id}>
                <td><strong>{h.title}</strong></td>
                <td>{formatDateShort(h.date)}</td>
                <td><DifficultyBadge difficulty={h.difficulty} /></td>
                <td>{h.published ? "Objavljen" : <span className="muted">Osnutek</span>}</td>
                <td>
                  <div className="actions">
                    <Link className="btn btn-sm btn-outline" to={`/admin/pohodi/uredi/${h.id}`}><Icon name="pencil" /> Uredi</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
