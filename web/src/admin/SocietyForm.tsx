import { useEffect, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { Icon } from "../components/Icon";
import { Loading } from "../components/Loading";
import { useToast } from "../components/Toast";
import type { Society } from "../types";

export function SocietyForm() {
  const { toast } = useToast();
  const [s, setS] = useState<Society | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSociety().then(setS).catch((e) => toast(e.message, "error"));
  }, [toast]);

  if (!s) return <Loading />;

  const set = (patch: Partial<Society>) => setS((cur) => (cur ? { ...cur, ...patch } : cur));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateSociety(s);
      setS(updated);
      toast("Podatki društva so shranjeni.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Napaka", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: "48rem" }}>
      <div className="panel" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.15rem" }}>Osnovno</h2>
        <div className="field mt-4">
          <label className="label" htmlFor="name">Ime društva</label>
          <input className="input" id="name" value={s.name} onChange={(e) => set({ name: e.target.value })} required />
        </div>
        <div className="form-row cols-2">
          <div className="field">
            <label className="label" htmlFor="shortName">Kratko ime</label>
            <input className="input" id="shortName" value={s.shortName} onChange={(e) => set({ shortName: e.target.value })} />
          </div>
          <div className="field">
            <label className="label" htmlFor="tagline">Slogan</label>
            <input className="input" id="tagline" value={s.tagline} onChange={(e) => set({ tagline: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="about">O društvu</label>
          <textarea className="textarea" id="about" rows={4} value={s.about} onChange={(e) => set({ about: e.target.value })} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label className="label" htmlFor="mission">Poslanstvo</label>
          <textarea className="textarea" id="mission" rows={3} value={s.mission} onChange={(e) => set({ mission: e.target.value })} />
        </div>
      </div>

      <div className="panel mt-6" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.15rem" }}>Številke</h2>
        <div className="form-row cols-3 mt-4">
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label" htmlFor="founded">Leto ustanovitve</label>
            <input className="input" id="founded" value={s.founded} onChange={(e) => set({ founded: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label" htmlFor="memberCount">Število članov</label>
            <input className="input" id="memberCount" value={s.memberCount} onChange={(e) => set({ memberCount: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label" htmlFor="hikesPerYear">Pohodov na leto</label>
            <input className="input" id="hikesPerYear" value={s.hikesPerYear} onChange={(e) => set({ hikesPerYear: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="panel mt-6" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.15rem" }}>Kontakt</h2>
        <div className="form-row cols-2 mt-4">
          <div className="field">
            <label className="label" htmlFor="email">E-pošta</label>
            <input className="input" id="email" type="email" value={s.email} onChange={(e) => set({ email: e.target.value })} />
          </div>
          <div className="field">
            <label className="label" htmlFor="phone">Telefon</label>
            <input className="input" id="phone" value={s.phone} onChange={(e) => set({ phone: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label className="label" htmlFor="address">Naslov</label>
          <input className="input" id="address" value={s.address} onChange={(e) => set({ address: e.target.value })} />
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label className="label" htmlFor="facebook">Facebook povezava</label>
          <input className="input" id="facebook" value={s.social.facebook} onChange={(e) => set({ social: { facebook: e.target.value } })} />
        </div>
      </div>

      <div className="mt-6" style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          <Icon name="check" /> {saving ? "Shranjevanje…" : "Shrani spremembe"}
        </button>
      </div>
    </form>
  );
}
