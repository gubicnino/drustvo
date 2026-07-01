import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <>
      <a href="#vsebina" className="skip-link">
        Preskoči na vsebino
      </a>
      <Header />
      <main id="vsebina">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
