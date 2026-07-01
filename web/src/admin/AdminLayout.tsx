import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Loading } from "../components/Loading";
import { Icon } from "../components/Icon";

const NAV = [
  { to: "/admin/dashboard", label: "Nadzorna plošča", icon: "dashboard" },
  { to: "/admin/pohodi", label: "Pohodi", icon: "mountain" },
  { to: "/admin/galerija", label: "Galerija", icon: "image" },
  { to: "/admin/drustvo", label: "Podatki društva", icon: "building" },
];

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Nadzorna plošča",
  "/admin/pohodi": "Pohodi",
  "/admin/pohodi/nov": "Nov pohod",
  "/admin/galerija": "Galerija",
  "/admin/drustvo": "Podatki društva",
};

export function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/admin" replace />;

  let title = TITLES[location.pathname] ?? "Skrbništvo";
  if (location.pathname.startsWith("/admin/pohodi/uredi")) title = "Uredi pohod";

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <div className="brand">
          <div className="t">PD Goričko – Tromeja</div>
          <div className="s">Skrbništvo</div>
        </div>
        <nav className="admin-nav" aria-label="Skrbniška navigacija">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === "/admin/pohodi" ? false : undefined}>
              <Icon name={n.icon} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="foot">
          <div className="who">Prijavljen: <strong>{user.username}</strong></div>
          <button className="btn btn-white btn-block btn-sm" onClick={logout}>
            <Icon name="log-out" /> Odjava
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>{title}</h1>
          <a href="/" className="btn btn-outline btn-sm" target="_blank" rel="noopener">
            <Icon name="external" /> Odpri spletno stran
          </a>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
