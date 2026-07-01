import { Link } from "react-router-dom";
import { useSociety } from "../lib/society";
import { useTitle } from "../lib/useTitle";
import { HikeImage } from "../components/Placeholder";
import { Icon } from "../components/Icon";

const VALUES = [
  { icon: "compass", title: "Varnost in znanje", text: "Naši usposobljeni vodniki skrbijo, da so pohodi varni, dobro pripravljeni in prilagojeni skupini." },
  { icon: "heart", title: "Skupnost", text: "Smo medgeneracijsko društvo, kjer se prepletajo izkušnje starejših in zagon mladih." },
  { icon: "leaf", title: "Odgovornost do narave", text: "Spoštujemo gorsko okolje, hodimo po označenih poteh in za seboj ne puščamo sledi." },
];

export function ODrustvu() {
  useTitle("O društvu", "Spoznaj PD Goričko – Tromeja: našo zgodbo, poslanstvo in vrednote.");
  const s = useSociety();
  const stats = [
    { icon: "calendar", value: s?.founded, label: "Leto ustanovitve" },
    { icon: "users", value: s?.memberCount, label: "Aktivnih članov" },
    { icon: "mountain", value: s?.hikesPerYear, label: "Pohodov na leto" },
  ];

  return (
    <>
      <header className="page-head">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">O društvu</span>
            <h2>{s?.name}</h2>
            <p>{s?.tagline}</p>
          </div>
        </div>
      </header>

      <div className="container section" style={{ paddingBlock: "4rem" }}>
        <div className="split">
          <div className="media-frame">
            <HikeImage src="/uploads/thumbnail.jpg" alt="Člani PD Goričko – Tromeja na skupnem pohodu" seed="o-drustvu-hero" />
          </div>
          <div>
            <h2 style={{ fontSize: "clamp(1.5rem,1.2rem + 1vw,1.875rem)" }}>Naša zgodba</h2>
            <p className="mt-4" style={{ fontSize: "1.1rem", color: "rgba(27,42,34,.85)" }}>{s?.about}</p>
            <p className="muted mt-4">{s?.mission}</p>
          </div>
        </div>

        <dl className="grid grid-3 mt-8" style={{ marginTop: "4rem" }}>
          {stats.map((st) => (
            <div className="feature center" key={st.label}>
              <span className="icon-badge soft center"><Icon name={st.icon} /></span>
              <dd className="mt-4" style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 600, color: "var(--pine-dark)" }}>{st.value}</dd>
              <dt className="muted" style={{ fontSize: ".9rem" }}>{st.label}</dt>
            </div>
          ))}
        </dl>

        <div style={{ marginTop: "5rem" }}>
          <div className="section-heading center">
            <span className="eyebrow">Naše vrednote</span>
            <h2>V kaj verjamemo</h2>
          </div>
          <div className="grid grid-3 mt-8">
            {VALUES.map((v) => (
              <div className="feature" key={v.title}>
                <span className="icon-badge"><Icon name={v.icon} /></span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ marginTop: "5rem", background: "var(--pine-50)", borderColor: "var(--pine-100)", padding: "2rem" }}>
          <div className="split">
            <div>
              <h2 style={{ fontSize: "clamp(1.5rem,1.2rem + 1vw,1.875rem)" }}>Postani član</h2>
              <p className="mt-2" style={{ color: "rgba(27,42,34,.8)" }}>
                Članstvo prinaša popuste na vodene pohode, planinsko zavarovanje in dobro družbo na vsakem koraku.
              </p>
              <Link to="/kontakt" className="btn btn-primary mt-6">
                Kontaktiraj nas <Icon name="arrow-right" />
              </Link>
            </div>
            <div className="media-frame video">
              <HikeImage src="/uploads/pridruzi-se.jpg" alt="Pridruži se Planinskemu društvu Goričko – Tromeja" seed="clanstvo" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
