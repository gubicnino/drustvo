import { useSociety } from "../lib/society";
import { useTitle } from "../lib/useTitle";
import { Icon } from "../components/Icon";
import { motion, container, item } from "../components/motion";

export function Kontakt() {
  useTitle("Kontakt", "Kontaktiraj PD Goričko – Tromeja. Piši nam, pokliči ali se nam pridruži na pohodu.");
  const s = useSociety();
  const phoneTel = (s?.phone ?? "").replace(/\s+/g, "");
  const mapQuery = encodeURIComponent(s?.address ?? "");

  const details = [
    { icon: "mail", label: "E-pošta", value: s?.email, href: `mailto:${s?.email ?? ""}` },
    { icon: "phone", label: "Telefon", value: s?.phone, href: `tel:${phoneTel}` },
    { icon: "map-pin", label: "Naslov", value: s?.address, href: undefined as string | undefined },
  ];

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Kontakt</span>
            <h2>Stopi v stik z nami</h2>
            <p>Imaš vprašanje o pohodu ali članstvu? Obišči nas, pokliči ali piši.</p>
          </div>
        </div>
      </header>

      <div className="container section" style={{ paddingBlock: "4rem" }}>
        <div className="detail-grid" style={{ marginTop: 0 }}>
          <div>
            <h2 style={{ fontSize: "1.5rem" }}>Kje nas najdete</h2>
            <p className="muted mt-2">{s?.address}</p>
            <div className="media-frame mt-6" style={{ aspectRatio: "16 / 10" }}>
              <iframe
                title={`Zemljevid – ${s?.name ?? ""}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: 0 }}
              />
            </div>
            <a
              className="card-more mt-4"
              style={{ display: "inline-flex" }}
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="map-pin" /> Odpri v Google Zemljevidih
            </a>
          </div>

          <aside>
            <div className="panel" style={{ padding: "1.75rem" }}>
              <h2 style={{ fontSize: "1.25rem" }}>Podatki društva</h2>
              <motion.ul
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                style={{ listStyle: "none", padding: 0, marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                {details.map((d) => (
                  <motion.li
                    key={d.label}
                    variants={item}
                    whileHover="hover"
                    style={{ display: "flex", gap: ".75rem", alignItems: "center" }}
                  >
                    <motion.span
                      className="ic"
                      variants={{ hover: { scale: 1.18, rotate: -8 } }}
                      transition={{ type: "spring", stiffness: 320, damping: 12 }}
                      style={{ flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "2.75rem", height: "2.75rem", borderRadius: ".8rem", background: "var(--pine-50)", color: "var(--pine)" }}
                    >
                      <Icon name={d.icon} />
                    </motion.span>
                    <div>
                      <p className="lbl" style={{ fontSize: ".72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", color: "var(--muted)" }}>
                        {d.label}
                      </p>
                      {d.href ? (
                        <a href={d.href} style={{ fontWeight: 600 }}>{d.value}</a>
                      ) : (
                        <p style={{ fontWeight: 600 }}>{d.value}</p>
                      )}
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
              {s?.social.facebook && (
                <div className="mt-6" style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
                  <p style={{ fontSize: ".9rem", fontWeight: 600 }}>Sledi nam</p>
                  <div className="mt-2">
                    <a className="social" href={s.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <Icon name="facebook" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
