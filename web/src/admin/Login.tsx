import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useTitle } from "../lib/useTitle";
import { Icon } from "../components/Icon";

export function Login() {
  useTitle("Prijava");
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!loading && user) return <Navigate to="/admin/dashboard" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await login(username.trim(), password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prijava ni uspela.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="admin-auth">
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="text-center mb-6">
            <span className="icon-badge center"><Icon name="mountain" /></span>
          </div>
          <h1>Skrbniška prijava</h1>
          <p className="sub">PD Goričko – Tromeja</p>

          {error && <p className="flash flash-error mb-6" role="alert">{error}</p>}

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label className="label" htmlFor="username">Uporabniško ime</label>
              <input className="input" id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required autoFocus />
            </div>
            <div className="field">
              <label className="label" htmlFor="password">Geslo</label>
              <input className="input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={pending}>
              {pending ? "Prijavljanje…" : "Prijava"}
            </button>
          </form>

          <p className="text-center mt-6">
            <Link to="/" className="muted" style={{ fontSize: ".85rem" }}>← Nazaj na spletno stran</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
