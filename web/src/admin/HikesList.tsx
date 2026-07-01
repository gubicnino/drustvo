import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { formatDateShort } from "../lib/format";
import { DifficultyBadge } from "../components/DifficultyBadge";
import { Icon } from "../components/Icon";
import { Loading } from "../components/Loading";
import { useToast } from "../components/Toast";
import type { Hike } from "../types";

export function HikesList() {
  const { toast } = useToast();
  const [hikes, setHikes] = useState<Hike[] | null>(null);

  useEffect(() => {
    api.adminHikes().then(setHikes).catch((e) => toast(e.message, "error"));
  }, [toast]);

  const togglePublish = async (h: Hike) => {
    const next = !h.published;
    setHikes((list) => list?.map((x) => (x.id === h.id ? { ...x, published: next } : x)) ?? null);
    try {
      await api.publishHike(h.id, next);
      toast(next ? "Pohod je objavljen." : "Pohod je skrit.");
    } catch (e) {
      setHikes((list) => list?.map((x) => (x.id === h.id ? { ...x, published: !next } : x)) ?? null);
      toast(e instanceof Error ? e.message : "Napaka", "error");
    }
  };

  const remove = async (h: Hike) => {
    if (!window.confirm(`Res želiš izbrisati pohod "${h.title}"? Tega ni mogoče razveljaviti.`)) return;
    try {
      await api.deleteHike(h.id);
      setHikes((list) => list?.filter((x) => x.id !== h.id) ?? null);
      toast("Pohod je izbrisan.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Napaka", "error");
    }
  };

  if (!hikes) return <Loading />;

  return (
    <>
      <div className="flex-between mb-6">
        <p className="muted">{hikes.length} pohodov skupaj. Stikalo objavi/skrije pohod takoj.</p>
        <Link to="/admin/pohodi/nov" className="btn btn-primary"><Icon name="plus" /> Nov pohod</Link>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Naslov</th><th>Datum</th><th>Težavnost</th><th>Objavljen</th><th>Dejanja</th></tr>
          </thead>
          <tbody>
            {hikes.length === 0 && (
              <tr><td colSpan={5} className="muted">Še ni pohodov. <Link to="/admin/pohodi/nov" className="linklike">Ustvari prvega.</Link></td></tr>
            )}
            {hikes.map((h) => (
              <tr key={h.id}>
                <td><strong>{h.title}</strong><br /><span className="muted" style={{ fontSize: ".8rem" }}>{h.location}</span></td>
                <td>{formatDateShort(h.date)}</td>
                <td><DifficultyBadge difficulty={h.difficulty} /></td>
                <td>
                  <label className="switch" title={h.published ? "Skrij" : "Objavi"}>
                    <input type="checkbox" checked={h.published} onChange={() => togglePublish(h)} aria-label="Objavljen" />
                    <span className="track" />
                  </label>
                </td>
                <td>
                  <div className="actions">
                    <Link className="btn btn-sm btn-outline" to={`/admin/pohodi/uredi/${h.id}`}><Icon name="pencil" /> Uredi</Link>
                    <a className="btn btn-sm btn-ghost btn-icon" href={`/pohodi/${h.slug}`} target="_blank" rel="noopener" aria-label="Odpri na strani"><Icon name="external" /></a>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(h)}><Icon name="trash" /> Izbriši</button>
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
