import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, ApiError, mediaUrl } from "../lib/api";
import { Loading } from "../components/Loading";
import { useToast } from "../components/Toast";
import type { Difficulty } from "../types";

interface FormState {
  title: string;
  date: string;
  location: string;
  difficulty: Difficulty;
  distance: string;
  elevation: string;
  description: string;
  published: boolean;
}

const EMPTY: FormState = {
  title: "", date: "", location: "", difficulty: "easy",
  distance: "", elevation: "", description: "", published: false,
};

export function HikeForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .adminHike(id)
      .then((h) => {
        setForm({
          title: h.title, date: h.date, location: h.location, difficulty: h.difficulty,
          distance: h.distance, elevation: h.elevation, description: h.description, published: h.published,
        });
        setImages(h.images);
        setFeatured(h.image || h.images[0] || "");
      })
      .catch((e) => toast(e.message, "error"))
      .finally(() => setLoading(false));
  }, [id, toast]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const { paths, errors: errs } = await api.upload(files);
      if (paths.length) {
        setImages((prev) => {
          const next = [...prev, ...paths];
          if (!featured && next.length) setFeatured(next[0]);
          return next;
        });
        toast(`${paths.length} slik(a) naloženih.`);
      }
      errs?.forEach((m) => toast(m, "error"));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Nalaganje ni uspelo.", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (src: string) => {
    setImages((prev) => prev.filter((p) => p !== src));
    if (featured === src) setFeatured((cur) => (cur === src ? "" : cur));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    // Naslovna slika na začetek.
    const ordered = featured && images.includes(featured)
      ? [featured, ...images.filter((p) => p !== featured)]
      : images;
    try {
      const payload = { ...form, images: ordered };
      if (isEdit && id) {
        await api.updateHike(id, payload);
        toast("Pohod je posodobljen.");
      } else {
        await api.createHike(payload);
        toast("Pohod je ustvarjen.");
      }
      navigate("/admin/pohodi");
    } catch (err) {
      if (err instanceof ApiError && err.fields) {
        setErrors(err.fields);
        toast("Preveri vnesena polja.", "error");
      } else {
        toast(err instanceof Error ? err.message : "Napaka pri shranjevanju.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  const err = (k: string) => errors[k] && <p className="form-error">{errors[k]}</p>;
  const ec = (k: string) => (errors[k] ? " err" : "");

  return (
    <>
      <Link to="/admin/pohodi" className="muted" style={{ fontSize: ".9rem" }}>← Nazaj na seznam</Link>

      <form onSubmit={submit} className="mt-4" style={{ maxWidth: "48rem" }}>
        <div className="panel" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.15rem" }}>Osnovni podatki</h2>

          <div className="field mt-4">
            <label className="label" htmlFor="title">Naslov pohoda</label>
            <input className={`input${ec("title")}`} id="title" value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Pohod na Boč" />
            {err("title")}
          </div>

          <div className="form-row cols-2">
            <div className="field">
              <label className="label" htmlFor="date">Datum</label>
              <input className={`input${ec("date")}`} id="date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
              {err("date")}
            </div>
            <div className="field">
              <label className="label" htmlFor="location">Lokacija</label>
              <input className={`input${ec("location")}`} id="location" value={form.location} onChange={(e) => set("location", e.target.value)} required placeholder="Boč, Štajerska" />
              {err("location")}
            </div>
          </div>

          <div className="form-row cols-3">
            <div className="field">
              <label className="label" htmlFor="difficulty">Težavnost</label>
              <select className="select" id="difficulty" value={form.difficulty} onChange={(e) => set("difficulty", e.target.value as Difficulty)}>
                <option value="easy">Lahko</option>
                <option value="medium">Srednje</option>
                <option value="hard">Zahtevno</option>
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="distance">Razdalja</label>
              <input className="input" id="distance" value={form.distance} onChange={(e) => set("distance", e.target.value)} placeholder="12 km" />
            </div>
            <div className="field">
              <label className="label" htmlFor="elevation">Vzpon</label>
              <input className="input" id="elevation" value={form.elevation} onChange={(e) => set("elevation", e.target.value)} placeholder="650 m" />
            </div>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label className="label" htmlFor="description">Opis</label>
            <textarea className={`textarea${ec("description")}`} id="description" rows={6} value={form.description} onChange={(e) => set("description", e.target.value)} required placeholder="Opis pohoda, zbirno mesto, oprema…" />
            {err("description")}
          </div>
        </div>

        <div className="panel mt-6" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.15rem" }}>Slike</h2>
          <p className="muted mt-2" style={{ fontSize: ".9rem" }}>Klikni zvezdico za naslovno sliko, koš za odstranitev.</p>

          {images.length > 0 && (
            <div className="image-manager mt-4">
              {images.map((src) => (
                <div key={src} className={`image-tile${featured === src ? " is-featured" : ""}`}>
                  <img src={mediaUrl(src)} alt="" />
                  <div className="tile-actions">
                    <div className="row">
                      <button type="button" className="tile-btn danger" onClick={() => removeImage(src)} aria-label="Odstrani sliko">✕</button>
                    </div>
                    <div className="row" style={{ justifyContent: "flex-start" }}>
                      <button type="button" className={`tile-btn${featured === src ? " feat" : ""}`} onClick={() => setFeatured(src)}>
                        {featured === src ? "★ Naslovna" : "☆ Naslovna"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="field mt-4" style={{ marginBottom: 0 }}>
            <label className="label" htmlFor="images">Dodaj slike</label>
            <input className="input" id="images" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple disabled={uploading} onChange={(e) => onUpload(e.target.files)} />
            <p className="muted mt-2" style={{ fontSize: ".82rem" }}>
              {uploading ? "Nalaganje…" : "JPG, PNG, WEBP, GIF (do 5 MB). Lahko izbereš več naenkrat."}
            </p>
          </div>
        </div>

        <div className="panel mt-6 flex-between" style={{ padding: "1.5rem" }}>
          <label className="checkbox-row">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
            <span>Objavi pohod (viden na spletni strani)</span>
          </label>
          <div style={{ display: "flex", gap: ".75rem" }}>
            <Link to="/admin/pohodi" className="btn btn-outline">Prekliči</Link>
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {saving ? "Shranjevanje…" : isEdit ? "Shrani spremembe" : "Ustvari pohod"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
