import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "./Icon";

const NAV = [
  { to: "/", label: "Domov" },
  { to: "/pohodi", label: "Pohodi" },
  { to: "/galerija", label: "Galerija" },
  { to: "/o-drustvu", label: "O društvu" },
  { to: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Zapri meni ob menjavi strani.
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="site-header">
      <div className="container bar">
        <Link to="/" className="logo" aria-label="PD Goričko – Tromeja — domov">
          <img src="/uploads/logo.png" alt="" />
          <span>
            <span className="logo-title">PD Goričko – Tromeja</span>
            <span className="logo-sub">Planinsko društvo</span>
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Glavna navigacija">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/"} className="nav-link">
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/kontakt" className="btn btn-primary header-cta">
          Pridruži se nam
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-mobile"
          aria-label={open ? "Zapri meni" : "Odpri meni"}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "x" : "menu"} />
        </button>
      </div>

      <div className={`nav-mobile${open ? " open" : ""}`} id="nav-mobile">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === "/"}>
            {n.label}
          </NavLink>
        ))}
        <Link to="/kontakt" className="btn btn-primary btn-block">
          Pridruži se nam
        </Link>
      </div>
    </header>
  );
}
