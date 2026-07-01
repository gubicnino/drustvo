import { useEffect, useState } from "react";
import { api, mediaUrl } from "../lib/api";
import { Icon } from "../components/Icon";
import { Loading } from "../components/Loading";
import { useToast } from "../components/Toast";

interface GFile {
  src: string;
  name: string;
}

export function GalleryManager() {
  const { toast } = useToast();
  const [files, setFiles] = useState<GFile[] | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = () => api.galleryFiles().then(setFiles).catch((e) => toast(e.message, "error"));
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onUpload = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setUploading(true);
    try {
      const { paths, errors } = await api.upload(list);
      if (paths.length) toast(`${paths.length} slik(a) naloženih.`);
      errors?.forEach((m) => toast(m, "error"));
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Nalaganje ni uspelo.", "error");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (f: GFile) => {
    if (!window.confirm("Izbrišem to sliko? Če je v uporabi na pohodu, bo tam izginila.")) return;
    try {
      await api.deleteGalleryFile(f.name);
      setFiles((prev) => prev?.filter((x) => x.name !== f.name) ?? null);
      toast("Slika je izbrisana.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Napaka", "error");
    }
  };

  if (!files) return <Loading />;

  return (
    <>
      <div className="panel mb-6" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.15rem" }}>Naloži slike</h2>
        <div className="field mt-4" style={{ marginBottom: 0 }}>
          <input className="input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple disabled={uploading} onChange={(e) => onUpload(e.target.files)} />
          <p className="muted mt-2" style={{ fontSize: ".82rem" }}>{uploading ? "Nalaganje…" : "JPG, PNG, WEBP, GIF do 5 MB."}</p>
        </div>
      </div>

      <p className="muted mb-6">{files.length} slik v mapi /uploads.</p>

      {files.length === 0 ? (
        <p className="empty">V galeriji še ni slik.</p>
      ) : (
        <div className="image-manager">
          {files.map((f) => (
            <div key={f.name} className="image-tile">
              <img src={mediaUrl(f.src)} alt={f.name} loading="lazy" />
              <div className="tile-actions">
                <div className="row">
                  <button type="button" className="tile-btn danger" onClick={() => remove(f)} aria-label="Izbriši sliko">
                    <Icon name="trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
