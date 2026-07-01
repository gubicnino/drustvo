import { Link } from "react-router-dom";
import { useSociety } from "../lib/society";
import { Icon } from "./Icon";

const NAV = [
  { to: "/", label: "Domov" },
  { to: "/pohodi", label: "Pohodi" },
  { to: "/galerija", label: "Galerija" },
  { to: "/o-drustvu", label: "O društvu" },
  { to: "/kontakt", label: "Kontakt" },
];

export function Footer() {
  const s = useSociety();
  const phoneTel = (s?.phone ?? "").replace(/\s+/g, "");

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo">
            <img src="/uploads/logo.png" alt="" />
            <span>
              <span className="logo-title">PD Goričko – Tromeja</span>
              <span className="logo-sub">Planinsko društvo</span>
            </span>
          </Link>
          <p className="muted mt-4" style={{ maxWidth: "18rem", fontSize: ".9rem" }}>
            {s?.tagline}
          </p>
          {s?.social.facebook && (
            <div className="mt-4">
              <a
                href={s.social.facebook}
                className="social"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Icon name="facebook" />
              </a>
            </div>
          )}
        </div>

        <nav aria-label="Noga – povezave">
          <h2>Povezave</h2>
          <ul className="muted-list">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2>Kontakt</h2>
          <ul className="muted-list">
            <li>{s?.address}</li>
            <li>
              <a href={`mailto:${s?.email ?? ""}`}>{s?.email}</a>
            </li>
            <li>
              <a href={`tel:${phoneTel}`}>{s?.phone}</a>
            </li>
          </ul>
        </div>

        <div>
          <h2>Društvo</h2>
          <p className="muted mt-4" style={{ fontSize: ".9rem" }}>
            Ustanovljeno leta {s?.founded}. {s?.memberCount} članov, {s?.hikesPerYear} pohodov na
            leto.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container row">
          <p>
            © {new Date().getFullYear()} {s?.name}. Vse pravice pridržane.
          </p>
          <p>
            <Link to="/admin">Skrbniški dostop</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
