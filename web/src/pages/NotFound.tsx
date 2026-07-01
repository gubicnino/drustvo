import { Link } from "react-router-dom";
import { useTitle } from "../lib/useTitle";
import { Icon } from "../components/Icon";

export function NotFound() {
  useTitle("Stran ni najdena");
  return (
    <div className="container" style={{ paddingBlock: "6rem", textAlign: "center" }}>
      <span className="icon-badge soft center" style={{ width: "4rem", height: "4rem" }}>
        <Icon name="mountain" />
      </span>
      <h1 className="mt-6" style={{ fontSize: "clamp(2rem,1.5rem + 2vw,3rem)" }}>Stran ni najdena</h1>
      <p className="muted mt-2" style={{ maxWidth: "32rem", marginInline: "auto" }}>
        Žal iskane strani ni mogoče najti. Morda je bila premaknjena ali pa je povezava napačna.
      </p>
      <div className="mt-8" style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/" className="btn btn-primary">Na domačo stran</Link>
        <Link to="/pohodi" className="btn btn-outline">Poglej pohode</Link>
      </div>
    </div>
  );
}
